from typing import Dict, Optional
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import warnings
import sys
from pathlib import Path

# Disable all warnings globally
warnings.filterwarnings('ignore')

# Add project root to path (adjust as needed)
sys.path.append(str(Path(__file__).parent.parent.parent.parent))

logger = logging.getLogger(__name__)

class ChatModel:
    def __init__(self):
        """High-performance chat model with parallel initialization"""
        self.conversation_history: Dict[str, list] = {}
        self.components_ready = False
        self.model_loaded = False
        self._init_components_parallel()

    def _init_components_parallel(self):
        """Initialize all components in parallel threads"""
        try:
            with ThreadPoolExecutor(max_workers=3) as executor:
                futures = [
                    executor.submit(self._init_component, 'safety_checker'),
                    executor.submit(self._init_component, 'nlp_model'),
                    executor.submit(self._init_component, 'ai_generator')
                ]
                
                # Wait for all to complete and check for exceptions
                for future in futures:
                    future.result()
                    
            self.components_ready = True
            self.model_loaded = True
            logger.info("⚡ All components initialized and model loaded")
        except Exception as e:
            logger.critical(f"Failed to initialize components: {e}")
            self.components_ready = False
            self.model_loaded = False

    def _init_component(self, component_name: str):
        """Thread-safe component initialization with absolute imports"""
        try:
            if component_name == 'safety_checker':
                from backend.app.utils.safety_check import SafetyChecker
                self.safety_checker = SafetyChecker()
            elif component_name == 'nlp_model':
                from backend.app.models.nlp_model import NLPModel
                self.nlp_model = NLPModel()
            elif component_name == 'ai_generator':
                from backend.app.utils.response_generator import AIResponseGenerator
                self.ai_response_generator = AIResponseGenerator()
        except ImportError as e:
            logger.error(f"Import error for {component_name}: {e}")
            raise
        except Exception as e:
            logger.error(f"Initialization error for {component_name}: {e}")
            raise

    async def get_response(self, message: str, user_id: str = "default") -> str:
        """Ultra-fast response generation pipeline"""
        if not self.model_loaded or not self.components_ready:
            return "System initializing... please wait"

        try:
            # Parallel execution of checks
            emergency, intent = await asyncio.gather(
                self._check_emergency(message),
                self._predict_intent(message)
            )

            if emergency:
                return "[URGENT] Contact emergency services immediately."

            # Generate response using both message and predicted intent
            response = await self._generate_response(message, intent)
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
        intent = await loop.run_in_executor(None, self.nlp_model.predict, text)
        logger.debug(f"Predicted intent: {intent}")
        return intent

    async def _generate_response(self, message: str, intent: Optional[str]) -> str:
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None, 
            self.ai_response_generator.generate_response, 
            message,
            intent
        )
        logger.debug(f"Generated response for intent '{intent}': {response[:100]}...")
        return response

    async def _update_history(self, user_id: str, user_msg: str, bot_response: str):
        """Lock-free history update"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        self.conversation_history[user_id] = [
            *self.conversation_history[user_id][-4:], 
            {"user": user_msg, "bot": bot_response}
        ]

async def test_chat_model():
    chat_model = ChatModel()
    print("Chat Model Testing (type 'quit' to exit)")
    
    while True:
        message = input("\nYou: ").strip()
        if message.lower() == 'quit':
            break
            
        if not chat_model.model_loaded or not chat_model.components_ready:
            print("System still initializing...")
            continue
            
        try:
            response = await chat_model.get_response(message)
            print(f"Bot: {response}")
        except Exception as e:
            print(f"Error: {e}")
            continue

if __name__ == "__main__":
    asyncio.run(test_chat_model())