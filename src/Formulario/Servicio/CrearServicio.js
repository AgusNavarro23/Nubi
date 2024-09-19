import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const CrearServicio = () => {
  const [nservicio, setNServicio] = useState("");
  const [nombreservicio, setNombreServicio] = useState("");
  const [idcliente, setIDCliente] = useState("");
  const [NAP, setNAP] = useState("");
  const [clientes, setClientes] = useState([]);
  const [naps, setNaps] = useState([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchNAP, setSearchNAP] = useState("");
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showNAPModal, setShowNAPModal] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });


  const navigate = useNavigate();

  // Fetch clientes and naps from API (or database)
  useEffect(() => {
    // Ejemplo de peticiones a la API (ajusta las URLs)
    axios.get("https://localhost:7097/api/ControladorDatos/CargarClientes").then((response) => setClientes(response.data));
    axios.get("https://localhost:7097/api/ControladorDatos/CargarNaps").then((response) => setNaps(response.data));
  }, []);

  const Volver = () => {
    navigate("/ListaServicio");
  };

  const handleSelectCliente = (cliente) => {
    setIDCliente(cliente);
    setShowClienteModal(false);
    setSearchCliente(""); // Clear search field after selection
  };

  const handleSelectNAP = (nap) => {
    setNAP(nap);
    setShowNAPModal(false);
    setSearchNAP(""); // Clear search field after selection
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const filteredNAPs = naps.filter((nap) =>
    nap.codigoNap.toLowerCase().includes(searchNAP.toLowerCase())
  );

  const GuardarServicio = async (e)=>{
    e.preventDefault();
    const Servicio = {
        idServicio :nservicio,
        NombreServicio:nombreservicio,
        Cliente:idcliente.nombre,
        NAP:NAP.codigoNap
    }   
    try{
        await axios.post("https://localhost:7097/api/ControladorDatos/CrearServicio",Servicio)
        setAlert({ message: "Servicio creado con éxito", type: "success" });
        setTimeout(() => {
            Volver();
        }, 2500);
    }
    catch(error){
        const errorMessage = error.response?.data?.message || "Error al crear el Servicio"; // Muestra solo el mensaje, no el objeto completo
        setAlert({ message: errorMessage, type: "danger" });  
    }
  }
  return (
    <div className="container">
      <div className="card">
        <div
          className="card-body"
          style={{ minWidth: "40vw", minHeight: "60vh", justifyContent: "center" }}
        >
          <h2 style={{ marginBottom: "3%" }}>Cargar Servicio</h2>
          {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                        </div>
                    )}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese N° de Servicio"
              style={{ maxWidth: "40vw" }}
              value={nservicio}
              onChange={(e) => setNServicio(e.target.value)}
            />
            <label>N° Servicio</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese Nombre de Servicio"
              style={{ maxWidth: "40vw" }}
              value={nombreservicio}
              onChange={(e) => setNombreServicio(e.target.value)}
            />
            <label>Nombre Servicio</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Seleccionar Cliente"
              value={idcliente.nombre || "Seleccionar Cliente"}
              onClick={() => setShowClienteModal(true)}
              readOnly
              style={{ cursor: "pointer", maxWidth: "40vw" }}
            />
            <label>Cliente</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Seleccionar NAP"
              value={NAP.codigoNap || "Seleccionar NAP"}
              onClick={() => setShowNAPModal(true)}
              readOnly
              style={{ cursor: "pointer", maxWidth: "40vw" }}
            />
            <label>NAP</label>
          </div>
          <footer>
            <Button className="Btn-ODF" type="submit" onClick={GuardarServicio} style={{ marginRight: "5%" }}>
              Registrar
            </Button>
            <Button className="Btn-ODF" onClick={Volver}>
              Cancelar
            </Button>
          </footer>
        </div>
      </div>

      {/* Modal Cliente */}
      <Modal show={showClienteModal} onHide={() => setShowClienteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Buscar cliente..."
            value={searchCliente}
            onChange={(e) => setSearchCliente(e.target.value)}
          />
          <ul className="list-group mt-3">
            {filteredClientes.map((cliente) => (
              <li
                key={cliente.idCliente}
                className="list-group-item"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectCliente(cliente)}
              >
                {cliente.nombre}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>

      {/* Modal NAP */}
      <Modal show={showNAPModal} onHide={() => setShowNAPModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar NAP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Buscar NAP..."
            value={searchNAP}
            onChange={(e) => setSearchNAP(e.target.value)}
          />
          <ul className="list-group mt-3">
            {filteredNAPs.map((nap) => (
              <li
                key={nap.codigoNap}
                className="list-group-item"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectNAP(nap)}
              >
                {nap.codigoNap}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CrearServicio;
