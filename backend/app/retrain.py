from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
import pandas as pd
import joblib

# convert feedback to true labels
def load_feedback(path="data/feedback.csv"):
    df = pd.read_csv(path, header=None, names=["text", "prediction", "feedback"])

    def true_labels(row):
        if row["feedback"] == "correct":
            return row["prediction"]
        else: 
            return "spam" if row["prediction"] == "ham" else "ham"

    df["label"] = df.apply(true_labels, axis=1)
    return df[["text", "label"]]

# combine feedback with the original dataset
original_df = pd.read_csv("data/SMSSpamCollection.csv", names=["label", "text"], sep="\t")
feedback_df = load_feedback()

combined_df = pd.concat([original_df, feedback_df], ignore_index=True)

# clean / vectorise / retrain
x = combined_df["text"]
y = combined_df["label"]

vectorizer = TfidfVectorizer()
x_vec = vectorizer.fit_transform(x)

model = LinearSVC()
model.fit(x_vec, y)

joblib.dump(model, "models/spam_model_linearSVC.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("Retraining complete. Model updated.")

# clear feedback after training
open("data/feedback.csv", "w").close()