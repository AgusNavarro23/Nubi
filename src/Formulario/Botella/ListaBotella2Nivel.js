import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from 'sweetalert2';
import Select from 'react-select';

//Se importan las librerias necesarias

const botellaIcon = new L.Icon({
    iconUrl: "marcador.png", // Ruta correcta de tu imagen
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});


const ListaBotella2Nivel = () => {
    const [distribuciones,setDistribuciones]=useState([]); //Variable para cargar las Distribuciones
    const [Botellas, setBotellas] = useState([]); //Variable para cargar las Botellas
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false); //Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false); //Variable para el modal de Detalle
    const [detalleBotella,setDetalleBotella] = useState({})
    const [showFormulario,setShowFormulario]=useState(false); //Variable para el modal de Formulario
    
    const [BotBorrar,setBotBorrar]=useState("");

    //Variables para guardar Botella
    const [descripcion,setDescripcion]=useState("");
    const [ubicacion,setUbicacion]=useState("");
    const [distanciaOptica,setDistanciaOptica]=useState("");
    const [distanciaLineal,setDistanciaLineal]=useState("");
    const [distribucion,setDistribucion]=useState("");


    const CargarDatos=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas2Nivel')
            .then(response => {
                const data = response.data;
                setBotellas(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
                setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                setLoading(false);
            })
            .catch(error => {
                console.error('Hubo un error al obtener las Botellas:', error);
                setLoading(false);
            });
            axios.get('https://localhost:7097/api/ControladorDatos/Distribuciones')
            .then(response => {
                const data = response.data;
                setDistribuciones(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los Pelos de Fibra:', error);
                setLoading(false);
            });
    }
    const LimpiarFormulario=()=>{
        setDescripcion("");
        setUbicacion("");
        setDistanciaOptica("");
        setDistanciaLineal("");
        setDistribucion("");
    }

    useEffect(() => {
        CargarDatos();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(Botellas.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setShowModal(true);
        setBotBorrar(ID)
    }

    const BorrarSeleccionado = () => {
        if (BotBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarBotella2Nivel/${BotBorrar}`)
        .then(response=>{
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La Botella ha sido eliminado exitosamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setShowModal(false)
                    CargarDatos();
                });
        })
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el Troncal.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })
    }
    const handleDetalles = (botella)=>{
        setDetalleBotella(botella);
        setShowDetalle(true)
    }
    const handleGuardar =()=>{
        const botella ={
            descripcion,
            distanciaLineal,
            distanciaOptica,
            ubicacion,
            distribucion
        }
        if (!descripcion || !distribucion || !distanciaLineal || !distanciaOptica || !ubicacion){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son requeridos.',
                confirmButtonText: 'OK'
            });
            return; // Salir si hay campos faltantes
        }
        else{
            Swal.fire({
                title: 'Cargando...',
                text: 'Guardando la Botella...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearBotella2Nivel",botella,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'La Botella ha sido guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setShowFormulario(false);
                    CargarDatos();
                    LimpiarFormulario();
                });
            })
            .catch(error =>{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al guardar la Botella.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }


    return (
        <div>
            <div className="header">
                <h1>Lista de Botellas</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Botella</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Descripcion</th>
                                <th>Ubicación</th>
                                <th>DistanciaOptica</th>
                                <th>DistanciaLineal</th>
                                <th>Distribucion</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(botella => (
                                    <tr key={botella.idBotella2Nivel}>
                                        <td>{botella.idBotella2Nivel}</td>
                                        <td>{botella.descripcion}</td>
                                        <td>{botella.ubicacion}</td>
                                        <td>{botella.distanciaOptica}</td>
                                        <td>{botella.distanciaLineal}</td>
                                        <td>{botella.distribucion}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(botella.idBotella2Nivel)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(botella)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Botellas disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>Descripcion</th>
                            </tr>
                        </tfoot>
                    </table>
                    <Pagination>
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>
            {/* Modal de confirmación */}
            <Modal show={ShowModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar esta Botella?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={BorrarSeleccionado}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Detalle de Botella */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Botella</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Descripción: {detalleBotella.descripcion}</p>
                    <p>Ubicación: {detalleBotella.ubicacion}</p>
                    <p>Distancia Lineal: {detalleBotella.distanciaLineal}</p>
                    <p>Distancia Optica: {detalleBotella.distanciaOptica}</p>
                    <p>Distribución: {detalleBotella.distribucion}</p>
                    {/* Mostrar mapa con ubicación */}
                    {detalleBotella.ubicacion && (
                        <MapContainer
                            center={detalleBotella.ubicacion.split(',').map(Number)} // Convertir ubicación a array de números
                            zoom={15}
                            style={{ height: "300px", marginTop: "20px" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker 
                                position={detalleBotella.ubicacion.split(',').map(Number)} 
                                icon={botellaIcon} 
                            />
                        </MapContainer>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

           {/* Modal Formulario */}
           <Modal show={showFormulario} onHide={() => setShowFormulario(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar Botella2Nivel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Descripción de Botella</Form.Label>
                            <Form.Control
                                type='text'
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Distribución</Form.Label>
                            <Select 
                                value={distribuciones.find(option=>option.value===distribucion)}
                                onChange={(selectedOption)=>setDistribucion(selectedOption.value)}
                                options={distribuciones.map((item)=>({
                                    value:item.idDistribucionSector,
                                    label:item.descripcion
                                }))}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Distancia Lineal</Form.Label>
                            <Form.Control
                                type='number'
                                value={distanciaLineal}
                                onChange={(e) => setDistanciaLineal(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Distancia Óptica</Form.Label>
                            <Form.Control
                                type='number'
                                value={distanciaOptica}
                                onChange={(e) => setDistanciaOptica(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type='text'
                                value={ubicacion}
                                onChange={(e)=>setUbicacion(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
                    <Button variant="secondary" onClick={() => setShowFormulario(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ListaBotella2Nivel;
