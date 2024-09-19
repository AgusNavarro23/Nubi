import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button,Modal,Form } from "react-bootstrap";
import axios from "axios";
const CrearSpliter = () =>{
    const [botella,setBotella]=useState([]);
    const [selectedBotella, setSelectedBotella] = useState(""); // Para almacenar el troncal seleccionado
    const [BotID, setBotID]=useState("");
    const [showModal, setShowModal] = useState(false); // Controlar el modal
    const [search, setSearch] = useState(""); // Controlar el valor del buscador
    const [spliterdata, setSpliterData] = useState({ colorBuffer: "", colorPelo: "" }); // Datos del pelo a crear    const navigate = useNavigate();

    useEffect(() => {
        // Cargar todos los Troncales
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas')            .then(response => {
                setBotella(response.data);
            })
            .catch(error => {
                console.error("Error al cargar las Botellas:", error);
            });
    }, []);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSpliterData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleTroncalSelection = (id, nombre) => {
        setSelectedBotella(nombre);
        setBotID(id);
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Spliter</h2>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Sector</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Casette</label>
                </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="selectedeBotella"
                                placeholder="Seleccionar Botella"
                                style={{ maxWidth: '40vw' }}
                                value={selectedBotella}
                                readOnly
                                onClick={() => setShowModal(true)}
                            />
                            <label htmlFor="selectedBotella">Botella</label>
                        </div>
                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{marginRight:'5%'}}>
                                Registrar Spliter
                            </Button>
                            <Button className="Btn-ODF">
                                Volver
                            </Button>
                        </footer>
            </div>
        </div>    
                    {/* Modal para seleccionar Botella */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Botella</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar Botella"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <ul className="list-group">
                        {botella
                            .filter(item => item.descripcion.toLowerCase().includes(search.toLowerCase()))
                            .map(item => (
                                <li
                                    key={item.idTroncal}
                                    className="list-group-item"
                                    onClick={() => handleTroncalSelection(item.idBotella, item.descripcion)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.descripcion}
                                </li>
                            ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>            
    </div>
    )
}
export default CrearSpliter