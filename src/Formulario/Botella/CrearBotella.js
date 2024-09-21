import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Icono personalizado para "Botella"
const botellaIcon = new L.Icon({
    iconUrl: "marcador.png", // Reemplaza esta URL con la ruta correcta de tu imagen
    iconSize: [32, 32], // Tamaño del icono
    iconAnchor: [16, 32], // El punto de anclaje para centrar el icono en la posición
    popupAnchor: [0, -32], // El punto desde donde abrir el popup
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

const CrearBotella = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [position, setPosition] = useState([0, 0]);
    const [descripcion,setDescripcion]=useState("");
    const [ubicacion, setUbicacion] = useState(""); // Estado para guardar la ubicación concatenada
    const [tipo,setTipo]=useState("")
    const [distanciaOptica,setDistanciaOptica]=useState(null)
    const [distanciaLineal,setDistanciaLineal]=useState(null)
    const [alert, setAlert] = useState({ message: "", type: "" });
    // Referencia al mapa para centrar la vista
    const mapRef = useRef();

    const Volver = () => {
        navigate("/ListaBotella");
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
            setUbicacion(`${lat},${lng}`); // Concatenar latitud y longitud
        }
    };

    const GuardarBotella = async (e) => {
        e.preventDefault();
        const Botella = {
            Descripcion:descripcion,
            Ubicacion:ubicacion, // Agregar la ubicación concatenada al objeto de Botella
            Tipo:tipo,
            DistanciaOptica:distanciaOptica,
            DistanciaLineal:distanciaLineal
        };

        try {
            console.log(Botella)
            await axios.post("https://localhost:7097/api/ControladorDatos/CrearBotella",Botella)
            setAlert({ message: "Botella creada con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al crear la Botella"; // Muestra solo el mensaje, no el objeto completo
            setAlert({ message: errorMessage, type: "danger" });        }
    };

    return (
        <div >
            <div className="header">

            </div>
            <div className="card" style={{marginLeft:'5%'}}>
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar Botella</h2>
                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                        </div>
                    )}
                    <form onSubmit={GuardarBotella}>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder=""
                             style={{ maxWidth: '40vw' }} 
                             onChange={(e)=> setDescripcion(e.target.value)}
                             />
                            <label htmlFor="floatingInput">Código Botella</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="ubicacionInput"
                                style={{ maxWidth: '40vw' }}
                                placeholder="Ingrese la ubicación"
                                value={ubicacion} // Cargar la ubicación concatenada en el input
                                onClick={handleOpenModal}
                                readOnly
                            />
                            <label htmlFor="ubicacionInput">Ubicación</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="floatingInput" 
                            style={{ maxWidth: '40vw' }}
                            onChange={(e)=>setDistanciaLineal(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Distancia Lineal</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="floatingInput" 
                            style={{ maxWidth: '40vw' }}
                            onChange={(e)=>setDistanciaOptica(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Distancia Óptica</label>
                        </div>
                        <div className="form-floating mb-3">
                            <select className="form-select" aria-label="Default select example"
                            onChange={(e)=>setTipo(e.target.value)}>
                                <option selected>Seleccionar Tipo</option>
                                <option value="BOTELLA TRONCAL">BOTELLA TRONCAL</option>
                                <option value="CEDO">CEDO</option>
                                <option value="BOTELLA DE DISTRIBUCIOn">BOTELLA DE DISTRIBUCION</option>
                            </select>
                            <label htmlFor="floatingInput">Tipo</label>
                        </div>
                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar Botella
                            </Button>
                            <Button className="Btn-ODF" onClick={Volver}>
                                Cancelar
                            </Button>
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
                        <Marker position={position} icon={botellaIcon}></Marker>
                        <ChangeView center={position} />
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrearBotella;
