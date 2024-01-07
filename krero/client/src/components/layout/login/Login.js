import React from 'react';
import { login, logout, currentSession } from 'solid-auth-client';

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      await login();
      const session = await currentSession();
      if (session) {
        alert(`login sessfully，welcom: ${session.webId}`);
      }
    } catch (error) {
      console.error('login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('logout');
    } catch (error) {
      console.error('logout failed:', error);
    }
  };

  return (
    <div>
      {currentSession() ? (
        <button onClick={handleLogout}>logout</button>
      ) : (
        <button onClick={handleLogin}>login</button>
      )}
    </div>
  );
}

