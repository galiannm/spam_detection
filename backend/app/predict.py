import joblib

def load_model_and_vectorizer():
    model = joblib.load("app/models/spam_model_linearSVC.pkl")
    vectorizer = joblib.load("app/models/vectorizer.pkl")
    return model, vectorizer

def predict_email(model, vectorizer, email_text):
    x = vectorizer.transform([email_text])
    prediction = model.predict(x)[0]
    return "spam" if prediction == 1 else "ham"