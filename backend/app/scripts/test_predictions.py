import sys
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent.parent.parent.parent))  # Goes up to Mental-Health-Chatbot

from backend.app.models.nlp_model import NLPModel

def interactive_test():
    model = NLPModel()
    print("NLP Model Testing Console (type 'quit' to exit)")
    
    while True:
        text = input("\nEnter a message: ").strip()
        if text.lower() == 'quit':
            break
            
        intent = model.predict(text)
        print(f"Predicted intent: {intent}")

if __name__ == "__main__":
    interactive_test()