import React, { useState, useRef } from "react";

export default function ChooseFileToUpload({ setAudioFile }) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file); // 更新父组件中的audioFile状态
      setSelectedFileName(file.name);
    }
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
      <button onClick={() => fileInputRef.current.click()}>Choose File</button>
      <input type="text" value={selectedFileName || ""} readOnly></input>
    </div>
  );
}
