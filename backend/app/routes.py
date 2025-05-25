from fastapi import APIRouter
from pydantic import BaseModel
from app.predict import load_model_and_vectorizer, predict_email

router = APIRouter()

class EmailInput(BaseModel):
    text: str

model, vectorizer = load_model_and_vectorizer()

@router.post("/predict")
def predict(input: EmailInput):
    label = predict_email(model, vectorizer, input.text)
    return {"prediction": label}
