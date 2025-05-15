from backend.app.models.chat_model import ChatModel

def test_chat_with_nlp():
    chat = ChatModel()
    responses = {
        "I'm feeling depressed": "depression",
        "I had a panic attack": "anxiety",
        "I can't sleep": "sleep",
    }
    
    for message, intent in responses.items():
        response = chat.get_response(message)
        assert response  # Just check we get some response
        # You might want to check response contains certain keywords
        assert any(word in response.lower() for word in ["support", "help", "resource"])