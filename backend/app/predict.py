import joblib
from collections import Counter
from app.preprocessing import process_uploaded_email_file 

def load_model_and_vectorizer():
    model = joblib.load("app/models/spam_model_linearSVC.pkl")
    vectorizer = joblib.load("app/models/vectorizer.pkl")
    return model, vectorizer

def predict_email(model, vectorizer, email_text):
    x = vectorizer.transform([email_text])
    prediction = model.predict(x)[0]
    return "spam" if prediction == 1 else "ham"

def predict_list_email(model, vectorizer, email_file):
    try:
        df = process_uploaded_email_file(email_file)
    except Exception as e:
        return {"error": str(e)}

    x = vectorizer.transform(df["message"])
    prediction = model.predict(x)

    spam_emails = df["email"][prediction==1] # all spam emails

    spam_counts = Counter(spam_emails) # num of spam mails per spammer

    top_senders = spam_counts.most_common(10)

    # format result
    result = [{"email":email, "count":count} for email, count in top_senders]
    return {"top_senders": result}



