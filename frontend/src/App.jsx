// frontend/src/App.jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSpam = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data.prediction);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Spam Detection Tool</h1>
      <div className="stack-predict">
        <textarea
          className="email-input"
          placeholder="Paste your email here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          className="check-btn"
          onClick={checkSpam} 
          disabled={loading}
        >
          {loading ? "Checking..." : "Check"}
        </button>
        <div className="response">
          {result && (
            <p className={`result ${result}`}>This email is: {result.toUpperCase()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
