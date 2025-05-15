from joblib import load
from pathlib import Path
import logging
import warnings  # Use Python's standard warnings module
import numpy as np
from typing import Optional

# Configure Python's standard warnings for better performance
warnings.filterwarnings('ignore')  # Ignore warnings globally

logger = logging.getLogger(__name__)

class NLPModel:
    def __init__(self):
        """Ultra-optimized NLP model loader"""
        self.model = None
        self.vectorizer = None
        self._load_models()

    def _load_models(self):
        """Load models with memory optimization"""
        try:
            model_path = Path(__file__).parent.parent / "models"
            logger.info(f"⚡ Loading models from: {model_path}")

            # Memory-mapped loading for large files
            self.vectorizer = load(model_path / 'vectorizer.joblib', mmap_mode='r')
            self.model = load(model_path / 'intent_classifier.joblib', mmap_mode='r')
            
            # Warm up the model
            self._warm_up()
            logger.info("🚀 Models loaded and warmed up")

        except Exception as e:
            logger.critical(f"❌ Model loading failed: {e}")
            raise

    def _warm_up(self):
        """Run initial prediction to load model into memory"""
        dummy_text = "hello"
        self.predict(dummy_text)

    def predict(self, text: str) -> Optional[str]:
        """Optimized prediction pipeline"""
        try:
            processed = text.lower().strip()
            if not processed:
                return None
                
            X = self.vectorizer.transform([processed])
            return self.model.predict(X)[0]
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return None
