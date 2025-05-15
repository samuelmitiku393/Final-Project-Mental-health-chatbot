class SafetyChecker:
    def __init__(self):
        self.emergency_phrases = [
            "kill myself", "end my life",
            "want to die", "suicide",
            "no reason to live", "harm myself"
        ]
    
    def is_emergency(self, text: str) -> bool:
        """Check if message contains emergency phrases"""
        text = text.lower()
        return any(phrase in text for phrase in self.emergency_phrases)