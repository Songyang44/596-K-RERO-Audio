import React from "react";

const UploadFile = ({ audioUrl, imageUrl, editableTranscript }) => {
  return (
    <div>
      <p>音频URL: {audioUrl}</p>
      <p>图片URL: {imageUrl}</p>
      <p>文本内容: {editableTranscript}</p>
      {/* ... 可以添加更多的展示或处理逻辑 ... */}
    </div>
  );
};

export default UploadFile;
