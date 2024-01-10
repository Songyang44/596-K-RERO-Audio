import React, {useState} from "react";
// import { login, logout, currentSession } from "solid-auth-client";
// import { useSolidAuth } from "@ldo/solid-react";
import Record from "../record/Record";
import solidAuth from "solid-auth-client";
import ChooseFile from "../choose/chooseFile";
// import { FunctionComponent } from "react";

export default function LoginButton() {

  const [user, setUser] = useState();
  const login = async () => {
    await solidAuth.login("https://localhost:8443/");
    // const session = await solidAuth.currentSession();
    // console.log(session);
    // if (session) {
    //   setUser(true);
    // }
    setUser(true);
    console.log(user);
  };

  const logout = async () => {
    await solidAuth.logout();
    setUser(false);
    console.log(user);
  };
  //   const handleLogin = async () => {
  //     try {
  //       await login();
  //       const session = await currentSession();
  //       if (session) {
  //         alert(`login sessfully，welcom: ${session.webId}`);
  //         console.log(session);
  //       }
  //     } catch (error) {
  //       console.error("login failed:", error);
  //     }
  //   };

  //   const handleLogout = async () => {
  //     try {
  //       await logout();
  //       alert("logout");
  //     } catch (error) {
  //       console.error("logout failed:", error);
  //     }
  //   };

  //   return (
  //     <div>
  //       {/* {currentSession() ? (
  //         <button onClick={handleLogout}>logout</button>
  //       ) : (
  //         <button onClick={handleLogin}>login</button>
  //       )} */}
  //       <button onClick={handleLogin}>login</button>
  //     </div>
  //   );
  // }
  // const solidAuth = useSolidAuth();
  // console.log(solidAuth);
  // const { session, login, logout } = useSolidAuth();

  return (
    <>
    {/*
      <div>
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
              <ChooseFile setAudioFile={undefined} />
              <Record />
            </div>
          </>
        )}
        */}

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
        )} 
      </div>*/}

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
};
