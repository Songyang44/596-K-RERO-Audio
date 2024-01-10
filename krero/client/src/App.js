import "./App.css";
import React, { useState,useEffect } from "react";
import Record from "./components/layout/record/Record";
import solidAuth from "solid-auth-client";
import ChooseFile from "./components/layout/choose/chooseFile";
import { useSolidAuth } from "@ldo/solid-react";
import Login from "./components/layout/login/Login";
import {Session} from "@inrupt/solid-client-authn-browser";
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

  const [user, setUser] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  
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
      oidcIssuer: 'https://localhost:8443',
      redirectUrl: window.location.href,
      clientName: 'Krero'
    });
  };

  const logout = async () => {
    solidAuth.logout();
    setUser(false);
  };

  // const solidAuth = useSolidAuth();
  // console.log(solidAuth);
  // const { session, login, logout } = useSolidAuth();

  return (
    <>
      <div>
        {user ? (
          <>
          <ChooseFile />
          <Record />
          <button onClick={logout}>logout </button>
          </>
          
        ) : (
          <button onClick={login}>login</button>
        )}
      </div>
      {/* <Login /> */}
      {/* <div>
        {session.isLoggedIn ? (
          <>
            <div>
              <p>You are logged in as {session.webId}. </p>
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
              <button
                onClick={() => {
                  const issuer = prompt(
                    "Enter your Solid Issuer",
                    "https://localhost:8443"
                  );
                  if (!issuer) return;
                  login(issuer);
                }}
              >
                Login
              </button>
            </div>

            <div className="record">
              <ChooseFile />
              <Record />
            </div>
          </>
        )} */}
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
      {/* </div> */}

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
