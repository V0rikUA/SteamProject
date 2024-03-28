import React from "react";

const LoginWithSteamButton = () => {
  const handleLoginWithSteam = () => {
    window.open("http://localhost:3000/auth/steam?id=1"); // Redirect to backend route for authentication
  };

  return <button onClick={handleLoginWithSteam}>Login with Steam</button>;
};

export default LoginWithSteamButton;
