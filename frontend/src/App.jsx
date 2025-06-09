import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import OneEmail from "./pages/one_email";
import ListEmail from "./pages/list_email";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<Home     />} />
      <Route path="/email"  element={<OneEmail />} />
      <Route path="/file"   element={<ListEmail/>} />
    </Routes>
  );
}
