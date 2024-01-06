import logo from "./logo.svg";
import "./App.css";
import React, { useState, useRef } from "react";
import Login from "../src/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Record from "../src/Record";

function App() {
  // const [selectFile, setSelectFile] = useState(null);
  // const fileInputRef = useRef(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectFile(file.name);
  //   }
  // };

  // const handleCustomFileButtonClick = () => {
  //   fileInputRef.current.click();
  // };

  return (
    <>
      <Login />
      {/* <div className="selectFile">
        <input
          type="file"
          accept=".wav, .mp3"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        ></input>
        <button onClick={handleCustomFileButtonClick}>Choose File</button>
        <input type="text" value={selectFile || ""} readOnly></input>
      </div> */}
      <div className="selectFile">
        <Record />
      </div>

      {/* <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Link to="/recording">
                  <button>Start Recording</button>
                </Link>
              </>
            }
          />
          <Route path="/recording" element={<Record />} />
        </Routes>
      </Router> */}
    </>
  );
}

export default App;
