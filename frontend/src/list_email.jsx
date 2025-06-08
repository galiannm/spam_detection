import { useState } from "react";
import "./styles/list_email.css";

export default function FileEmail() {
  const [file, setFile]       = useState(null);
  const [topSenders, setTop]  = useState([]);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setTop([]);
  };

  const checkFile = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/predict-file", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      // expect data.top_senders = [{ email, count }, …]
      setTop(data.top_senders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-email-container">
      <h2>Predict From CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
      />
      <button
        onClick={checkFile}
        disabled={loading || !file}
      >
        {loading ? "Processing…" : "Upload & Check"}
      </button>

      {topSenders.length > 0 && (
        <ol className="result-list">
          {topSenders.map((s, i) => (
            <li key={i}>
              {s.email} — {s.count} spam messages
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

  