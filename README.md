Use the following command to start React.js under the folder called client
npm start

Use the following command to start React.js under the parent folder
solid start

set your solid server URL to the oidIssuser parameter
for example:
"https://login.inrupt.com/"

<LoginButton
              className="login-button"
              oidcIssuer="set your solid server URL"
              redirectUrl={window.location.href}
              authOptions={authOptions}
/>
