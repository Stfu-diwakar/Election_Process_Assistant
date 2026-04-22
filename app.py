import os
from flask import Flask, request, jsonify, render_template, send_from_directory
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    
# Initialize the model
# We use gemini-1.5-flash as it is efficient and suitable for general text tasks
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    model = None
    print(f"Failed to initialize Gemini model: {e}")

@app.route('/')
def index():
    """Serve the main application page."""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests to the Gemini API."""
    if not model:
        return jsonify({"error": "Gemini API is not configured or failed to initialize."}), 500

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Invalid request. 'message' field is required."}), 400

    user_message = data['message']
    
    # System prompt to ensure the assistant stays on topic
    system_prompt = (
        "You are an interactive Election Process Assistant. "
        "Your job is to help users understand the election process, timelines, and steps. "
        "Provide clear, concise, and easy-to-follow answers. "
        "Ensure your tone is neutral, educational, and accessible. "
        "Do not answer questions unrelated to elections or civics."
    )
    
    prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"

    try:
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({"error": "An error occurred while communicating with the AI."}), 500

if __name__ == '__main__':
    # Use PORT environment variable if available, otherwise default to 5000
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
