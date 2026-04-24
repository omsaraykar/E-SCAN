from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import tensorflow as tf

labels = [
    "Reentrancy",
    "Integer Overflow",
    "Access Control",
    "Unchecked Call"
]

MODEL_LOADED = False
tokenizer = None
model = None

try:
    tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-base")
    model = TFAutoModelForSequenceClassification.from_pretrained(
        "microsoft/deberta-base",
        num_labels=4
    )
    model.load_weights("model.weights.h5")
    MODEL_LOADED = True
except Exception as e:
    print(f"Fallback mode activated: {e}")

def predict_vulnerability(code: str) -> str:
    if not MODEL_LOADED:
        if "call.value" in code:
            return "Reentrancy"
        elif "uint" in code:
            return "Integer Overflow"
        elif "owner" in code:
            return "Access Control"
        else:
            return "Unchecked Call"

    inputs = tokenizer(
        code,
        max_length=512,
        truncation=True,
        padding=True,
        return_tensors="tf"
    )
    
    outputs = model(**inputs)
    probs = tf.nn.softmax(outputs.logits, axis=-1)
    predicted_class_id = tf.math.argmax(probs, axis=-1).numpy()[0]
    
    return labels[predicted_class_id]
