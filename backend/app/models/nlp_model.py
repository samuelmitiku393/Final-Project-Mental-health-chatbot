from joblib import load
from pathlib import Path
import logging
import warnings
import numpy as np
from typing import Optional, Tuple, Dict
import time
from dataclasses import dataclass

# Configure Python's standard warnings for better performance
warnings.filterwarnings('ignore', category=UserWarning)
logger = logging.getLogger(__name__)

@dataclass
class ModelPerformance:
    load_time: float
    predict_time: float
    last_prediction: Optional[str] = None

class NLPModel:
    def __init__(self, model_dir: Optional[Path] = None):
        """
        Enhanced NLP model loader with performance monitoring and fallback capabilities
        
        Args:
            model_dir: Optional custom directory for model files
        """
        self.model = None
        self.vectorizer = None
        self.fallback_model = None
        self.performance = ModelPerformance(0.0, 0.0)
        self._model_dir = model_dir
        self._load_models()
        self._setup_fallback()

    def _load_models(self) -> None:
        """Load primary models with performance tracking and validation"""
        start_time = time.time()
        try:
            model_path = self._model_dir or Path(__file__).parent.parent / "models"
            logger.info(f"🔍 Loading models from: {model_path}")

            # Validate model directory
            if not model_path.exists():
                raise FileNotFoundError(f"Model directory not found: {model_path}")

            # Load with memory mapping for large files
            self.vectorizer = load(model_path / 'vectorizer.joblib', mmap_mode='r')
            self.model = load(model_path / 'intent_classifier.joblib', mmap_mode='r')
            
            # Validate model components
            self._validate_models()
            
            # Warm up the model
            self._warm_up()
            
            self.performance.load_time = time.time() - start_time
            logger.info(f"✅ Models loaded successfully in {self.performance.load_time:.2f}s")

        except Exception as e:
            logger.critical(f"❌ Model loading failed: {e}")
            self._handle_load_failure()

    def _validate_models(self) -> None:
        """Validate that loaded models are functional"""
        test_text = "hello world"
        X = self.vectorizer.transform([test_text])
        try:
            self.model.predict(X)
        except Exception as e:
            raise RuntimeError(f"Model validation failed: {e}")

    def _setup_fallback(self) -> None:
        """Initialize simple fallback model for when primary model fails"""
        self.fallback_keywords = {
            'greeting': ['hello', 'hi', 'hey'],
            'depression': ['depressed', 'sad', 'hopeless'],
            'anxiety': ['anxious', 'worry', 'panic'],
            'emergency': ['suicide', 'kill myself', 'end it all']
        }

    def _warm_up(self) -> None:
        """Warm up model with sample predictions"""
        samples = ["hello", "I feel sad", "I'm anxious", "help"]
        for text in samples:
            self.predict(text)

    def predict(self, text: str) -> Optional[str]:
        """
        Predict intent from text with fallback mechanism
        
        Args:
            text: Input text to classify
            
        Returns:
            Predicted intent label or None if prediction fails
        """
        start_time = time.time()
        try:
            if not text or not isinstance(text, str):
                logger.warning("Empty or invalid input text")
                return None

            processed = self._preprocess_text(text)
            if not processed:
                return None

            # Vectorize and predict
            X = self.vectorizer.transform([processed])
            prediction = self.model.predict(X)[0]
            
            self.performance.predict_time = time.time() - start_time
            self.performance.last_prediction = prediction
            logger.debug(f"Predicted '{prediction}' in {self.performance.predict_time:.4f}s")
            return prediction

        except Exception as e:
            logger.error(f"Prediction failed: {e}, falling back to keyword matching")
            return self._fallback_predict(text)

    def _preprocess_text(self, text: str) -> str:
        """Basic text preprocessing"""
        processed = text.lower().strip()
        if len(processed) < 2:  # Too short to be meaningful
            return ""
        return processed

    def _fallback_predict(self, text: str) -> Optional[str]:
        """Keyword-based fallback prediction when model fails"""
        text_lower = text.lower()
        for intent, keywords in self.fallback_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return intent
        return None

    def _handle_load_failure(self) -> None:
        """Handle model loading failure scenarios"""
        self.model = None
        self.vectorizer = None
        logger.warning("Falling back to keyword matching only")
        
    def get_performance_metrics(self) -> Dict:
        """Get model performance metrics"""
        return {
            'load_time_seconds': self.performance.load_time,
            'avg_predict_time_seconds': self.performance.predict_time,
            'last_prediction': self.performance.last_prediction,
            'model_loaded': self.model is not None,
            'fallback_active': self.model is None
        }

    def health_check(self) -> bool:
        """Check if model is operational"""
        if self.model is None:
            logger.warning("Health check: Primary model not loaded, using fallback")
            return False
        try:
            test_text = "health check"
            X = self.vectorizer.transform([test_text])
            self.model.predict(X)
            return True
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False