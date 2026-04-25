import os
import functools
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import google.generativeai as genai
from dotenv import load_dotenv


try:
    import google.cloud.logging
    client = google.cloud.logging.Client()
    client.setup_logging()
except Exception as e:
    print(f"Google Cloud Logging not initialized: {e}")


load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')


limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)


API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    

try:
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    model = None
    print(f"Failed to initialize Gemini model: {e}")

@app.route('/')
def index():
    """Serve the main application page."""
    return render_template('index.html')

@app.after_request
def add_security_headers(response):
    """Add security headers to every response."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

@functools.lru_cache(maxsize=128)
def get_cached_response(prompt):
    """Get response from Gemini, caching identical prompts for efficiency."""
    if not model:
        raise Exception("Model not initialized")
    return model.generate_content(prompt)

@app.route('/api/chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    """Handle chat requests to the Gemini API."""
    if not model:
        return jsonify({"error": "Gemini API is not configured or failed to initialize."}), 500

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Invalid request. 'message' field is required."}), 400

    user_message = data['message']
    

    system_prompt = (
        "You are an interactive Election Process Assistant. "
        "Your job is to help users understand the election process, timelines, and steps. "
        "Provide clear, concise, and easy-to-follow answers. "
        "Ensure your tone is neutral, educational, and accessible. "
        "Do not answer questions unrelated to elections or civics."
    )
    
    prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"

    try:
        response = get_cached_response(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({"error": "An error occurred while communicating with the AI."}), 500

if __name__ == '__main__':

    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
