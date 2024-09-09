import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginForms = () => {
  const { loginWithRedirect,isAuthenticated } = useAuth0();

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Log In</button>;
      <button onClick={()=>console.log("Is Authenticated:", isAuthenticated)}>Hola</button>
    </div>
  ) 
};

export default LoginForms;