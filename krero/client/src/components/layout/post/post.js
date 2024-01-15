// Post.js
import React from "react";

const Post = ({ audioUrl, imageUrl, editableTranscript }) => {
  return (
    <div className="post">
      <p>{editableTranscript}</p>
      {audioUrl && <audio src={audioUrl} controls />}
      {imageUrl && (
        <img
          style={{ width: "50px", height: "50px" }}
          src={imageUrl}
          alt="Uploaded"
        />
      )}
    </div>
  );
};

export default Post;
