<div align="center">

# 🗳️ Election Process Assistant

**Explore how elections work. Understand each stage. Ask questions with an AI-powered civic education assistant.**

An interactive learning experience that explains the election journey—from voter registration and campaigning to voting, counting, and certification.

<br />

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Application-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://election-process-assistant-56mk.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📌 Overview

Election Process Assistant is a civic-education web application built to make the election process easier to understand. Instead of presenting a long block of information, it guides users through four interactive stages and provides an AI chat interface for election- and civics-related questions.

The project combines a lightweight **Flask** backend with a responsive **HTML, CSS, and JavaScript** frontend. The chatbot uses Google's **Gemini 2.5 Flash** model to generate clear, neutral, educational responses.

> **Purpose:** Help people learn about the election process through accessible explanations—not provide political persuasion, voting recommendations, or official election services.

## ✨ Features

| Feature | What it does |
|---|---|
| 🧭 Interactive election timeline | Explore four stages of the election lifecycle. |
| 📚 Step-by-step explanations | Read summaries, detailed descriptions, and practical points for each stage. |
| 🤖 AI civic education assistant | Ask election- and civics-related questions using Gemini 2.5 Flash. |
| 📱 Responsive interface | Use the application on desktop and mobile screens. |
| ⚡ Response caching | Cache identical prompts in the running application to reduce repeated model calls. |
| 🛡️ Basic API protections | Apply request rate limits and response security headers. |
| ☁️ Optional Google Cloud integrations | Supports Cloud Logging, Error Reporting, and Firestore chat logging when configured and available. |

### The four learning stages

1. **Voter Registration** — eligibility, required documents, and registration deadlines.
2. **Campaigning** — candidate platforms, debates, public outreach, and evaluating information.
3. **Election Day** — polling locations, ballot instructions, and voting.
4. **Results & Certification** — vote counting, verification, preliminary results, and official certification.

## 🖼️ Application Preview

Open the [live application](https://election-process-assistant-56mk.onrender.com/) to explore the interactive timeline and ask the assistant a question.

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python, Flask |
| AI model | Google Gemini 2.5 Flash |
| API protection | Flask-Limiter |
| Configuration | python-dotenv |
| Production server | Gunicorn |
| Optional cloud services | Google Cloud Logging, Firestore, Error Reporting |
| Deployment | Render live deployment; Google App Engine configuration is also included |

## 🏗️ How It Works

```text
┌──────────────────────────────────────────────┐
│              User / Web Browser              │
│          HTML  ·  CSS  ·  JavaScript          │
└──────────────────────┬───────────────────────┘
                       │
             Select timeline stage
                or send a question
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 Flask Server                 │
│                                              │
│  GET /          → Serve the web application  │
│  POST /api/chat → Validate and process input│
│  Flask-Limiter  → Apply request limits       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Google Gemini API               │
│                 Gemini 2.5 Flash              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
                AI response to UI

        Optional Google Cloud integrations:
        Firestore · Cloud Logging · Error Reporting
```

## 🚀 Run Locally

### 1. Prerequisites

- Python 3.11 or later
- pip
- A Google Gemini API key

### 2. Clone the repository

```bash
git clone https://github.com/Stfu-diwakar/Election_Process_Assistant.git
cd Election_Process_Assistant
```

### 3. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a file named `.env` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).

**Keep credentials private:** never commit your `.env` file or expose API keys in frontend code, screenshots, or public repositories.

### 6. Start the application

```bash
python main.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

For a production-style local run with Gunicorn (macOS/Linux):

```bash
gunicorn --bind 0.0.0.0:5000 main:app
```

## 🔌 API

### `GET /`

Serves the main application page.

### `POST /api/chat`

Sends a question to the AI assistant.

**Request body:**

```json
{
  "message": "What happens after voter registration?"
}
```

**Successful response:**

```json
{
  "response": "The next stages depend on the election system..."
}
```

The endpoint returns a JSON error response when the request is invalid, the model is unavailable, or the AI service fails. Chat requests are rate-limited.

## ⚙️ Configuration

| Variable | Required | Description |
|---|---:|---|
| `GEMINI_API_KEY` | Yes for AI chat | Google AI Studio API key. |
| `PORT` | No | Port used by the Flask application; defaults to `5000`. |

Google Cloud integrations are optional. The application attempts to initialize Cloud Logging, Error Reporting, and Firestore; if those services are unavailable, the core web application can still start. Firestore chat logging only works when a valid Google Cloud environment and permissions are configured.

## ☁️ Deployment

The repository includes an `app.yaml` for Google App Engine, and the published demo is hosted at:

**[https://election-process-assistant-56mk.onrender.com/](https://election-process-assistant-56mk.onrender.com/)**

For a Render deployment, configure the service with:

| Setting | Value |
|---|---|
| Runtime | Python |
| Build command | `pip install -r requirements.txt` |
| Start command | `gunicorn --bind 0.0.0.0:$PORT main:app` |
| Environment variable | `GEMINI_API_KEY` = your private API key |

Set secrets in the hosting provider's environment-variable settings. Do not place production credentials in `app.yaml` or commit them to Git.

## 📁 Project Structure

```text
Election_Process_Assistant/
├── static/
│   ├── script.js          # Timeline interactions and chat UI
│   └── style.css          # Application styling
├── templates/
│   └── index.html         # Main page template
├── tests/
│   └── test_app.py        # Backend test cases
├── main.py                # Flask application and chat API
├── requirements.txt       # Python dependencies
├── app.yaml               # Google App Engine configuration
└── README.md
```

## 🧪 Tests

Test cases are provided in the `tests/` directory. Before running the suite, make sure the test module imports the Flask application from `main.py` (the current application module) rather than `app.py`.

Once that import is aligned, run:

```bash
pytest -q
```

## 🔐 Security Notes

- Store `GEMINI_API_KEY` as a deployment environment variable or in a secret manager.
- Do not commit real API keys or service-account credentials.
- Keep Flask debug mode disabled in production; use Gunicorn or another production WSGI server.
- Review logging and retention settings before storing user chat content in Firestore.
- The assistant is an educational tool. Users should consult their official election authority for jurisdiction-specific rules, eligibility, deadlines, and polling information.

## 👨‍💻 Author

**Diwakar Jha**  
Master of Computer Applications (AI & ML) — Chandigarh University  
GeeksforGeeks Campus Mantri

- **Portfolio:** [dwkr.lovable.app](https://dwkr.lovable.app/)
- **GitHub:** [@Stfu-diwakar](https://github.com/Stfu-diwakar)
- **LinkedIn:** [Diwakar Jha](https://www.linkedin.com/in/diwakar-jha-064130229/)

---

<div align="center">

**Built to make civic education clearer, more accessible, and easier to explore.**

If you find this project useful, consider giving the repository a ⭐

</div>
