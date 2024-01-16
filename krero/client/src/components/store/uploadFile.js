import React from "react";

const UploadFile = ({ audioUrl, imageUrl, editableTranscript }) => {
  return (
    <div>
      <p>AudioURL: {audioUrl}</p>
      <p>ImgURL: {imageUrl}</p>
      <p>Transcription: {editableTranscript}</p>
      
    </div>
  );
};

export default UploadFile;
