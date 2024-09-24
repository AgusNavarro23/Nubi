import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

const LoginForms = () => {
  const { loginWithRedirect,isAuthenticated } = useAuth0();



  return (
    <div style={styles.container}>
      <img src="NubicomInicio.jpg" style={styles.image} alt="Background" />
      <Button onClick={() => loginWithRedirect()} style={styles.button}>
        Iniciar Sesión
      </Button>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: '50%', // Aplica el efecto gris a la imagen
    zIndex: -1, // Asegura que la imagen esté detrás del botón
  },
  button: {
    zIndex: 1,
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LoginForms;