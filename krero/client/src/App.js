import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import Login from "./components/layout/login/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Record from "./components/layout/record/Record";
import { LoginButton, useSession, LogoutButton } from "@inrupt/solid-ui-react";
import { login, logout, fetch } from "solid-auth-client";
import solidAuth from "solid-auth-client";
import ChooseFile from "./components/layout/choose/chooseFile";
// const authOptions = {
//   clientName: "Krero",
// };

function App() {
  // const { session } = useSession();
  // console.log(session.info);

  // const [webId, setWebId] = useState(null);
  // const [sessionInitialized, setSessionInitialized] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   async function checkLoginState() {
  //     try {
  //       const session = await fetch("session");
  //       console.log(session);
  //       if (session) {
  //         setWebId(session.webId);
  //         console.log(session.webId);
  //       }
  //       setSessionInitialized(true);
  //     } catch (error) {
  //       console.log("Error checking login status", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   checkLoginState();
  // }, []);

  // const handleLogin = async () => {
  //   if (!sessionInitialized) {
  //     console.log("Session not initialized yet.");
  //     return;
  //   }
  //   try {
  //     await login();
  //     const session = await fetch(session);
  //     if (session) {
  //       setWebId(session.webId);
  //     }
  //   } catch (error) {
  //     console.error("ERROR LOGGIN IN :", error);
  //   }
  // };
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     setWebId(null);
  //   } catch (error) {
  //     console.error("ERROR LOGGIN OUT :", error);
  //   }
  // };

  // console.log(isLoading);

  // if (isLoading) {
  //   return <div>Loading......</div>;
  // }

  const [user, setUser] = useState(null);
  const login = async () => {
    await solidAuth.login("https://localhost:8443/");
    const session = await solidAuth.currentSession();
    if (session) {
      setUser(session.webId);
    }
  };

  const logout = async () => {
    await solidAuth.logout();
    setUser(null);
  };

  return (
    <>
      <div>
        {user ? (
          <>
            <div>
              <p>You are logged in as {user}</p>
              <button onClick={logout}>Logout</button>
            </div>
            <div className="selectFile">
              <Record />
            </div>
          </>
        ) : (
          <>
            <div>
              <p>You are not logged in .</p>
              <button onClick={login}>Login</button>
            </div>

            <div className="record">
              <ChooseFile />
              <Record />
            </div>
          </>
        )}
        {/* {session.info.isLoggedIn ? (
          // <>
          //   <div>
          //     <span>You are logged in as :{session.info.webId}</span>
          //     <LogoutButton />
          //   </div>
          //   <div className="selectFile">
          //     <Record />
          //   </div>
          // </>
        ) : (
          // <div className="selectFile">
          //   <LoginButton
          //     oidcIssuer="https://login.inrupt.com/"
          //     redirectUrl={window.location.href}
          //     authOptions={authOptions}
          //   />
          // </div>
        )} */}
      </div>

      {/* <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Link to="/recording">
                  <button>Start Recording</button>
                </Link>
              </>
            }
          />
          <Route path="/recording" element={<Record />} />
        </Routes>
      </Router> */}
    </>
  );
}

export default App;
