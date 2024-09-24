import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaPtps =()=>{
    const [pelos,setPelos]=useState([]); //Variable para cargar los Pelos de Fibra
    const [servicios, setServicios] = useState([]);//Variable para cargar los Servicios
    const [botellas, setBotellas] = useState([]);//Variable para cargar las Botellas
    const [ptps,setPtps]=useState([]);//Variable para cargar los PTPs
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detallePtp,setDetallePtp] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [ptpBorrar,setPtpBorrar]=useState("");

    //Variables para guardar un PTP
    const [nombre, setNombre] = useState("");
    const [distanciaOptica, setDistanciaOptica] = useState("");
    const [distanciaLineal, setDistanciaLineal] = useState("");
    const [ubicacion,setUbicacion]=useState("");
    const [botella,setBotella ] = useState("");
    const [servicio,setServicio]=useState("");
    const [pelo,setPelo]=useState("");

    const CargarDatos =()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Ptps')
        .then(response => {
            const data = response.data;
            setPtps(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/CargarServicios')
        .then(response => {
            const data = response.data;
            setServicios(data);               
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });  
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas')
        .then(response => {
            const data = response.data;
            setBotellas(data);               
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });  
        axios.get('https://localhost:7097/api/ControladorDatos/PelosFibra')
        .then(response => {
            const data = response.data;
            setPelos(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });
    }

    useEffect(() => {
        CargarDatos();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(ptps.slice(startIndex, endIndex));
    };
    const LimpiarFormulario=()=>{
        setNombre("");
        setDistanciaOptica("");
        setDistanciaLineal("");
        setUbicacion("");
        setBotella("");
        setServicio("");
        setPelo("");
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setPtpBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (ptpBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarDistribucion/${ptpBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El PTP ha sido eliminado exitosamente.',
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
                text: 'Hubo un problema al eliminar el PTP.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })}



    const handleDetalles = (ptp)=>{
        setDetallePtp(ptp)
        setShowDetalle(true)
    }

    const handleGuardar=()=>{
        const ptp ={
            nombre,
            distanciaOptica,
            distanciaLineal,
            ubicacion,
            servicio,
            botella,
            pelo
        }
        console.log(ptp)
        if (!nombre || !distanciaOptica || !distanciaLineal || !ubicacion || !servicio || !botella){
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
                text: 'Guardando el PTP...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearPtps",ptp,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El PTP ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el PTP.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Punto a Punto</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar PTP</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>DistanciaOptica</th>
                                <th>DistanciaLineal</th>
                                <th>Ubicacion</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(ptp => (
                                    <tr key={ptp.idPTPs}>
                                        <td>{ptp.idPTPs}</td>
                                        <td>{ptp.nombre}</td>
                                        <td>{ptp.distanciaOptica}</td>
                                        <td>{ptp.distanciaLineal}</td>
                                        <td>{ptp.ubicacion}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(ptp.idPTPs)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(ptp)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Punto a Punto disponibles.</td>
                                </tr>
                            )}
                        </tbody>
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
                    ¿Estás seguro de que deseas eliminar esta Distribucion?
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

            {/* Modal para Detalles */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del PTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detallePtp.idPTPs}</p>
                    <p><strong>Nombre:</strong> {detallePtp.nombre}</p>
                    <p><strong>Distancia Optica:</strong> {detallePtp.distanciaOptica}</p>
                    <p><strong>Distancia Lineal:</strong> {detallePtp.distanciaLineal}</p>
                    <p><strong>Ubicacion:</strong> {detallePtp.ubicacion}</p>
                    <p><strong>Botella:</strong> {detallePtp.botella}</p>
                    <p><strong>Servicio:</strong> {detallePtp.servicio}</p>
                    <p><strong>Pelo:</strong> {detallePtp.pelo}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Formulario */}
            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar Punto a Punto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Nombre de PTP</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={nombre}
                                    onChange={(e)=>setNombre(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Distancia Optica</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={distanciaOptica}
                                    onChange={(e)=>setDistanciaOptica(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Distancia Lineal</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={distanciaLineal}
                                    onChange={(e)=>setDistanciaLineal(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Ubicacion</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={ubicacion}
                                    onChange={(e)=>setUbicacion(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Pelo de Fibra</Form.Label>
                                <Select
                                    value={pelos.find(option => option.value === pelo)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setPelo(selectedOption.value)} // Obtén solo el valor
                                    options={pelos.map((item) => ({
                                        value: item.idPeloFibra,
                                        label: item.colorBuffer + ' - ' + item.colorPelo
                                    }))}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Botella</Form.Label>
                                <Select
                                    value={botellas.find(option => option.value === botella)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setBotella(selectedOption.value)} // Obtén solo el valor
                                    options={botellas.map((item) => ({
                                        value: item.idBotella,
                                        label: item.descripcion
                                    }))}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Servicio</Form.Label>
                                <Select
                                    value={servicios.find(option => option.value === servicio)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setServicio(selectedOption.value)} // Obtén solo el valor
                                    options={servicios.map((item) => ({
                                        value: item.idServicio,
                                        label: item.nombreServicio
                                    }))}
                                />
                        </Form.Group>
                    </Form>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
                        <Button variant="secondary" onClick={()=>setShowFormulario(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default ListaPtps;