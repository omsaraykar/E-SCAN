from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from transformers import DebertaV2Config, TFDebertaV2ForSequenceClassification, AutoTokenizer, PreTrainedTokenizerFast
import tensorflow as tf

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

# Label Mapping - Map the output integers to these labels
CLASS_NAMES = {
    0: 'Access Control',
    1: 'Reentrancy',
    2: 'Arithmetic',
    3: 'Unchecked Low Level Calls',
    4: 'Bad Randomness',
    5: 'Front Running',
    6: 'Time Manipulation',
    7: 'Short Addresses',
    # Update these based on the exact Kaggle dataset being used if needed.
}

# Global variables to store our model and tokenizer
tokenizer = None
model = None

@app.on_event("startup")
async def load_model():
    global tokenizer, model
    try:
        logger.info("Loading tokenizer from ./model/tokenizer.json...")
        # Since we use DeBERTaV3, we could try AutoTokenizer from a directory, 
        # or load explicitly from the JSON file using PreTrainedTokenizerFast
        try:
            tokenizer = AutoTokenizer.from_pretrained("./model")
        except Exception:
            tokenizer = PreTrainedTokenizerFast(tokenizer_file="./model/tokenizer.json")
        
        logger.info("Loading config from ./model/config.json...")
        # Load the architecture using DebertaV2Config 
        try:
            config = DebertaV2Config.from_json_file("./model/config.json")
        except Exception:
            # Fallback if standard HF json is not present (e.g., loading from pretrained directory)
            config = DebertaV2Config.from_pretrained("./model")
            
        # Ensure we have the right number of labels in config
        config.num_labels = len(CLASS_NAMES)

        logger.info("Loading TF model architecture...")
        # Note: The weights are in Keras H5 format. We initialize the TF model with the config,
        # and then we explicitly load the Keras H5 weights into it.
        # Ensure you handle the Keras/TensorFlow loading correctly within the Transformers framework.
        model = TFDebertaV2ForSequenceClassification(config)
        
        # Build the model with dummy input so weights are instantiated
        dummy_input = tf.constant([[0, 1, 2]])
        model(dummy_input)

        logger.info("Loading weights from ./model/model.weights.h5...")
        # Use TF/Keras native `load_weights` to handle the `.h5` file correctly.
        model.load_weights("./model/model.weights.h5", by_name=True, skip_mismatch=True)
        
        logger.info("Model and tokenizer successfully loaded.")
        
    except Exception as e:
        logger.error(f"Failed to load model on startup: {e}")
        # Not raising here so the server can still start and show error endpoints


# Define request schema
class AnalyzeRequest(BaseModel):
    code: str

# Define response schema
class AnalyzeResponse(BaseModel):
    prediction: str
    confidence: float
    class_id: int

@app.get("/")
async def root():
    return {"message": "Server is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_code(request: AnalyzeRequest):
    if model is None or tokenizer is None:
        raise HTTPException(
            status_code=503, 
            detail="Model is not loaded. Please check server logs for startup errors."
        )
        
    try:
        # Tokenize the input smart contract code
        # DeBERTaV3 tokenizer configuration
        inputs = tokenizer(
            request.code,
            return_tensors="tf",
            truncation=True,
            max_length=512,
            padding="max_length"
        )
        
        # Run inference
        outputs = model(inputs)
        logits = outputs.logits
        
        # Calculate probabilities using softmax
        probabilities = tf.nn.softmax(logits, axis=-1)
        
        # Get the highest probability class
        predicted_class_id = int(tf.argmax(probabilities, axis=-1)[0])
        confidence = float(tf.reduce_max(probabilities, axis=-1)[0])
        
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
