from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.predict import load_model_and_vectorizer, predict_email, predict_list_email

router = APIRouter()

class EmailInput(BaseModel):
    text: str

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
