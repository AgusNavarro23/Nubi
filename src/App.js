import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./Formulario/Home";
import LoginForms from "./Login/Loginforms";
import './App.css';
import Perfil from "./Usuario/Perfil";
import SideBar from "./Formulario/SideBar";
import ListaODF from "./Formulario/ODF/ListaODF.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-calendar/dist/Calendar.css';
import ListaPelo from "./Formulario/PeloFibra/ListaPelo.js";
import ListaTroncal from "./Formulario/Troncales/ListaTroncal.js";
import ListaBotella from "./Formulario/Botella/ListaBotella.js";
import ListaSpliter from "./Formulario/Spliter/ListaSpliter.js";
import ListaDistribucion from "./Formulario/Distribuciones/ListaDistribucion.js";
import ListaNap from "./Formulario/NAPs/ListaNap.js";
import ListaServicio from "./Formulario/Servicio/ListaServicio.js";
import ListaCliente from "./Formulario/Clientes/ListaCliente.js";
import ListaMantenimientos from "./Mantenimientos/ListaMantenimientos.js";
import MantenimientosProgramados from "./Mantenimientos/MantenimientosProgramados.js";
import ListaIncidencias from "./Incidencias/ListaIncidencias.js";
import ListaBotella2Nivel from "./Formulario/Botella/ListaBotella2Nivel.js";
import ListaDistribucion2Nivel from "./Formulario/Distribuciones/ListaDistribucion2Nivel.js";
import ListaNapDerivada from "./Formulario/NAPs/ListaNapDerivada.js";
import ListaPtps from "./Formulario/Ptps/ListaPtps.js";
import ListaIntervencion from "./Formulario/Intervencion/ListaIntervencion.js";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // O muestra un componente de carga personalizado
  }

  //En esta pate del código, se establecen las rutas de la página, además se indica que Componente se renderiza.

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
            <Route path="/ListaPelo" element={isAuthenticated ? <ListaPelo /> : <Navigate to="/" />} />
            <Route path="/ListaTroncal" element={isAuthenticated ? <ListaTroncal/> : <Navigate to="/" />} />
            <Route path="/ListaBotella" element={isAuthenticated ? <ListaBotella/> : <Navigate to="/" />} />
            <Route path="/ListaIntervencion" element={isAuthenticated ? <ListaIntervencion/> : <Navigate to="/" />} />
            <Route path="/ListaBotella2Nivel" element={isAuthenticated ? <ListaBotella2Nivel/> : <Navigate to="/" />} />
            <Route path="/ListaSpliter" element={isAuthenticated ? <ListaSpliter/> : <Navigate to="/" />} />
            <Route path="/ListaDistribucion" element={isAuthenticated ? <ListaDistribucion/> : <Navigate to="/" />} />
            <Route path="/ListaDistribucion2Nivel" element={isAuthenticated ? <ListaDistribucion2Nivel/> : <Navigate to="/" />} />
            <Route path="/ListaNap" element={isAuthenticated ? <ListaNap/> : <Navigate to="/" />} />
            <Route path="/ListaNapDerivada" element={isAuthenticated ? <ListaNapDerivada/> : <Navigate to="/" />} />
            <Route path="/ListaPtps" element={isAuthenticated ? <ListaPtps/> : <Navigate to="/" />} />
            <Route path="/ListaServicio" element={isAuthenticated ? <ListaServicio/> : <Navigate to="/" />} />
            <Route path="/ListaCliente" element={isAuthenticated ? <ListaCliente/> : <Navigate to="/" />} />
            <Route path="/ListaMantenimientos" element={isAuthenticated ? <ListaMantenimientos/> : <Navigate to="/" />} />
            <Route path="/MantenimientosProgramados" element={isAuthenticated ? <MantenimientosProgramados/> : <Navigate to="/" />} />
            <Route path="/ListaIncidencias" element={isAuthenticated ? <ListaIncidencias/> : <Navigate to="/" />} />



          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
