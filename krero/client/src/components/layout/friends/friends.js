import React, { useState, useRef, useEffect } from "react";
import UploadFile from "../../store/uploadFile";
import { translateText } from "../../layout/translator/translate";



export const FriendsCircle = ({ friends }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    
    
    // Assume findUserByWebId is a function used to find users based on webid
    findUserByWebId(searchTerm).then(user => {
      if (user) {
        // addFriend(user);  // Assume addFriend is a function that adds friends
      }
    });
  };

  const findUserByWebId =()=>{

  }
  return (
    <div className="editor-audio-background">
       <input 
        type="text" 
        placeholder="Search by WebID" 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <button onClick={handleSearchSubmit}>Search</button>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};
