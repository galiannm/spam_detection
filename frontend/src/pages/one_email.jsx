import { useState } from "react";
import { FaHome } from "react-icons/fa";
import {PiThumbsDownFill, PiThumbsUpFill} from "react-icons/pi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/one_email.css";

export default function OneEmail() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = async () => {
    toast("Thank you for your feedback!", {
      className: "feedback-toast",
      type: "success",
      autoClose: 2000, 
      position: "top-left"
    });

    try {
      await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          prediction: result,
          feedback: userFeedback, // "correct" or "wrong"
        }),
      });
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };  

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
          onClick={() => {
            checkSpam();
            setFeedback("");
          }}
          disabled={loading}
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </div>
      <div className="response">
        {result && (
          <>
            <p className={`result ${result}`}>This email is: {result.toUpperCase()}</p>
            <div className="feedback-container">
              <button 
                className={`feedback feedback-correct${feedback === "correct" ? " active" : ""}`}
                onClick={() => {
                  setFeedback("correct");
                  handleFeedback();
                }}
                disabled={feedback !== ""}
              > <PiThumbsUpFill /> </button>
              <button 
                className={`feedback feedback-wrong${feedback === "wrong" ? " active" : ""}`}
                onClick={() => {
                  setFeedback("wrong");
                  handleFeedback();
                }}
                disabled={feedback !== ""}
              > 
                <PiThumbsDownFill /> </button>
            </div>
          </>
        )}
      </div>
      <Link to="/" className="home-btn">
        <FaHome size={20} /> 
      </Link>

      <ToastContainer />
    </div>
  );
}
