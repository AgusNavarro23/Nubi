import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Perfil = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <div>No estás autenticado.</div>;
  }

  console.log(user); // Verifica la estructura del objeto user

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default Perfil;