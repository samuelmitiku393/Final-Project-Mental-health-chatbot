import pandas as pd
from sklearn.metrics import classification_report
from backend.app.models.nlp_model import NLPModel

def evaluate_on_dataset(dataset_path):
    df = pd.read_json(dataset_path)
    model = NLPModel()
    
    y_true = []
    y_pred = []
    
    for _, row in df.iterrows():
        true_intent = classify_intent(row['Context'])  # Your original function
        pred_intent = model.predict(row['Context'])
        
        y_true.append(true_intent)
        y_pred.append(pred_intent)
    
    print(classification_report(y_true, y_pred))

if __name__ == "__main__":
    dataset_path = "data/raw/conversations.json"
    evaluate_on_dataset(dataset_path)