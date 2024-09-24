import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaNap = () => {
    const [distribuciones,setDistribuciones]=useState([]); //Variable para cargar las Distribuciones
    const [Naps, setNaps] = useState([]); //Variable para cargar las NAPs
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleNAP,setDetalleNAP] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [NAPBorrar, setNAPBorrar]=useState("");

    //Variables para guardar la NAP

    const [codigoNap, setCodigoNAP] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [distanciaOptica, setDistanciaOptica] = useState("");
    const [distribucion, setDistribucion] = useState("");

    const CargarDatos=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Naps')
        .then(response => {
            const data = response.data;
            setNaps(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las Naps:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/Distribuciones')
        .then(response => {
            const data = response.data;
            setDistribuciones(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las Distribuciones:', error);
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
        setpaginatedTr(Naps.slice(startIndex, endIndex));
    };
    const LimpiarFormulario=()=>{
        setCodigoNAP("");
        setUbicacion("");
        setDistanciaOptica("");
        setDistribucion("");
    }
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    const BorrarClick = (ID) => {
        setNAPBorrar(ID);
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (NAPBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarNap/${NAPBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La NAP ha sido eliminada exitosamente.',
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
                text: 'Hubo un problema al eliminar la NAP.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })}
    
    const handleDetalles=(nap)=>{
        setDetalleNAP(nap)
        setShowDetalle(true)
    }
    const handleGuardar=()=>{
        const nap ={
            codigoNap,
            ubicacion,
            distanciaOptica,
            distribucion
        }
        if (!codigoNap || !ubicacion || !distanciaOptica || !distribucion){
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
                text: 'Guardando la NAP...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearNap",nap,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'La NAP ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar la NAP.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Naps</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar NAP</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>IDNap</th>
                                <th>CódigoNAP</th>
                                <th>Ubicación</th>
                                <th>DistanciaOptica</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(nap => (
                                    <tr key={nap.idNAP}>
                                        <td>{nap.idNAP}</td>
                                        <td>{nap.codigoNap}</td>
                                        <td>{nap.ubicacion}</td>
                                        <td>{nap.distanciaOptica}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(nap.idNAP)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(nap)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Naps disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>IDNap</th>
                                <th>CodigoNAP</th>
                                <th>Ubicación</th>
                                <th>DistanciaOptica</th>
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
                    ¿Estás seguro de que deseas eliminar esta Nap?
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
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Troncal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detalleNAP.idNAP}</p>
                    <p><strong>Descripcion:</strong> {detalleNAP.codigoNap}</p>
                    <p><strong>Ubicacion:</strong> {detalleNAP.ubicacion}</p>
                    <p><strong>Distancia Optica:</strong> {detalleNAP.distanciaOptica}</p>
                    <p><strong>Distribucion:</strong> {detalleNAP.distribucion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar NAP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={codigoNap}
                                    onChange={(e)=>setCodigoNAP(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Ubicacion (Latitud-Longitud)</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={ubicacion}
                                    onChange={(e)=>setUbicacion(e.target.value)}
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
                                <Form.Label>Distribucion</Form.Label>
                                <Select
                                    value={distribuciones.find(option => option.value === distribucion)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setDistribucion(selectedOption.value)} // Obtén solo el valor
                                    options={distribuciones.map((item) => ({
                                        value: item.idDistribucionSector,
                                        label: item.descripcion
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

export default ListaNap;
