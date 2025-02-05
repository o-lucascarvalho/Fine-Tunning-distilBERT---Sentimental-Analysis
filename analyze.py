import sys
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Load model from the repository.
repo_path = 'olucas-carvalho/sentimental-analysis-BERT'

tokenizer = AutoTokenizer.from_pretrained(repo_path)
model = AutoModelForSequenceClassification.from_pretrained(repo_path)

# getting the input sentence
text = sys.argv[1]

# Tokenize the sentence
tokens = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

# Make prediction
with torch.no_grad():
    output = model(**tokens)
    prediction = torch.argmax(output.logits, dim=1).item()

# Mapping the result class in 1: Positive and 0: Negative
result = "positive" if prediction == 1 else "negative"

# Return Results
print(result)

