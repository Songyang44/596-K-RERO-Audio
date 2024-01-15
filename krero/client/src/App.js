import "./App.css";
import React, { useState } from "react";
import CombineofAudioRecorderandSpeech from "./components/layout/record/combineRecordandSpeech";
import { FriendsCircle } from "./components/layout/friends/friends";
import Community from "./components/layout/community/community";
import solidAuth from "solid-auth-client";
import EditorofAudio from "./components/layout/AudioEditor/AudioEditor";
import UploadFile from "./components/store/uploadFile";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  const [uploadData, setUploadData] = useState(null);

  const friends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  // const posts = [
  //   {
  //     id: 1,
  //     user: {
  //       name: "Alice",
  //       avatarUrl: "arterLogin.png",
  //     },
  //     content: "This is the first post content.",
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       name: "Bob",
  //       avatarUrl: "beforLogin.jpg",
  //     },
  //     content: "This is the second post content.",
  //   },
  // ];

  const handleUpload = (data) => {
    setUploadData(data);
  };

  const [posts, setPosts] = useState([]);

  const handleAddPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };
  const [user, setUser] = useState(true);
  const [isLoggedin, setIsLoggedIn] = useState(true);

  const login = async () => {
    await solidAuth.login("https://localhost:8443/");
    const session = await solidAuth.currentSession();
    console.log(session);
    if (session) {
      setUser(session);
    }
    setIsLoggedIn(true);
    console.log(user);
    await session.login({
      oidcIssuer: "https://localhost:8443",
      redirectUrl: window.location.href,
      clientName: "Krero",
    });
  };

  const logout = async () => {
    solidAuth.logout();
    setIsLoggedIn(false);
  };

  

  return (
    <>
      <div
        className={
          isLoggedin ? "background-after-login" : "background-before-login"
        }
      >
        {isLoggedin ? (
          <>
            <Router>
              <div className="navbar">
                <button className="logout" style={{width:"80px", height:"50px",borderRadius:"50%",cursor:"pointer"}} onClick={logout}>
                  logout
                </button>
                <nav className="navbar">
                  <ul>
                    <li>
                      <Link to="/CombineofAudioRecorderandSpeech">Record</Link>
                    </li>
                    <li>
                      <Link to="/EditorofAudio">Editor</Link>
                    </li>
                    <li>
                      <Link to="/friendsCicle">Friends</Link>
                    </li>
                    <li>
                      <Link to="/Community">Community</Link>
                    </li>
                  </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <div className="component">
                  <Routes>
                    <Route
                      path="/CombineofAudioRecorderandSpeech"
                      element={
                        <CombineofAudioRecorderandSpeech
                          onAddPost={handleAddPost}
                        />
                      }
                    />
                    <Route path="/EditorofAudio" element={<EditorofAudio />} />
                    <Route
                      path="/friendsCicle"
                      element={<FriendsCircle friends={friends} />}
                    />
                    <Route
                      path="/Community"
                      element={<Community posts={posts} />}
                    />
                  </Routes>
                </div>
              </div>
            </Router>

            {uploadData && (
              <UploadFile
                audioUrl={uploadData.audioUrl}
                imageUrl={uploadData.imageUrl}
                textContent={uploadData.textContent}
              />
            )}
          </>
        ) : (
          <>
            <div className="login">
              <button
                
                style={{ width: "80px", height: "40px", borderRadius: "40%" }}
                onClick={login}
              >
                login
              </button>
              <p
                style={{
                  color: "black",
                  fontFamily: "Papyrus",
                  marginTop: "140px",
                }}
              >
                Please login first
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
