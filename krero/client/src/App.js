import React, { useState } from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";

import AddPost from "./layout/components/AddPost";
import "./App.css";
import UploadFile from "./layout/components/UploadTest/UploadTest";
import Translation from "./layout/components/Translation/Translation";
import SpeechToText from "./layout/components/Translation/translate";
import DisplayPost from "./layout/components/DisplayPost/DisplayPost";
import Contacts from "./layout/components/Contacts/Contacts";
import { PostProvider } from "./layout/components/PostContext/PostContext";
import Editor from "./layout/components/Editor/Editor";
import AboutProjrct from "./layout/components/AboutProject/AcoutProject";

const authOptions = {
  clientName: "Krero",
};

function App() {
  const { session } = useSession();
  const [postText, setPostText] = useState(""); 

  const [activeComponent, setActiveComponent] = useState("addPost");

  
  const renderComponent = () => {
    switch (activeComponent) {
      case "addPost":
        return <AddPost />;
      case "editor":
        return <Editor />;
      case "translation":
        return <Translation />;
      
      case "contacts":
        return <Contacts />;
      case "displayPost":
        return <DisplayPost />;
      case "aboutproject":
        return (
          <AboutProjrct
            content={[
              {
                title: "Backgroud",
                text: <div>The Whakatōhea Māori Trust Board is a prestigious organization that has served the Whakatōhea community since 1952.<br/><br/>
                  As a governing body, it is committed to improving and empowering the lives of Whakatōhea people and ensuring that their heritage, culture and future are preserved and nurtured.<br/> <br/>
                  With a clear vision and strong leadership, the Board of Trustees has worked to promote the interests of its people and to showcase the richness and diversity of Māori culture to the rest of the world.<br/><br/>
                  Their concept of the digital hub has deeply influenced the development objectives and sustainability of this project.<br/><br/>
                   We are counting on this project to provide more possibilities and references for traditional storytelling and audio.​</div>,
              },
              {
                title: "Components",
                text: (
                  <div>
                    <h3>Add Post</h3>
                    <pre>
                      <h4> Add your Post in this component</h4>
                    </pre>
                    <br />
                    <h3>Editor</h3>
                    <pre>
                      <h4> Editor your audio in here</h4>
                    </pre>
                    <br />
                    <h3>Translation</h3>
                    <pre>
                      <h4> Translate your english story to Maori language</h4>
                    </pre>
                    <br />
                    <h3>Contacts</h3>
                    <pre>
                      <h4> Add your friends into your contacts list</h4>
                    </pre>
                    <br />
                    <h3>DisplayPost</h3>
                    <pre>
                      <h4> Here is your Pod and all of contents in your pod</h4>
                    </pre>
                  </div>
                ),
              },
              {
                title: "How to use",
                text: (
                  <div>
                    <h2>Add Post</h2>
                    <pre>
                      <h3> 1. Click Add Post button to start edit your post</h3>
                      <img className="tuimg" src="Add Post 1.png" />

                      <h3>
                        {" "}
                        <div>
                          2.{" "}
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            if
                          </span>{" "}
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            {"("}
                          </span>{" "}
                          you dont want to create new post
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            {")"}
                          </span>{" "}
                          you can go back anytime;
                          <br />
                          &nbsp;&nbsp;
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            elseif
                          </span>{" "}
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            {"("}
                          </span>{" "}
                          you ready to start create a new post
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            {")"}
                          </span>{" "}
                          <br />
                          &nbsp;&nbsp;&nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {"{"}
                          </span>{" "}<br/>
                          &nbsp;&nbsp;&nbsp;-click the{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Start Record
                          </span>{" "}
                          button to start recording the story, the content will
                          be shown in the following text area as plain text.{" "}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;-After you finish your voice
                          record, click the{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Stop Record
                          </span>{" "}
                          button to stop recording.
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-You can also choose an
                          image as the cover of your story, remember to set a{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Name
                          </span>{" "}
                          for your post, <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-Then, you can create
                          your new story when you are ready to do so. Just click
                          the{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Submit
                          </span>{" "}
                          button.
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {"}"}
                          </span>{" "}
                          <br />
                          Tips: if you want to reset all your have done before
                          submit, just click the{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Reset
                          </span>{" "}
                          button
                        </div>
                      </h3>

                      <img className="tuimg" src="Add Post 2.png" />
                      <h3></h3>
                    </pre>
                    <br />
                    <h2>Editor</h2>
                    <pre>
                      <h3>
                        {" "}
                        <div>
                        You can upload audio from your local file system and choose parts to{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            skip
                          </span>{" "}
                          , <br />
                          <br />
                          You will see the current time displayed when you{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            hover your mouse
                          </span>{" "}
                          over the audio waveform which will help you determine the exact part you wish to skip.
                          <br />
                          <br />
                          After you finish editing, you can{" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            download
                          </span>{" "}
                          the audio file back to your local file system
                        </div>
                        <img className="tuimg" src="Editor 2.png" />
                      </h3>
                    </pre>
                    <br />
                    <h2>Translation</h2>
                    <pre>
                      <h3>
                        <div>
                          Translate your {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            English
                          </span>{" "}story to {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Maori language
                          </span>{" "}
                        </div>{" "}
                        <img className="tuimg" src="Translation.png" />
                      </h3>
                    </pre>
                    <br />
                    <h2>Contacts</h2>
                    <pre>
                      <h3> Add your friends into your contacts list</h3>
                      <img className="tuimg" src="Contacts.png" />
                    </pre>
                    <br />
                    <h2>DisplayPost</h2>
                    <pre>
                      <h3> <div>
                      In this component, you can view all the posts in your pod.<br/><br/> 
                       You have the option to {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            copy a post's link
                          </span>{" "}  to share with other {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            authorized users
                          </span>{" "},<br/>
                          <img className="tuimg" src="linkCopied.png" /> <br/> <br/> 
                       Or you can make the post 
                       {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            public so that anyone can view it.
                          </span>{" "} 
                          <br/>
                          <img className="tuimg" src="afterPublic.png" /><br/> <br/> 
                       Please note that {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            setting a post to public cannot be undone,
                          </span>{" "} so proceed with caution. <br/>
                          <img className="tuimg" src="confirm.png" /><br/> <br/> 
                          If you receive a {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            post URL
                          </span>{" "} from another user, you can change the URL of the current page to display the post. 
                          <br/>
                          <img className="tuimg" src="ChangeUrl1.png" /> <br/>
                          {" "}
                          <span
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Now you can see other user's pod
                          </span>{" "}
                          <br/>
                          <img className="tuimg" src="ChangeUrl2.png" /><br/> <br/> 
                       Similarly, you can return to your own pod at any time
                        </div></h3>
                    </pre>
                  </div>
                ),
              },
              
            ]}
          />
        );
      default:
        return <AddPost />;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("WebID copied to clipboard!"); 
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  return (
    <PostProvider>
      <div className="app-container">
        {session.info.isLoggedIn ? (
          <CombinedDataProvider
            datasetUrl={session.info.webId}
            thingUrl={session.info.webId}
          >
            <header>
              <div>
                <button onClick={() => setActiveComponent("addPost")}>
                  Story
                </button>
                <button onClick={() => setActiveComponent("editor")}>
                  Editor
                </button>
                <button onClick={() => setActiveComponent("translation")}>
                  Translation
                </button>
                
                <button onClick={() => setActiveComponent("contacts")}>
                  Contacts
                </button>
                <button onClick={() => setActiveComponent("displayPost")}>
                  Files
                </button>
                <button onClick={() => setActiveComponent("aboutproject")}>
                  About Us
                </button>
              </div>

              <div className="user-info">
                <span onClick={() => copyToClipboard(session.info.webId)}>
                  Your webID is:
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    {session.info.webId}
                  </span>
                </span>
                <br />
                <LogoutButton />
              </div>
            </header>
            <main>{renderComponent()}</main>
          </CombinedDataProvider>
        ) : (
          <div className="login-container">
            <div className="login-reminder-container">
              <p className="login-reminder">Please log in to continue</p>
            </div>

            <LoginButton
              className="login-button"
              oidcIssuer="YOUR_SOLID-SERVER-URL"
              redirectUrl={window.location.href}
              authOptions={authOptions}
            />
          </div>
        )}
      </div>
    </PostProvider>
  );
}

export default App;
