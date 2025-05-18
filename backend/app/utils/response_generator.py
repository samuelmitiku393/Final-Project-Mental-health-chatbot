import random
import re
from typing import Dict, List, Optional, Tuple, Set
from enum import Enum
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ConversationState(Enum):
    INITIAL = 1
    FOLLOW_UP = 2
    RESOLUTION = 3
    CRISIS = 4

class AIResponseGenerator:
    def __init__(self, intent_manager=None):
        """Advanced mental health response generator with contextual awareness"""
        self.responses = self._initialize_responses()
        self.resources = self._initialize_resources()
        self.crisis_keywords = self._initialize_crisis_keywords()
        self._setup_conversation_tracking()
        self.intent_manager = intent_manager

    def _initialize_responses(self) -> Dict:
        """Initialize comprehensive response library with actionable strategies"""
        return {
            "depression": {
                "initial": [
                    "I hear the pain in your words. When feeling this way, try breaking tasks into tiny steps. Would you like to share more?",
                    "Depression can feel overwhelming. Right now, focus on one small thing you can do today. Want to talk about it?"
                ],
                "follow_up": {
                    "duration": [
                        "How long have you felt this way? Tracking small wins helps - even getting up is an achievement.",
                        "Is this recent or ongoing? Noticing patterns helps prepare for tough times."
                    ],
                    "triggers": [
                        "What makes these feelings stronger? Identifying triggers helps build coping strategies.",
                        "What typically worsens these feelings? Recognizing them is the first step to managing."
                    ],
                    "impact": [
                        "How has this affected your daily life? Be gentle with yourself - basic tasks can feel hard.",
                        "How has this impacted your routine? Adjusting expectations temporarily can reduce pressure."
                    ]
                },
                "coping": [
                    "When you've felt this before, what helped slightly? Building on small successes creates momentum.",
                    "Have any strategies provided relief? Try the 5-minute rule - commit to an activity for just 5 minutes."
                ],
                "validation": [
                    "This sounds incredibly hard. Remember depression lies - your worth isn't defined by current struggles.",
                    "Living with depression takes strength. Reaching out takes courage when everything feels heavy."
                ],
                "professional": [
                    "A therapist could help develop personalized tools. Want info about professional support?",
                    "Depression often responds well to treatment. Open to exploring support options?"
                ],
                "actionable": [
                    "Right now, write down one tiny thing you can do today - even drinking water or opening a window.",
                    "When depressed, try the '5 senses' exercise: Notice one thing you see, hear, touch, smell, and taste."
                ]
            },
            "anxiety": {
                "initial": [
                    "Anxiety can feel like a false alarm. Try slow breaths: inhale 4 counts, hold 4, exhale 6. Want to talk about triggers?",
                    "I hear your worry. Place both feet flat, notice how it feels. Want to explore what's coming up?"
                ],
                "follow_up": {
                    "physical": [
                        "Noticed physical symptoms like rapid heartbeat? Place a hand on chest, breathe slowly to calm your system.",
                        "How does your body react to anxiety? Try tensing then releasing each muscle group progressively."
                    ],
                    "triggers": [
                        "What situations trigger these feelings? Identifying them helps prepare calming strategies.",
                        "Notice any anxiety patterns? Recognizing 'This is my anxiety talking' creates helpful distance."
                    ],
                    "frequency": [
                        "How often does this happen? Daily grounding exercises can build resilience over time.",
                        "Is this occasional or constant? Regular mindfulness can reduce baseline anxiety."
                    ]
                },
                "grounding": [
                    "Let's try grounding: Name 3 things you see, 2 you can touch, 1 you hear. How does that feel?",
                    "When anxious, try 5-4-3-2-1: Notice 5 things around you, 4 touchable, 3 sounds, 2 smells, 1 taste."
                ],
                "validation": [
                    "Managing anxiety is exhausting. You're showing strength by facing these feelings.",
                    "Anxiety makes everything feel threatening. These feelings will pass, even when they seem permanent."
                ],
                "actionable": [
                    "Try 'box breathing': inhale 4, hold 4, exhale 4, pause 4. Repeat until calmer.",
                    "When thoughts race, write them down. Seeing them on paper can reduce their intensity."
                ]
            },
            "trauma": {
                "initial": [
                    "It sounds like you've been through something difficult. You're safe here to share at your own pace.",
                    "Talking about trauma can be hard. I'm here when you're ready, with no pressure."
                ],
                "follow_up": {
                    "safety": [
                        "Do you feel physically and emotionally safe right now? Your safety is most important.",
                        "Are you in a comfortable place to discuss this? We can pause anytime."
                    ],
                    "support": [
                        "Do you have supportive people who know about this? Connection helps healing.",
                        "Who in your life is aware of what you've been through? Support systems matter."
                    ]
                },
                "professional": [
                    "A trauma specialist could help process this safely. Want information about that?",
                    "Trauma therapists use proven methods for healing. Interested in exploring options?"
                ],
                "actionable": [
                    "If emotions feel overwhelming, try orienting to the present: name objects around you.",
                    "For trauma triggers, try the 'butterfly hug' - cross arms and alternately tap shoulders."
                ]
            },
            "self_harm": {
                "initial": [
                    "I hear your pain. Let's focus on keeping you safe right now. You matter deeply.",
                    "You're not alone in this. Let's find ways to get through this difficult moment together."
                ],
                "safety": [
                    "Is there someone you can reach out to right now? You deserve support.",
                    "Has anything helped in past when you felt this way? Let's build on that."
                ],
                "professional": [
                    "I strongly encourage connecting with a mental health professional about this.",
                    "This is important to discuss with a therapist who can provide proper support."
                ],
                "actionable": [
                    "If urges feel strong, try holding ice cubes - the sensation can help ground you.",
                    "Try drawing on your skin with red marker where you might self-harm as an alternative."
                ]
            },
            "suicide_risk": {
                "immediate": [
                    "I'm deeply concerned for your safety. Please call 988 (Suicide Prevention Lifeline) right now.",
                    "You're not alone. Text HOME to 741741 (Crisis Text Line) immediately for support."
                ],
                "follow_up": [
                    "Have you had thoughts about how you might harm yourself? Please reach out for help now.",
                    "Is there someone who can stay with you right now? You shouldn't be alone with these feelings."
                ]
            },
            "greeting": [
                "Hello, I'm here to listen without judgment. How are you feeling in this moment?",
                "Welcome. I'm here to support you. What's on your mind today?"
            ],
            "general": [
                "I want to understand what you're experiencing. Try taking a slow breath before sharing more.",
                "Thank you for sharing. As we talk, check in with your body - maybe adjust your posture."
            ],
            "positive": [
                "I'm glad you're feeling better! What helped this improvement? Noticing what works helps.",
                "That's progress! Consider writing down what helped - creates a personal toolkit."
            ],
            "closing": [
                "Our time is ending, but remember: [personalized tip]. Support is always available.",
                "Need to wrap up now. Try [relevant technique] if needed later. You're not alone."
            ]
        }

    def _initialize_resources(self) -> Dict:
        """Initialize detailed mental health resources"""
        return {
            "depression": [
                "National Depression Hotline: 1-800-273-TALK (8255) 24/7",
                "Depression Toolkit: www.depressiontoolkit.org (self-help tools)",
                "Behavioral Activation Guide: www.getselfhelp.co.uk/docs/BA_Plan.pdf"
            ],
            "anxiety": [
                "Anxiety Canada: www.anxietycanada.com (free courses)",
                "DARE Anxiety App: www.dareresponse.com (evidence-based help)",
                "Grounding Techniques: www.getselfhelp.co.uk/docs/Grounding.pdf"
            ],
            "crisis": [
                "Suicide Prevention Lifeline: Call/text 988 24/7",
                "Crisis Text Line: Text HOME to 741741",
                "IMAlive Chat: www.imalive.org (trained listeners)"
            ],
            "therapy": [
                "Psychology Today: www.psychologytoday.com (search therapists)",
                "Open Path: www.openpathcollective.org ($30-60 sessions)",
                "BetterHelp: www.betterhelp.com (online counseling)"
            ]
        }

    def _initialize_crisis_keywords(self) -> Dict:
        """Initialize crisis keyword detection system"""
        return {
            "immediate": {
                "keywords": ["kill myself", "end my life", "suicide plan", "want to die"],
                "threshold": 1
            },
            "concerning": {
                "keywords": ["can't go on", "no reason to live", "better off dead", "don't want to exist"],
                "threshold": 2
            }
        }

    def _setup_conversation_tracking(self):
        """Initialize conversation tracking system"""
        self.conversation_context = {
            "current_topic": None,
            "state": ConversationState.INITIAL,
            "user_info": {
                "name": None,
                "therapy_history": None,
                "medication": None,
                "support_system": None
            },
            "message_history": [],
            "sentiment_trend": [],
            "start_time": datetime.now()
        }

    def generate_response(self, message: str, intent: Optional[str] = None) -> str:
        """
        Generate contextually appropriate mental health response
        Args:
            message: User's input message
            intent: Optional pre-determined intent
        Returns:
            Generated response with support strategies
        """
        self._update_conversation_context(message)
        
        crisis_level = self._assess_crisis_risk(message)
        if crisis_level:
            return self._handle_crisis_situation(crisis_level)
            
        if not intent:
            intent = self._determine_intent(message)
            
        return self._generate_contextual_response(intent, message)

    def _update_conversation_context(self, message: str):
        """Update conversation tracking with new message"""
        self.conversation_context["message_history"].append(message)
        sentiment = self._analyze_sentiment(message)
        self.conversation_context["sentiment_trend"].append(sentiment)
        self._extract_user_info(message)

    def _assess_crisis_risk(self, message: str) -> Optional[str]:
        """Check for crisis language with enhanced detection"""
        message_lower = message.lower()
        
        for level, data in self.crisis_keywords.items():
            count = sum(1 for kw in data["keywords"] if kw in message_lower)
            if count >= data["threshold"]:
                return level
        return None

    def _handle_crisis_situation(self, level: str) -> str:
        """Generate immediate crisis response with resources"""
        self.conversation_context["state"] = ConversationState.CRISIS
        
        if level == "immediate":
            response = random.choice(self.responses["suicide_risk"]["immediate"])
            resources = "\n".join(self.resources["crisis"])
            return f"{response}\n\nImmediate help:\n{resources}"
        else:
            response = random.choice(self.responses["self_harm"]["initial"])
            follow_up = random.choice(self.responses["self_harm"]["safety"])
            return f"{response}\n\n{follow_up}"

    def _determine_intent(self, message: str) -> str:
        """Determine intent from message content"""
        if self._assess_crisis_risk(message):
            return "suicide_risk"
            
        topic_keywords = {
            "depression": ["depress", "hopeless", "worthless", "empty"],
            "anxiety": ["anxious", "panic", "overwhelmed", "nervous"],
            "trauma": ["trauma", "abuse", "PTSD", "flashback"],
            "self_harm": ["cutting", "self-harm", "hurt myself"],
            "greeting": ["hello", "hi", "hey", "start"]
        }
        
        message_lower = message.lower()
        for intent, keywords in topic_keywords.items():
            if any(kw in message_lower for kw in keywords):
                return intent
                
        if self.conversation_context["sentiment_trend"]:
            avg_sentiment = sum(self.conversation_context["sentiment_trend"]) / len(self.conversation_context["sentiment_trend"])
            if avg_sentiment > 0.3:
                return "positive"
                
        return "general"

    def _generate_contextual_response(self, intent: str, message: str) -> str:
        """Generate response with immediate coping strategies"""
        if intent not in self.responses:
            intent = "general"
            
        if random.random() < 0.7 and "actionable" in self.responses[intent]:
            response = random.choice(self.responses[intent]["actionable"])
        elif self.conversation_context["state"] == ConversationState.INITIAL:
            response = self._get_initial_response(intent)
        elif self.conversation_context["state"] == ConversationState.FOLLOW_UP:
            response = self._get_follow_up_response(intent)
        else:
            response = random.choice(self.responses[intent])
            
        response = self._personalize_response(response)
        
        if self._should_include_resources(intent):
            response += self._get_resources(intent)
            
        return response

    def _get_initial_response(self, intent: str) -> str:
        """Get initial response with topic setup"""
        self.conversation_context["current_topic"] = intent
        self.conversation_context["state"] = ConversationState.FOLLOW_UP
        
        if "initial" in self.responses[intent]:
            return random.choice(self.responses[intent]["initial"])
        return random.choice(self.responses[intent])

    def _get_follow_up_response(self, intent: str) -> str:
        """Get follow-up response with deeper exploration"""
        if "follow_up" in self.responses[intent]:
            for follow_up_type, questions in self.responses[intent]["follow_up"].items():
                if follow_up_type not in self.conversation_context["user_info"]:
                    return random.choice(questions)
                    
        if "validation" in self.responses[intent] and random.random() > 0.6:
            return random.choice(self.responses[intent]["validation"])
            
        return random.choice(self.responses[intent])

    def _personalize_response(self, response: str) -> str:
        """Personalize response with user information"""
        if self.conversation_context["user_info"]["name"]:
            name = self.conversation_context["user_info"]["name"]
            response = response.replace("you", f"you, {name}", 1)
        return response

    def _should_include_resources(self, intent: str) -> bool:
        """Determine if resources should be included"""
        if intent in ["suicide_risk", "self_harm"]:
            return True
        return random.random() < 0.6 and intent in self.resources

    def _get_resources(self, intent: str) -> str:
        """Get relevant resources with formatting"""
        if intent not in self.resources:
            return ""
            
        resources = random.sample(self.resources[intent], min(2, len(self.resources[intent])))
        return "\n\nHelpful resources:\n• " + "\n• ".join(resources)

    def _analyze_sentiment(self, message: str) -> float:
        """Analyze message sentiment with enhanced word lists"""
        positive = ["hope", "better", "improving", "progress", "happy", "relief"]
        negative = ["hopeless", "worthless", "terrible", "awful", "hate", "despair"]
        
        words = re.findall(r'\w+', message.lower())
        pos = sum(1 for w in words if w in positive)
        neg = sum(1 for w in words if w in negative)
        total = pos + neg
        
        return (pos - neg) / total if total else 0

    def _extract_user_info(self, message: str):
        """Extract and store user information from messages"""
        if not self.conversation_context["user_info"]["name"]:
            name_match = re.search(r"(?:my name is|i'm called|i am|i'm)\s+([A-Za-z]+)", message, re.I)
            if name_match:
                self.conversation_context["user_info"]["name"] = name_match.group(1)
                
        if re.search(r"(?:see|seeing|talk to)\s+(?:a|my)\s+(?:therapist|counselor)", message, re.I):
            self.conversation_context["user_info"]["therapy_history"] = True
            
        if re.search(r"(?:taking|on)\s+(?:medication|prozac|zoloft|lexapro)", message, re.I):
            self.conversation_context["user_info"]["medication"] = True

    def get_conversation_summary(self) -> Dict:
        """Get summary of conversation with insights"""
        return {
            "duration_minutes": (datetime.now() - self.conversation_context["start_time"]).seconds // 60,
            "main_topics": self._get_main_topics(),
            "sentiment_trend": self._get_sentiment_trend(),
            "user_info": self.conversation_context["user_info"],
            "crisis_flagged": any(m for m in self.conversation_context["message_history"] 
                                 if self._assess_crisis_risk(m))
        }

    def _get_main_topics(self) -> List[str]:
        """Extract main topics from conversation history"""
        if self.conversation_context["current_topic"]:
            return [self.conversation_context["current_topic"]]
        return []

    def _get_sentiment_trend(self) -> str:
        """Get sentiment trend with enhanced analysis"""
        if not self.conversation_context["sentiment_trend"]:
            return "neutral"
            
        avg = sum(self.conversation_context["sentiment_trend"]) / len(self.conversation_context["sentiment_trend"])
        if avg > 0.3:
            return "positive"
        elif avg < -0.3:
            return "negative"
        return "mixed"

    def generate(self, message: str, intent: Optional[str] = None) -> str:
        """Alias for generate_response for backward compatibility"""
        return self.generate_response(message, intent)