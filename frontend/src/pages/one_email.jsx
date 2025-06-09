import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./styles/one_email.css";

export default function OneEmail() {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSpam = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      const pred = data.prediction ?? data.label;
      console.log("🎯 Using prediction:", pred);
      setResult(pred);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="one-email-container">
      <h2>Predict An Email</h2>
      <div className="stack-predict">
        <textarea
          className="email-input"
          placeholder="Paste your email here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="check-btn"
          onClick={checkSpam}
          disabled={loading}
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </div>
      <div className="response">
        {result && (
          <p className={`result ${result}`}>This email is: {result.toUpperCase()}</p>
        )}
      </div>
      <Link to="/" className="home-btn">
        <FaHome size={20} /> 
      </Link>
    </div>
  );
}
