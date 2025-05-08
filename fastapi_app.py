
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("savasy/bert-base-turkish-sentiment-cased")
model = AutoModelForSequenceClassification.from_pretrained("savasy/bert-base-turkish-sentiment-cased")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

app = FastAPI()

# Enable CORS for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
    sentence: str

def clean_text(text):
    return text.lower()

@app.post("/predict")
def is_offensive(input: InputText):
    sentence = input.sentence
    normalize_text = clean_text(sentence)
    test_sample = tokenizer([normalize_text], padding=True, truncation=True, max_length=256, return_tensors='pt')
    test_sample = {k: v.to(device) for k, v in test_sample.items()}
    output = model(**test_sample)
    y_pred = np.argmax(output.logits.detach().cpu().numpy(), axis=1)
    label = 'offensive' if y_pred[0] == 1 else 'non-offensive'
    return {"result": label}
