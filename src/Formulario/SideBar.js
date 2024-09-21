import React from "react";
import { Link} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import './Estilos/Home.css'
import { Accordion } from 'react-bootstrap'; // Importar el componente Accordion




function SideBar (){
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
  
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-auto col-md-2 min-vh-100" style={{ width: '250px', backgroundColor: '#4892e7' }}>
            <Link to="/home">
              <a className="text-decoration-none text-white d-flex" style={{ backgroundColor: 'white', marginRight: '-20px', marginLeft: '-20px', marginBottom: '30px' }}>
                <img src="Nubicom.png" alt="Logo" style={{ width: '100%' }} />
              </a>
            </Link>
            <ul className="nav nav-pills flex-column">
  
              {/* Accordion for Datos */}
              <Accordion style={{padding:'0px'}}>
                <Accordion.Item eventKey="0" className="custom-acordeon" style={{marginBottom:'10px'}}>
                  <Accordion.Header className="custom-acordeon-header" style={{ color: '#4892e7', marginTop:'-10px' }}>
                    <i className="bi bi-database-fill-add" style={{color:'#4892e7'}}></i>
                    <span className="ms-2" style={{color:'#4892e7'}}>Datos</span>
                  </Accordion.Header>
                  <Accordion.Body style={{ backgroundColor: 'white' }}>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/ListaODF" className="nav-link text-cyan">ODF</Link>
                      </li>
                      <li>
                        <Link to="/ListaTroncal" className="nav-link text-cyan">Troncales</Link>
                      </li>
                      <li>
                        <Link to="/ListaPelo" className="nav-link text-cyan">Pelos de Fibra</Link>
                      </li>
                      <li>
                        <Link to="/ListaBotella" className="nav-link text-cyan">Botella</Link>
                      </li>
                      <li>
                        <Link to="/" className="nav-link text-cyan">Intervención</Link>
                      </li>
                      <li>
                        <Link to="/ListaSpliter" className="nav-link text-cyan">Spliter</Link>
                      </li>
                      <li>
                        <Link to="/ListaDistribucion" className="nav-link text-cyan">Distribucion</Link>
                      </li>
                      <li>
                        <Link to="ListaNap" className="nav-link text-cyan">NAP</Link>
                      </li>
                      <li>
                        <Link to="/ListaServicio" className="nav-link text-cyan">Servicio</Link>
                      </li>
                      <li>
                        <Link to="/ListaCliente" className="nav-link text-cyan">Cliente</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" style={{marginBottom:'10px'}}>
                  <Accordion.Header style={{marginTop:'-10px', backgroundColor:'red' }}>
                    <i className="bi bi-question-diamond-fill" style={{color:'#4892e7'}}></i>
                    <span className="ms-2" style={{color:'#4892e7'}}>Mantenimientos</span>
                  </Accordion.Header>
                  <Accordion.Body style={{ backgroundColor: 'white' }}>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/ListaMantenimientos" className="nav-link text-cyan">Lista de Mantenimientos</Link>
                      </li>
                      <li>
                        <Link to="/MantenimientosProgramados" className="nav-link text-cyan">Mantenimientos Programados</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" style={{marginBottom:'10px'}}>
                  <Accordion.Header style={{ color: '#4892e7', marginTop:'-10px' }}>
                    <i className="bi bi-exclamation-triangle-fill" style={{color:'#4892e7'}}> </i>
                    <span className="ms-2" style={{color:'#4892e7'}}>Incidencias</span>
                  </Accordion.Header>
                  <Accordion.Body style={{ backgroundColor: 'white' }}>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/ruta-datos-1" className="nav-link text-cyan">Lista de Incidencias</Link>
                      </li>
                      <li>
                        <Link to="/ruta-datos-2" className="nav-link text-cyan">ETRs</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </ul>
          </div>
        </div>
      </div>
    );
  }

export default SideBar;