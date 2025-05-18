import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Set
import re
import logging
from dataclasses import dataclass
from enum import Enum, auto

logger = logging.getLogger(__name__)

class Sentiment(Enum):
    POSITIVE = auto()
    NEGATIVE = auto()
    NEUTRAL = auto()
    EXTREME_NEGATIVE = auto()

@dataclass
class Intent:
    tag: str
    patterns: List[str]
    context: Set[str]
    priority: int
    sentiment: Sentiment
    metadata: Dict
    is_emergency: bool = False

class IntentManager:
    def __init__(self, config_path: Optional[Path] = None):
        """
        Initialize IntentManager with configuration from specified path.
        If no path provided, uses default config/intent_mapping.json location.
        """
        self._config_path = config_path or self._get_default_config_path()
        self.intents: Dict[str, Intent] = {}
        self._pattern_cache: Dict[str, List[re.Pattern]] = {}
        self._emergency_intents: Set[str] = set()
        
        try:
            self._initialize()
        except Exception as e:
            logger.critical(f"IntentManager initialization failed: {e}")
            raise

    def _get_default_config_path(self) -> Path:
        """Get default path to intent mapping configuration"""
        return Path(__file__).parent.parent.parent / "config" / "intent_mapping.json"

    def _initialize(self) -> None:
        """Load and validate intents, build pattern cache"""
        self.intents = self._load_and_validate_intents()
        self._build_pattern_cache()
        self._identify_emergency_intents()

    def _load_and_validate_intents(self) -> Dict[str, Intent]:
        """Load and validate intent configuration"""
        with open(self._config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        intents = {}
        for intent_data in data.get('intents', []):
            try:
                intent = self._create_intent(intent_data)
                intents[intent.tag] = intent
            except (KeyError, ValueError) as e:
                logger.error(f"Skipping invalid intent configuration: {e}")
                continue
                
        if not intents:
            raise ValueError("No valid intents found in configuration")
            
        return intents

    def _create_intent(self, intent_data: Dict) -> Intent:
        """Create and validate an Intent object from raw data"""
        required_fields = ['tag', 'patterns']
        if not all(field in intent_data for field in required_fields):
            raise KeyError(f"Missing required intent fields: {required_fields}")

        # Convert sentiment string to Enum
        sentiment_str = intent_data.get('sentiment', 'neutral').upper()
        try:
            sentiment = Sentiment[sentiment_str]
        except KeyError:
            sentiment = Sentiment.NEUTRAL
            logger.warning(f"Invalid sentiment '{sentiment_str}' for intent {intent_data['tag']}, defaulting to NEUTRAL")

        return Intent(
            tag=intent_data['tag'],
            patterns=intent_data['patterns'],
            context=set(intent_data.get('context', [])),
            priority=int(intent_data.get('priority', 1)),
            sentiment=sentiment,
            metadata=intent_data.get('metadata', {}),
            is_emergency=intent_data.get('priority', 1) >= 4
        )

    def _build_pattern_cache(self) -> None:
        """Precompile regex patterns for efficient matching"""
        for intent_tag, intent in self.intents.items():
            compiled_patterns = []
            for pattern in intent.patterns:
                try:
                    # Create optimized regex pattern with raw string
                    compiled = re.compile(
                        r'(?:^|\W)' + re.escape(pattern.lower()) + r'(?:$|\W)',
                        re.IGNORECASE
                    )
                    compiled_patterns.append(compiled)
                except re.error as e:
                    logger.warning(f"Invalid regex pattern '{pattern}' for intent {intent_tag}: {e}")
            self._pattern_cache[intent_tag] = compiled_patterns

    def _identify_emergency_intents(self) -> None:
        """Identify and cache emergency intents for quick access"""
        self._emergency_intents = {
            tag for tag, intent in self.intents.items() 
            if intent.is_emergency
        }

    def classify_intent(self, text: str) -> Tuple[Optional[Intent], float]:
        """
        Classify text with confidence score (0-1)
        
        Args:
            text: Input text to classify
            
        Returns:
            Tuple of (matched Intent, confidence score)
        """
        if not text or not isinstance(text, str):
            return None, 0.0
            
        text_lower = text.lower().strip()
        if not text_lower:
            return None, 0.0

        # Check for emergency intents first
        emergency_result = self._check_emergency_intents(text_lower)
        if emergency_result:
            return emergency_result

        # Check regular intents
        best_match, highest_score = self._match_regular_intents(text_lower)
        
        # Fallback to keyword matching if no strong pattern match
        if best_match is None or highest_score < 0.7:
            fallback_match = self._keyword_fallback(text_lower)
            if fallback_match:
                return fallback_match, 0.5
                
        return best_match, min(highest_score, 1.0)

    def _check_emergency_intents(self, text_lower: str) -> Optional[Tuple[Intent, float]]:
        """Check for emergency intents with priority"""
        for intent_tag in self._emergency_intents:
            for pattern in self._pattern_cache.get(intent_tag, []):
                if pattern.search(text_lower):
                    return self.intents[intent_tag], 1.0
        return None

    def _match_regular_intents(self, text_lower: str) -> Tuple[Optional[Intent], float]:
        """Match against regular intents with scoring"""
        best_match = None
        highest_score = 0.0
        
        for intent_tag, patterns in self._pattern_cache.items():
            if intent_tag in self._emergency_intents:
                continue  # Skip emergency intents already checked
                
            for pattern in patterns:
                if pattern.search(text_lower):
                    # Score based on pattern specificity and match quality
                    match_score = self._calculate_match_score(pattern, text_lower)
                    if match_score > highest_score:
                        highest_score = match_score
                        best_match = self.intents[intent_tag]
                        
        return best_match, highest_score

    def _calculate_match_score(self, pattern: re.Pattern, text: str) -> float:
        """Calculate match quality score (0-1)"""
        # Base score on pattern length (longer patterns are more specific)
        base_score = min(len(pattern.pattern) / 50, 1.0)
        
        # Boost score for exact matches
        match = pattern.search(text)
        if match and match.group(0).strip() == pattern.pattern.strip(r'(?:^|\W)|(?:$|\W)'):
            base_score = min(base_score + 0.2, 1.0)
            
        return base_score

    def _keyword_fallback(self, text_lower: str) -> Optional[Tuple[Intent, float]]:
        """Fallback classification using keyword presence"""
        for intent in self.intents.values():
            if any(keyword in text_lower for keyword in intent.patterns):
                return intent, 0.5
        return None

    def get_emergency_protocol(self, intent_tag: str) -> Optional[Dict]:
        """Get emergency protocol for high-priority intent"""
        intent = self.intents.get(intent_tag)
        if intent and intent.is_emergency:
            return intent.metadata.get('emergency_protocol')
        return None

    def get_intent_by_tag(self, tag: str) -> Optional[Intent]:
        """Get intent by its tag"""
        return self.intents.get(tag)

    def get_all_intents(self) -> Dict[str, Intent]:
        """Get all configured intents"""
        return self.intents.copy()

    def refresh_intents(self) -> bool:
        """Reload intents from configuration file"""
        try:
            new_intents = self._load_and_validate_intents()
            self.intents = new_intents
            self._build_pattern_cache()
            self._identify_emergency_intents()
            return True
        except Exception as e:
            logger.error(f"Failed to refresh intents: {e}")
            return False