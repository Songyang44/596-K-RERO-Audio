import "./App.css";
import React, { useState, useEffect } from "react";
import Record from "./components/layout/record/Record";
import CombineofAudioRecorderandSpeech from "./components/layout/record/combineRecordandSpeech";
import solidAuth from "solid-auth-client";
import ChooseFile from "./components/layout/choose/chooseFile";
import SpeechToText from "./components/layout/speechToText/speechToText";
import EditorofAudio from "./components/layout/AudioEditor/AudioEditor";
import AudioVisualizer from "./components/layout/wave/waveform";
import { useSolidAuth } from "@ldo/solid-react";
import Login from "./components/layout/login/Login";
import { Session } from "@inrupt/solid-client-authn-browser";

function App() {
  const [user, setUser] = useState(true);

  const login = async () => {
    await solidAuth.login("https://localhost:8443/");
    const session = await solidAuth.currentSession();
    console.log(session);
    if (session) {
      setUser(true);
    }
    setUser(true);
    console.log(user);
    await session.login({
      oidcIssuer: "https://localhost:8443",
      redirectUrl: window.location.href,
      clientName: "Krero",
    });
  };

  const logout = async () => {
    solidAuth.logout();
    setUser(false);
  };

  return (
    <>
      <div>
        {user ? (
          <>
            <div className="record">
              <ChooseFile />

              {/* <Record />
              <SpeechToText /> */}
              <CombineofAudioRecorderandSpeech />
              <EditorofAudio />
            </div>

            <button onClick={logout}>logout </button>
          </>
        ) : (
          <button onClick={login}>login</button>
        )}
      </div>
    </>
  );
}

export default App;
