import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./Formulario/Home";
import LoginForms from "./Login/Loginforms";
import './App.css';
import Perfil from "./Usuario/Perfil";
import CrearODF from "./Formulario/ODF/CrearODF.js";
import SideBar from "./Formulario/SideBar";
import CrearPelo from "./Formulario/PeloFibra/CrearPelo.js";
import CrearTroncal from "./Formulario/Troncales/Creartroncal.js";
import CrearBotella from "./Formulario/Botella/CrearBotella.js";
import CrearSpliter from "./Formulario/Spliter/CrearSpliter.js";
import CrearDistribucion from "./Formulario/Distribuciones/CrearDistribucion.js";
import CrearNap from "./Formulario/NAPs/CrearNap.js";
import CrearServicio from "./Formulario/Servicio/CrearServicio.js";
import CrearCliente from "./Formulario/Clientes/CrearCliente.js";
import ListaODF from "./Formulario/ODF/ListaODF.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditarODF from "./Formulario/ODF/EditarODF.js";
import ListaPelo from "./Formulario/PeloFibra/ListaPelo.js";
import EditarPelo from "./Formulario/PeloFibra/EditarPelo.js";
import ListaTroncal from "./Formulario/Troncales/ListaTroncal.js";
import EditarTroncal from "./Formulario/Troncales/EditarTroncal.js";
import ListaBotella from "./Formulario/Botella/ListaBotella.js";
import EditarBotella from "./Formulario/Botella/EditarBotella.js";
import ListaSpliter from "./Formulario/Spliter/ListaSpliter.js";
import EditarSpliter from "./Formulario/Spliter/EditarSpliter.js";
import EditarDistribucion from "./Formulario/Distribuciones/EditarDistribucion.js";
import ListaDistribucion from "./Formulario/Distribuciones/ListaDistribucion.js";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // O muestra un componente de carga personalizado
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <SideBar />}
        <div className="content">
          <Routes>
            <Route path="/" element={!isAuthenticated ? <LoginForms /> : <Navigate to="/home" />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
            <Route path="/perfil" element={isAuthenticated ? <Perfil /> : <Navigate to="/" />} />
            <Route path="/ListaODF" element={isAuthenticated ? <ListaODF /> : <Navigate to="/" />} />
            <Route path="/CrearODF" element={isAuthenticated ? <CrearODF /> : <Navigate to="/" />} />
            <Route path="EditarODF/:id" element={isAuthenticated ? <EditarODF /> : <Navigate to="/" />} />
            <Route path="/ListaPelo" element={isAuthenticated ? <ListaPelo /> : <Navigate to="/" />} />
            <Route path="/CrearPelo" element={isAuthenticated ? <CrearPelo/> : <Navigate to="/" />} />
            <Route path="EditarPelo/:id" element={isAuthenticated ? <EditarPelo/> : <Navigate to="/" />} />
            <Route path="/ListaTroncal" element={isAuthenticated ? <ListaTroncal/> : <Navigate to="/" />} />
            <Route path="/CrearTroncal" element={isAuthenticated ? <CrearTroncal/> : <Navigate to="/" />} />
            <Route path="EditarTroncal/:id" element={isAuthenticated ? <EditarTroncal/> : <Navigate to="/" />} />
            <Route path="/ListaBotella" element={isAuthenticated ? <ListaBotella/> : <Navigate to="/" />} />
            <Route path="/CrearBotella" element={isAuthenticated ? <CrearBotella/> : <Navigate to="/" />} />
            <Route path="/EditarBotella/:id" element={isAuthenticated ? <EditarBotella/> : <Navigate to="/" />} />
            <Route path="/ListaSpliter" element={isAuthenticated ? <ListaSpliter/> : <Navigate to="/" />} />
            <Route path="/CrearSpliter" element={isAuthenticated ? <CrearSpliter/> : <Navigate to="/" />} />
            <Route path="/EditarSpliter/:id" element={isAuthenticated ? <EditarSpliter/> : <Navigate to="/" />} />
            <Route path="/ListaDistribucion" element={isAuthenticated ? <ListaDistribucion/> : <Navigate to="/" />} />
            <Route path="/CrearDistribucion" element={isAuthenticated ? <CrearDistribucion/> : <Navigate to="/" />} />
            <Route path="/EditarDistribucion/:id" element={isAuthenticated ? <EditarDistribucion/> : <Navigate to="/" />} />
            <Route path="/CrearNap" element={isAuthenticated ? <CrearNap/> : <Navigate to="/" />} />
            <Route path="/CrearServicio" element={isAuthenticated ? <CrearServicio/> : <Navigate to="/" />} />
            <Route path="/CrearCliente" element={isAuthenticated ? <CrearCliente/> : <Navigate to="/" />} />


          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
