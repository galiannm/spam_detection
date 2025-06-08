import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import OneEmail from "./one_email";
import ListEmail from "./list_email";
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
