import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaDistribucion = () => {
    const [spliters, setSpliters] = useState([]); //Variable para cargar los Spliters
    const [Distribuciones, setDistribuciones] = useState([]); //Variable para cargar las Distribuciones
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false); //Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false); //Variable para el modal de Detalle
    const [detalleDistribucion,setDetalleDistribucion] = useState({}) 
    const [showFormulario,setShowFormulario]=useState(false); //Variable para el modal de Formulario
    const [disBorrar,setDisBorrar]=useState("");

    //Variables para guardar Distribucion
    const [descripcion, setDescripcion] = useState("");
    const [distanciaOptica, setDistanciaOptica] = useState("");
    const [spliter,setSpliter ] = useState("");

    const CargarDatos =()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Distribuciones')
        .then(response => {
            const data = response.data;
            setDistribuciones(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las Distribuciones:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/Spliters')
        .then(response => {
            const data = response.data;
            setSpliters(data);               
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Spliters:', error);
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
        setpaginatedTr(Distribuciones.slice(startIndex, endIndex));
    };
    const LimpiarFormulario=()=>{
        setDescripcion("");
        setDistanciaOptica("");
        setSpliter("");
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setDisBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (disBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarDistribucion/${disBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La distribución ha sido eliminada exitosamente.',
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
                text: 'Hubo un problema al eliminar la distribución.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })}



    const handleDetalles = (distribucion)=>{
        setDetalleDistribucion(distribucion)
        setShowDetalle(true)
    }

    const handleGuardar=()=>{
        const distribucion ={
            descripcion,
            spliter
        }
        if (!descripcion || !spliter){
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
                text: 'Guardando el Spliter...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearDistribucion",distribucion,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El Spliter ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el Spliter.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Distribuciones</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Distribucion</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descripcion</th>
                                <th>Spliter</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(distribucion => (
                                    <tr key={distribucion.idDistribucionSector}>
                                        <td>{distribucion.idDistribucionSector}</td>
                                        <td>{distribucion.descripcion}</td>
                                        <td>{distribucion.spliter}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(distribucion.idDistribucionSector)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(distribucion)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Distribuciones disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Spliter</th>
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
                    <Modal.Title>Detalles del Troncal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detalleDistribucion.idDistribucionSector}</p>
                    <p><strong>Nombre:</strong> {detalleDistribucion.descripcion}</p>
                    <p><strong>Spliter:</strong> {detalleDistribucion.spliter}</p>
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
                    <Modal.Title>Cargar Distribucion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Nombre de Distribución</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={descripcion}
                                    onChange={(e)=>setDescripcion(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Spliter</Form.Label>
                                <Select
                                    value={spliters.find(option => option.value === spliter)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setSpliter(selectedOption.value)} // Obtén solo el valor
                                    options={spliters.map((item) => ({
                                        value: item.idSpliter,
                                        label: item.sector
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

export default ListaDistribucion;
