import React from "react";
import { Link} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import './Estilos/Home.css'



const SideBar =()=>{
    const {user,logout} = useAuth0()
    const CerrarSesion = () => {
      logout({
        returnTo: window.location.origin,
        federated: true
      });
    
      localStorage.clear();
      sessionStorage.clear();
    
      // Recarga la página para asegurarse de que todos los datos de sesión se borren
      window.location.reload();
    };
  
    return(
        <div className="slidebar">
  <div className="name_pagina">
    <span>NUBICOM</span>
  </div>
  <nav className="barra-navegacion">
    <div className="navbar">
      <form className="form-serch" role="search">
        <input className="form-control me-2 searchinput" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit"><i className="bi bi-search"></i></button>
      </form>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item active">
            <Link className="nav-link" to="/ListaODF">ODF</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaPelo">Pelo Fibra</Link>
        </li>
        <li className="nav-item active">
            <Link className="nav-link" to="/ListaTroncal">Troncal</Link>
      </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaBotella">Botellas</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="">Intervención</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaSpliter">Spliter</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaDistribucion">Distribuciones</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaNap">NAPS</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaServicio">Servicio</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/ListaCliente">Clientes</Link>
        </li>
      </ul>
    </div> 
    <div className="usercontent">
      <div>
        <img src={user.picture} alt={user.name} style={{display:"flex",marginLeft:'auto',marginRight:'auto',padding:'10px'}} />
        <span className="color-black">{user.name}</span>
      </div>
      <form>
        <button onClick={CerrarSesion}>Cerrar Sesión</button>
    </form>
    </div>
  </nav>
</div>


    )
}

export default SideBar;