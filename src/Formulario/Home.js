import React from "react";

const Home = ()=>{
    
    return (
        <div style={styles.container}>
        <img src="NubicomInicio.jpg" style={styles.image} alt="Background" />
      </div>
    )
}
const styles = {
    container: {
      position: 'relative',
      width: '86.5vw',
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
  };
export default Home