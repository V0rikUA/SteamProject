import React from "react";

const LoginWithSteamButton = () => {
  const handleLoginWithSteam = () => {
    window.location.href = "http://localhost:3000/auth/steam"; // Redirect to backend route for authentication
  };

  return <button onClick={handleLoginWithSteam}>Login with Steam</button>;
};

export default LoginWithSteamButton;
