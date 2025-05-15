from typing import Dict, Optional
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import warnings

# Disable all warnings globally
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class ChatModel:
    def __init__(self):
        """High-performance chat model with parallel initialization"""
        self.conversation_history: Dict[str, list] = {}
        self.components_ready = False
        self.model_loaded = False  # Initialize model_loaded attribute
        self._init_components_parallel()

    def _init_components_parallel(self):
        """Initialize all components in parallel threads"""
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(self._init_component, 'safety_checker'),
                executor.submit(self._init_component, 'nlp_model'),
                executor.submit(self._init_component, 'ai_generator')
            ]
            [f.result() for f in futures]  # Wait for all to complete
        self.components_ready = True
        self.model_loaded = True  # Set the model as loaded
        logger.info("⚡ All components initialized and model loaded")

    def _init_component(self, component_name: str):
        """Thread-safe component initialization"""
        try:
            if component_name == 'safety_checker':
                from app.utils.safety_check import SafetyChecker
                self.safety_checker = SafetyChecker()
            elif component_name == 'nlp_model':
                from app.models.nlp_model import NLPModel
                self.nlp_model = NLPModel()
            elif component_name == 'ai_generator':
                from app.utils.response_generator import AIResponseGenerator
                self.ai_response_generator = AIResponseGenerator()
        except Exception as e:
            logger.critical(f"Failed to initialize {component_name}: {e}")
            raise

    async def get_response(self, message: str, user_id: str = "default") -> str:
        """Ultra-fast response generation pipeline"""
        if not self.model_loaded:  # Check if the model is fully loaded
            return "System initializing... please wait"

        try:
            # Parallel execution of checks
            emergency, intent = await asyncio.gather(
                self._check_emergency(message),
                self._predict_intent(message)
            )

            if emergency:
                return "[URGENT] Contact emergency services immediately."
            if not intent:
                return "I didn't understand that. Could you rephrase?"

            response = await self._generate_response(intent, message)
            await self._update_history(user_id, message, response)
            return response

        except Exception as e:
            logger.error(f"Response error: {e}")
            return "I'm having trouble responding. Please try again."

    async def _check_emergency(self, text: str) -> bool:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.safety_checker.is_emergency, text)

    async def _predict_intent(self, text: str) -> Optional[str]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.nlp_model.predict, text)

    async def _generate_response(self, intent: str, text: str) -> str:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None, 
            self.ai_response_generator.generate, 
            intent, 
            text
        )

    async def _update_history(self, user_id: str, user_msg: str, bot_response: str):
        """Lock-free history update"""
        history = self.conversation_history.get(user_id, [])
        self.conversation_history[user_id] = [*history[-4:], {"user": user_msg, "bot": bot_response}]
