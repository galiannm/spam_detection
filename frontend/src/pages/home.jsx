import React from "react";
import { Link } from "react-router-dom";
import "./styles/home.css"; 

export default function Home() {
  return (
    <div className="home-container">
      <h1>Spam Detection Tool</h1>
      <div className="nav-buttons">
        <Link to="/email" className="btn">Check One Email</Link>
        <Link to="/file"  className="btn">Upload CSV File</Link>
      </div>
    </div>
  );
}