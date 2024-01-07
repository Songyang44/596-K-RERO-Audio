import React, { useState, useRef } from "react";
export default function ChooseFileToUpload() {
  const [selectFile, setSelectFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectFile(file.name);
    }
  };

  const handleCustomFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="selectFile">
      <input
        type="file"
        accept=".wav, .mp3"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      ></input>
      <button onClick={handleCustomFileButtonClick}>Choose File</button>
      <input type="text" value={selectFile || ""} readOnly></input>
    </div>
  );
}
