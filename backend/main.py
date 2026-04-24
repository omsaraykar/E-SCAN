import os
os.environ["KERAS_BACKEND"] = "tensorflow"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import keras_nlp
import tensorflow as tf
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Contract Vulnerability Detection API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Label Mapping
CLASS_NAMES = {
    0: 'Access Control',
    1: 'Reentrancy',
    2: 'Arithmetic',
    3: 'Unchecked Low Level Calls',
    4: 'Bad Randomness',
    5: 'Front Running',
    6: 'Time Manipulation',
    7: 'Short Addresses',
}

# Global object to store our model
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        logger.info("Loading keras_nlp classifier architecture...")
        # Use preset to get tokenizers and backbone config
        model = keras_nlp.models.DebertaV3Classifier.from_preset(
            "deberta_v3_base_en",
            num_classes=8,
            load_weights=False,
        )
        
        logger.info("Loading weights from ./model/model.weights.h5...")
        model.load_weights("./model/model.weights.h5", skip_mismatch=True)
        
        logger.info("Model loaded successfully.")
        
    except Exception as e:
        logger.error(f"Failed to load model on startup: {e}")

class AnalyzeRequest(BaseModel):
    code: str

class AnalyzeResponse(BaseModel):
    prediction: str
    confidence: float
    class_id: int

@app.get("/")
async def root():
    return {"message": "Server is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_code(request: AnalyzeRequest):
    if model is None:
        raise HTTPException(
            status_code=503, 
            detail="Model is not loaded. Please check server logs for startup errors."
        )
        
    try:
        # Run inference
        logits = model.predict([request.code])
        
        # Calculate probabilities using softmax
        probabilities = tf.nn.softmax(logits, axis=-1).numpy()[0]
        
        # Get the highest probability class
        predicted_class_id = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))
        
        # Map to label
        prediction_label = CLASS_NAMES.get(predicted_class_id, f"Unknown Class {predicted_class_id}")
        
        return AnalyzeResponse(
            prediction=prediction_label,
            confidence=confidence,
            class_id=predicted_class_id
        )
        
    except Exception as e:
        logger.error(f"Error during code analysis inference: {e}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
