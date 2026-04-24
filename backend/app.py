from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import predict_vulnerability

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str

@app.get("/")
def root():
    return {"status": "ok", "message": "Smart Contract Vulnerability API is running. Use POST /predict for inference."}

@app.post("/predict")
def predict(data: CodeInput):
    label = predict_vulnerability(data.code)
    return {"vulnerability": label}
