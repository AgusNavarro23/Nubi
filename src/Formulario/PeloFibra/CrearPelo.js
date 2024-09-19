import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrearPelo = () => {
    const [troncal, setTroncal] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [selectedTroncal, setSelectedTroncal] = useState(""); // Para almacenar el troncal seleccionado
    const [tronID, setTronID]=useState("");
    const [showModal, setShowModal] = useState(false); // Controlar el modal
    const [search, setSearch] = useState(""); // Controlar el valor del buscador
    const [peloData, setPeloData] = useState({ colorBuffer: "", colorPelo: "" }); // Datos del pelo a crear

    const navigate = useNavigate();

    useEffect(() => {
        // Cargar todos los Troncales
        axios.get("https://localhost:7097/api/ControladorDatos/Troncales")
            .then(response => {
                setTroncal(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar los Troncales:", error);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPeloData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleTroncalSelection = (id, nombre) => {
        setSelectedTroncal(nombre);
        setTronID(id);
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const Volver = () => {
        navigate("/ListaPelo");
    };

    const EnviarPelo = async (e) => {
        e.preventDefault();
        try {
            const pelo = {
                ColorBuffer: peloData.colorBuffer,
                ColorPelo: peloData.colorPelo,
                Troncal: tronID
            };
            await axios.post("https://localhost:7097/api/ControladorDatos/CrearPelo", pelo);
            alert("Pelo creado con éxito");
            Volver();
        } catch (error) {
            alert(error.response?.data || "Error al crear el Pelo");
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar Pelo</h2>
                    <form onSubmit={EnviarPelo}>
                        <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="colorBuffer" 
                                placeholder="Ingrese Color Buffer" 
                                style={{ maxWidth: '40vw' }}
                                value={peloData.colorBuffer}
                                onChange={handleInputChange} 
                            />
                            <label htmlFor="colorBuffer">Color Buffer</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="colorPelo" 
                                placeholder="Ingrese Color Pelo" 
                                style={{ maxWidth: '40vw' }} 
                                value={peloData.colorPelo}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="colorPelo">Color Pelo</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="selectedTroncal"
                                placeholder="Seleccionar Troncal"
                                style={{ maxWidth: '40vw' }}
                                value={selectedTroncal}
                                readOnly
                                onClick={() => setShowModal(true)}
                            />
                            <label htmlFor="selectedTroncal">Troncal</label>
                        </div>
                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar Pelo
                            </Button>
                            <Button className="Btn-ODF" onClick={Volver}>
                                Cancelar
                            </Button>
                        </footer>
                    </form>
                </div>
            </div>

            {/* Modal para seleccionar Troncal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Troncal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar Troncal"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <ul className="list-group">
                        {troncal
                            .filter(item => item.tr_Nombre.toLowerCase().includes(search.toLowerCase()))
                            .map(item => (
                                <li
                                    key={item.idTroncal}
                                    className="list-group-item"
                                    onClick={() => handleTroncalSelection(item.idTroncal, item.tr_Nombre)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.tr_Nombre}
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
    );
};

export default CrearPelo;
