import random
import re
import requests
import os
from typing import List, Dict, Optional


class AIResponseGenerator:
    def __init__(self, deepseek_api_key: Optional[str] = None):
        self.responses = {
            "depression": [
                "It sounds like you're carrying a heavy emotional burden...",
                "You're not alone in this. Many people feel this way and find a path forward.",
                "I'm here to listen. Can you tell me more about what you're feeling?",
            ],
            "anxiety": [
                "Anxiety can feel overwhelming, but you're not alone.",
                "It helps to talk about it. What's been making you feel anxious lately?",
                "You're doing your best, and that's enough right now.",
            ],
            "default": [
                "I want to understand what you're experiencing...",
                "Thanks for sharing. How long have you been feeling this way?",
                "Let's take this one step at a time. What's been on your mind?",
            ]
        }

        self.urgent_keywords = {
            "immediate": ["kill myself", "suicide", "end it all"],
            "concerning": ["hopeless", "worthless", "no point"]
        }

        self.intent_keywords = {
            "depression": ["depress", "sad", "hopeless", "empty", "lonely"],
            "anxiety": ["anxious", "worry", "panic", "nervous", "uneasy"]
        }

        self.conversation_history = []
        self.user_name = None
        self.last_intent = None

        self.deepseek_api_key = deepseek_api_key
        self.api_url = "https://api.deepseek.ai/v1/chat/completions"

        self.sentiment_words = {
            "positive": ["hope", "better", "improve", "optimistic", "relief"],
            "negative": ["worst", "terrible", "hopeless", "worthless", "panic"]
        }

    def _detect_urgency(self, message: str) -> Optional[str]:
        lower_msg = message.lower()
        for phrase in self.urgent_keywords["immediate"]:
            if phrase in lower_msg:
                return "immediate"
        for phrase in self.urgent_keywords["concerning"]:
            if phrase in lower_msg:
                return "concerning"
        return None

    def _get_rule_based_response(self, intent: str) -> str:
        options = self.responses.get(intent, self.responses["default"])
        return random.choice(options)

    def _call_deepseek_api(self, message: str) -> str:
        if not self.deepseek_api_key:
            return self._get_rule_based_response("default")

        headers = {
            "Authorization": f"Bearer {self.deepseek_api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You're a compassionate mental health supporter. "
                               "Respond with empathy and care. Keep responses under 3 sentences. "
                               "If urgent risk is detected, provide crisis resources."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "temperature": 0.7,
            "max_tokens": 150
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"API Error: {e}")
            return self._get_rule_based_response("default")

    def _personalize_response(self, response: str, message: str) -> str:
        if self.user_name:
            response = response.replace("you", f"you, {self.user_name}", 1)

        sentiment = self._analyze_sentiment(message)
        if sentiment < -0.5:
            response = "I hear the pain in your words... " + response
        return response

    def _analyze_sentiment(self, message: str) -> float:
        words = re.findall(r'\w+', message.lower())
        pos = sum(1 for w in words if w in self.sentiment_words["positive"])
        neg = sum(1 for w in words if w in self.sentiment_words["negative"])
        total = pos + neg
        return (pos - neg) / total if total else 0

    def _detect_intent(self, message: str) -> str:
        lower_msg = message.lower()
        for intent, keywords in self.intent_keywords.items():
            if any(word in lower_msg for word in keywords):
                return intent
        return "default"

    def generate(self, message: str, intent: Optional[str] = None) -> str:
        self.conversation_history.append(message)
        if intent is None:
            intent = self._detect_intent(message)
        self.last_intent = intent

        urgency = self._detect_urgency(message)
        if urgency == "immediate":
            return ("I'm deeply concerned about your safety. Please call a crisis hotline now. "
                    "You're not alone - help is available immediately.")
        elif urgency == "concerning":
            return ("What you're describing sounds serious. Have you considered speaking with "
                    "a mental health professional about these feelings?")

        # Extract name if not already known
        if not self.user_name:
            name_match = re.search(r"(my name is|i'm called|i am|i'm)\s+([A-Za-z]+)", message, re.I)
            if name_match:
                self.user_name = name_match.group(2)

        if intent in self.responses and intent != "default":
            base_response = self._get_rule_based_response(intent)
            response = self._personalize_response(base_response, message)
        else:
            response = self._call_deepseek_api(message)

        return ' '.join(response.split()[:100])

    def get_conversation_summary(self) -> str:
        if not self.conversation_history:
            return "No conversation history yet"
        last_msgs = "\n".join(self.conversation_history[-3:])
        return f"Recent conversation (last intent: {self.last_intent}):\n{last_msgs}"

