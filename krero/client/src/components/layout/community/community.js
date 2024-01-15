// Community.js
import React from "react";
import Post from "../post/post";

const Community = ({ posts }) => {
  return (
    <div>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  );
};

export default Community;
