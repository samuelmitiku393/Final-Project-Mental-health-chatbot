import json
import pandas as pd
import numpy as np
from pathlib import Path
import re
import logging
from typing import Dict, List, Tuple, Optional

# NLP and ML imports
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Deep Learning imports
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Embedding, LSTM, Bidirectional, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize NLP tools
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

class MentalHealthChatbot:
    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_config(config_path)
        self.tokenizer = None
        self.model = None
        self.max_seq_length = 50

        self.models_dir = Path(__file__).parents[1] / "models"
        self.models_dir.mkdir(exist_ok=True)

    def _load_config(self, config_path: Optional[str] = None) -> Dict:
        default_config = {
            "intent_mapping": {
                "greeting": ["hello", "hi", "hey"],
                "depression": ["sad", "depressed", "unhappy"],
                "anxiety": ["anxious", "nervous", "stressed"],
                "general": ["how", "what", "why"],
                "emergency": ["suicide", "kill myself", "end it all"]
            },
            "model_params": {
                "embedding_dim": 128,
                "lstm_units": 64,
                "dropout_rate": 0.3,
                "context_dim": 32,
                "learning_rate": 0.001,
                "vocab_size": 5000,
                "epochs": 20,
                "batch_size": 32
            }
        }

        if config_path is None:
            config_path = Path(__file__).parents[1] / "config"
        else:
            config_path = Path(config_path)

        if config_path.exists():
            try:
                intent_path = config_path / "intent_mapping.json"
                if intent_path.exists():
                    with open(intent_path) as f:
                        default_config["intent_mapping"] = json.load(f)

                params_path = config_path / "model_params.json"
                if params_path.exists():
                    with open(params_path) as f:
                        default_config["model_params"].update(json.load(f))
            except Exception as e:
                logger.warning(f"Error loading config files: {e}. Using defaults.")
        else:
            logger.warning(f"Config directory not found at {config_path}. Using defaults.")

        return default_config

    def preprocess_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""

        text = text.lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        tokens = [lemmatizer.lemmatize(word) for word in text.split()]
        tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
        return ' '.join(tokens)

    def _create_model(self, vocab_size: int, num_intents: int) -> Model:
        text_input = Input(shape=(self.max_seq_length,), name='text_input')
        embedding = Embedding(
            input_dim=vocab_size + 1,
            output_dim=self.config["model_params"]["embedding_dim"],
            input_length=self.max_seq_length,
            mask_zero=True,
            name='embedding'
        )(text_input)
        lstm = Bidirectional(
            LSTM(self.config["model_params"]["lstm_units"], return_sequences=False),
            name='bidirectional_lstm'
        )(embedding)
        dropout = Dropout(self.config["model_params"]["dropout_rate"], name='dropout')(lstm)
        intent_output = Dense(num_intents, activation='softmax', name='intent_output')(dropout)
        context = Dense(self.config["model_params"]["context_dim"], activation='tanh', name='context_layer')(dropout)
        model = Model(inputs=text_input, outputs=[intent_output, context], name='mental_health_chatbot_model')
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=self.config["model_params"]["learning_rate"]),
            loss={'intent_output': 'categorical_crossentropy', 'context_layer': 'mse'},
            metrics={'intent_output': 'accuracy'}
        )
        return model

    def train(self, data_path: str, save_dir: Optional[str] = None):
        try:
            df = self._load_data(data_path)
            X_train, X_test, y_train, y_test = train_test_split(
                df['processed_text'],
                pd.get_dummies(df['intent']),
                test_size=0.2,
                random_state=42,
                stratify=df['intent']
            )
            self.tokenizer = Tokenizer(num_words=self.config["model_params"]["vocab_size"], oov_token='<OOV>')
            self.tokenizer.fit_on_texts(X_train)
            X_train_seq = pad_sequences(self.tokenizer.texts_to_sequences(X_train), maxlen=self.max_seq_length)
            X_test_seq = pad_sequences(self.tokenizer.texts_to_sequences(X_test), maxlen=self.max_seq_length)

            self.model = self._create_model(len(self.tokenizer.word_index), len(self.config["intent_mapping"]))

            callbacks = [
                EarlyStopping(patience=5, restore_best_weights=True),
                ModelCheckpoint(
                    filepath=str(self.models_dir / 'best_model.keras'),
                    save_best_only=True,
                    monitor='val_intent_output_accuracy',
                    mode='max'
                )
            ]

            history = self.model.fit(
                X_train_seq,
                {'intent_output': y_train.values, 'context_layer': np.zeros((len(X_train), self.config["model_params"]["context_dim"]))},
                validation_data=(X_test_seq, {'intent_output': y_test.values, 'context_layer': np.zeros((len(X_test), self.config["model_params"]["context_dim"]))}),
                epochs=self.config["model_params"]["epochs"],
                batch_size=self.config["model_params"]["batch_size"],
                callbacks=callbacks,
                verbose=1
            )
            self._save_model()
            return history
        except Exception as e:
            logger.error(f"Training failed: {e}")
            raise

    def _load_data(self, data_path: str) -> pd.DataFrame:
        try:
            with open(data_path) as f:
                conversations = json.load(f)
            df = pd.DataFrame(conversations)
            df['intent'] = df["user_input"].apply(lambda x: self._classify_intent(x, self.config["intent_mapping"]))
            df['processed_text'] = df["user_input"].apply(self.preprocess_text)
            return self._balance_dataset(df)
        except Exception as e:
            logger.error(f"Data loading error: {e}")
            raise

    def _classify_intent(self, text: str, intent_mapping: Dict) -> str:
        if not isinstance(text, str):
            return "general"
        text = text.lower()
        for intent, keywords in intent_mapping.items():
            if any(keyword in text for keyword in keywords):
                return intent
        return "general"

    def _balance_dataset(self, df: pd.DataFrame) -> pd.DataFrame:
        intent_counts = df['intent'].value_counts()
        max_samples = intent_counts.max()
        balanced_dfs = []
        for intent, count in intent_counts.items():
            intent_df = df[df['intent'] == intent]
            if count < max_samples:
                intent_df = intent_df.sample(max_samples, replace=True, random_state=42)
            balanced_dfs.append(intent_df)
        return pd.concat(balanced_dfs).sample(frac=1, random_state=42)

    def _save_model(self):
        try:
            self.model.save(self.models_dir / 'chatbot_model.keras_model')
            with open(self.models_dir / 'tokenizer.json', 'w') as f:
                f.write(self.tokenizer.to_json())
            with open(self.models_dir / 'config.json', 'w') as f:
                json.dump(self.config, f)
            logger.info("Model components saved successfully.")
        except Exception as e:
            logger.error(f"Error saving model components: {e}")
print("[INFO] Training started...")
print("[INFO] Training completed. Saving model...")
