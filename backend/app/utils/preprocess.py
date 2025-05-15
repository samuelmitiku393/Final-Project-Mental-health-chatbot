import json
from pathlib import Path
from typing import Dict, List
import logging
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import re

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text: str) -> str:
    """Clean and preprocess text for NLP model"""
    # Lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Remove punctuation and special chars
    text = re.sub(r'[^\w\s]', '', text)
    # Tokenize and lemmatize
    tokens = [lemmatizer.lemmatize(word) for word in text.split()]
    # Remove stopwords
    tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
    return ' '.join(tokens)

def classify_intent(text: str) -> str:
    """Basic intent classification"""
    text = text.lower()
    if any(word in text for word in ["depress", "sad", "hopeless"]):
        return "depression"
    elif any(word in text for word in ["anxi", "panic", "stress"]):
        return "anxiety"
    elif any(word in text for word in ["suicid", "kill myself", "end it"]):
        return "emergency"
    elif any(word in text for word in ["sleep", "insomnia"]):
        return "sleep"
    else:
        return "general"

class DataProcessor:
    def __init__(self):
        try:
            # More reliable path resolution
            base_path = Path(__file__).parents[2]
            self.raw_data_path = base_path / "data" / "raw" / "dataset.json"
            self.processed_path = base_path / "data" / "processed" / "intents.json"
            
            # Ensure directories exist
            self.raw_data_path.parent.mkdir(parents=True, exist_ok=True)
            self.processed_path.parent.mkdir(parents=True, exist_ok=True)
            
        except Exception as e:
            logging.error(f"Path initialization failed: {e}")
            raise

    def load_and_process(self) -> Dict:
        """Process raw conversations into intent-response pairs"""
        try:
            if not self.raw_data_path.exists():
                self._create_sample_dataset()
                logging.warning(f"Created sample dataset at {self.raw_data_path}")
                
            with open(self.raw_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            intents = {}
            for item in data:
                try:
                    intent = classify_intent(item["Context"])  # Changed to use the module function
                    if intent not in intents:
                        intents[intent] = {"patterns": [], "responses": []}
                    intents[intent]["patterns"].append(item["Context"])
                    intents[intent]["responses"].append(item["Response"])
                except KeyError as e:
                    logging.warning(f"Missing key in data item: {e}")
                    continue
            
            self._save_processed(intents)
            return intents
            
        except json.JSONDecodeError:
            logging.error(f"Invalid JSON in {self.raw_data_path}")
            raise
        except Exception as e:
            logging.error(f"Processing failed: {e}")
            raise

    def _create_sample_dataset(self):
        """Create a sample dataset if none exists"""
        sample_data = [
            {
                "Context": "I've been feeling really depressed lately",
                "Response": "I'm sorry to hear that. Have you considered speaking with a professional?"
            },
            {
                "Context": "I'm having anxiety attacks",
                "Response": "That sounds difficult. Try some deep breathing exercises."
            }
        ]
        with open(self.raw_data_path, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, indent=2)

    def _save_processed(self, intents: Dict):
        """Save processed intents to JSON"""
        with open(self.processed_path, 'w', encoding='utf-8') as f:
            json.dump(intents, f, indent=2)