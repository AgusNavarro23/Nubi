import React, { useState, useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal,Form } from "react-bootstrap";
import { MapContainer, TileLayer, Marker,useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Icono personalizado para "Nap"
const napIcon = new L.Icon({
    iconUrl: "marcador.png", // Reemplaza esta URL con la ruta correcta de tu imagen
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13); // Centra el mapa en las coordenadas especificadas
        }
    }, [center, map]);
    return null;
};
const CrearNap = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [position, setPosition] = useState([0, 0]);
    const [ubicacion, setUbicacion] = useState("");
    const [codigoNap, setCodigoNap] = useState("");
    const [distanciaOptica, setDistanciaOptica] = useState(null);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const mapRef = useRef();
    const [distribucion, setDistribucion] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [selectedDistribucion, setSelectedDistribucion] = useState(""); // Para almacenar la distribucion seleccionada
    const [distID, setDistID] = useState("");
    const [search, setSearch] = useState(""); // Controlar el valor del buscador
    const [showDistribucion,setShowDistribucion]=useState(false);

    useEffect(() => {
        // Cargar todas las DistribucionesSector
        axios.get("https://localhost:7097/api/ControladorDatos/Distribuciones")
            .then(response => {
                setDistribucion(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar las DistribucionesSector:", error);
                setLoading(false);
            });
    }, []);

    const handleDistribucionSelection = (id, nombre) => {
        setSelectedDistribucion(nombre);
        setDistID(id);
        setShowDistribucion(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const Volver = () => {
        navigate("/ListaNap");
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLatitudChange = (e) => {
        setLatitud(e.target.value);
    };

    const handleLongitudChange = (e) => {
        setLongitud(e.target.value);
    };

    const handleSetLocation = () => {
        const lat = parseFloat(latitud);
        const lng = parseFloat(longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
            setPosition([lat, lng]);
            setUbicacion(`${lat},${lng}`);
        }
    };

    const GuardarNap = async (e) => {
        e.preventDefault();
        const Nap = {
            CodigoNap:codigoNap,
            Ubicacion: ubicacion,
            DistanciaOptica: distanciaOptica,
            Distribucion:distID
        };

        try {
            console.log(Nap);
            await axios.post("https://localhost:7097/api/ControladorDatos/CrearNap",Nap)
            setAlert({ message: "NAP creado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al crear el NAP";
            setAlert({ message: errorMessage, type: "danger" });
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar NAP</h2>
                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    )}
                    <form onSubmit={GuardarNap}>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder="Código NAP"
                                onChange={(e)=>setCodigoNap(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Código NAP</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="ubicacionInput"
                                placeholder="Ubicación"
                                value={ubicacion}
                                onClick={handleOpenModal}
                                readOnly
                            />
                            <label htmlFor="ubicacionInput">Ubicación</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="floatingInput"
                                onChange={(e) => setDistanciaOptica(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Distancia Óptica</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="selectedDistribucion"
                                placeholder="Seleccionar Distribución"
                                style={{ maxWidth: '40vw' }}
                                value={selectedDistribucion} // Asignamos el valor seleccionado
                                readOnly
                                onClick={() => setShowDistribucion(true)} // Abrimos el modal al hacer clic
                            />
                            <label htmlFor="selectedDistribucion">Distribución</label>
                        </div>
                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar
                            </Button>
                            <Button className="Btn-ODF" onClick={Volver}>Cancelar</Button>
                        </footer>
                    </form>
                </div>
            </div>

            {/* Modal for map */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Ubicación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Latitud"
                            value={latitud}
                            onChange={handleLatitudChange}
                        />
                        <label htmlFor="floatingInput">Latitud</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Longitud"
                            value={longitud}
                            onChange={handleLongitudChange}
                        />
                        <label htmlFor="floatingInput">Longitud</label>
                    </div>
                    <Button onClick={handleSetLocation}>Mostrar en Mapa</Button>
                    <MapContainer
                        center={position}
                        zoom={13}
                        style={{ height: "300px", marginTop: "20px" }}
                        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} icon={napIcon}></Marker>
                        <ChangeView center={position}/>
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para seleccionar Distribución */}
            <Modal show={showDistribucion} onHide={() => setShowDistribucion(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Distribución</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar Distribución"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <ul className="list-group">
                        {distribucion
                            .filter(item => item.descripcion.toLowerCase().includes(search.toLowerCase()))
                            .map(item => (
                                <li
                                    key={item.descripcion}
                                    className="list-group-item"
                                    onClick={() => handleDistribucionSelection(item.idDistribucionSector, item.descripcion)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.descripcion}
                                </li>
                            ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDistribucion(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrearNap;