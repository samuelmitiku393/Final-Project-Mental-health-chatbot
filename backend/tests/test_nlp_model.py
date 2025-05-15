import pytest
from backend.app.models.nlp_model import NLPModel
from pathlib import Path

@pytest.fixture
def nlp_model():
    return NLPModel()

def test_model_loading(nlp_model):
    """Test that the model loads successfully"""
    assert nlp_model.model is not None
    assert nlp_model.vectorizer is not None

def test_intent_prediction(nlp_model):
    """Test prediction on sample inputs"""
    test_cases = [
        ("I feel so depressed", "depression"),
        ("I'm having anxiety attacks", "anxiety"),
        ("I can't sleep at night", "sleep"),
        ("I want to end it all", "emergency"),
    ]
    
    for text, expected in test_cases:
        assert nlp_model.predict(text) == expected

def test_fallback_handling(nlp_model, monkeypatch):
    """Test behavior when model fails to load"""
    # Simulate model loading failure
    monkeypatch.setattr(nlp_model, 'model', None)
    assert nlp_model.predict("test") is None