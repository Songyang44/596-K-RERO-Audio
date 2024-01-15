import React, { useState, useRef, useEffect } from "react";
import UploadFile from "../../store/uploadFile";
import { translateText } from "../../layout/translator/translate";


export const FriendsCircle = ({ friends }) => {
  return (
    <div className="editor-audio-background">
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};
