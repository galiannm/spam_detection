import { useState, useRef } from "react";
import { FaHome, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./styles/list_email.css";

export default function FileEmail() {
  const [file, setFile] = useState(null);
  const [topSenders, setTop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null); 

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setTop([]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setTop([]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setTop([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {!file ? (
          <p>Drag and drop a <strong>.csv</strong> file here, or use the file picker below</p>
        ) : (
          <div className="dropped-file">
            <span>{file.name}</span>
            <button className="clear-btn" onClick={clearFile} title="Remove file">
              <FaTrashAlt />
            </button>
          </div>
        )}
      </div>

      <label htmlFor="file-upload" className="upload-btn">
        Choose CSV
      </label>
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      <button onClick={checkFile} disabled={loading || !file}>
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

      <Link to="/" className="home-btn">
        <FaHome size={20} />
      </Link>
    </div>
  );
}
