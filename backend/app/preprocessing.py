import pandas as pd 

def process_uploaded_email_file(file):
    df = pd.read_csv(file)
    if 'email' not in df.columns or 'message' not in df.columns:
        raise ValueError("CSV must contain 'email' and 'message' columns.")
    return df