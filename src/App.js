import React from "react";
import Branding from "./components/Branding/Branding";
import Pagination from "./components/Pagination/Pagination";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Branding />
      <Pagination />
    </div>
  );
}

export default App;