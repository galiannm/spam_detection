from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.predict import load_model_and_vectorizer, predict_email, predict_list_email
import csv
import os

router = APIRouter()

class EmailInput(BaseModel):
    text: str

class UserFeedback(BaseModel):
    text: str
    prediction: str
    feedback: str

FEEDBACK_FILE = "feedback.csv"

model, vectorizer = load_model_and_vectorizer()

@router.post("/predict")
def predict(input: EmailInput):
    label = predict_email(model, vectorizer, input.text)
    return {"prediction": label}

@router.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    try:
        result = predict_list_email(model, vectorizer, file.file)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.post("/feedback")
async def save_feedback(item: UserFeedback):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(BASE_DIR, "data", FEEDBACK_FILE)

    if not os.path.isfile(save_path):
        raise FileNotFoundError(f"{save_path} does not exist. Please create it first.")

    with open(save_path, mode="a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([item.text, item.prediction, item.feedback])

    return {"message": "Feedback received"}


