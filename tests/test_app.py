import pytest
from app import app
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_page(client):
    """Test that the index page loads correctly."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Election Process Assistant" in response.data

def test_chat_endpoint_no_data(client):
    """Test the chat endpoint without sending data."""
    response = client.post('/api/chat', json={})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_chat_endpoint_missing_message(client):
    """Test the chat endpoint missing the message field."""
    response = client.post('/api/chat', json={"wrong_key": "hello"})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

from unittest.mock import patch, MagicMock

def test_chat_endpoint_invalid_method(client):
    """Test that GET requests to the chat endpoint are not allowed."""
    response = client.get('/api/chat')
    assert response.status_code == 405

@patch('app.model')
def test_chat_endpoint_success(mock_model, client):
    """Test a successful chat interaction with mocked Gemini response."""

    mock_response = MagicMock()
    mock_response.text = "This is a mocked educational response about voting."
    mock_model.generate_content.return_value = mock_response

    response = client.post('/api/chat', json={"message": "What is voting?"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "response" in data
    assert data["response"] == "This is a mocked educational response about voting."

    mock_model.generate_content.assert_called_once()

@patch('app.model')
def test_chat_endpoint_api_failure(mock_model, client):
    """Test the chat endpoint handling an API failure."""
    mock_model.generate_content.side_effect = Exception("API Error")

    response = client.post('/api/chat', json={"message": "What is the electoral college?"})
    assert response.status_code == 500
    data = json.loads(response.data)
    assert "error" in data
    assert data["error"] == "An error occurred while communicating with the AI."

def test_chat_uninitialized_model(client):
    """Test the chat endpoint when the AI model fails to initialize."""
    with patch('app.model', None):
        response = client.post('/api/chat', json={"message": "Hello"})
        assert response.status_code == 500
        data = json.loads(response.data)
        assert data["error"] == "Gemini API is not configured or failed to initialize."
