<div align="center">
  <h1>🗳️ Election Process Education Assistant</h1>
  <p>An interactive, AI-powered educational platform designed to help voters navigate the election process.</p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge&logo=googlecloud)](https://election-assistant-dwkr.el.r.appspot.com/)
  <br />
</div>

<hr />

## 📖 About The Project

Understanding how elections work shouldn't be complicated. The **Election Process Education Assistant** is a web application that breaks down the democratic process into simple, digestible steps. Whether you want to learn about voter registration, the campaigning phase, election day, or how results are certified, this platform guides you through it.

To make learning even easier, the platform features a built-in AI Assistant powered by Google's Gemini API, capable of answering specific questions about civics, voting, and the election process in real-time.

## ✨ Core Features

* **Interactive Timeline:** A visually engaging, step-by-step breakdown of the entire election lifecycle.
* **Intelligent Chatbot:** Ask complex civics questions and get clear, neutral, and educational answers powered by Gemini 2.5 Flash.
* **Accessible UI/UX:** Clean, responsive design that works seamlessly on desktop and mobile devices.
* **Fast & Lightweight:** Built with modern vanilla CSS/JS and a lightweight Flask backend.

## 🛠️ Built With

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Python, Flask
* **AI Engine:** Google Generative AI (Gemini 2.5 Flash)
* **Hosting:** Google Cloud App Engine

## 💻 Getting Started Locally

If you'd like to run this project on your local machine, follow these steps:

### Prerequisites
* Python 3.9+
* A Google Gemini API Key

## Project Structure

```text
Election_process_edu/
├── static/
│   ├── script.js        # Frontend chat logic
│   └── style.css        # UI styling
├── templates/
│   └── index.html       # Main application interface
├── tests/
│   └── test_app.py      # Unit testing files
├── venv/                # Virtual environment (ignored in git)
├── app.yaml             # Google App Engine configuration
├── main.py              # Flask application and API routes
└── requirements.txt     # Python dependencies
```
## Deployment

This project is configured for Google App Engine. To deploy:

1. **Authenticate with Google Cloud CLI:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
Deploy the application:

Bash
gcloud app deploy
Browse the live application:

Bash
gcloud app browse
Note: Ensure you do not hardcode production API keys in your app.yaml. Use Secret Manager or environment variables securely configured in GCP.

**Author**
## Diwakar Jha
```
Master of Computer Applications (AI & ML) at Chandigarh University

GeeksforGeeks Campus Mantri

Portfolio: dwkr.lovable.app

GitHub: @Stfu-diwakar
```
