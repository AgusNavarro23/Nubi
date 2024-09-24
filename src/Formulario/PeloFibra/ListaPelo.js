import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';

import Swal from 'sweetalert2';

const ListaPelo = () => {
    const [troncales,setTroncales]=useState([]); //Variable para cargar los Troncales
    const [Pelos, setPelos] = useState([]);//Variable para cargar los Pelos de Fibra
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedPelos, setPaginatedPelos] = useState([]);


    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detallePelo,setDetallePelo] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [PeloBorrar, setPeloBorrar]=useState("");
 

    //Variables para guardar Pelo de Fibra
    const [colorBuffer,setColorBuffer]=useState("");
    const [colorPelo,setColorPelo]=useState("");
    const [troncal,setTroncal]=useState("");

    const CargarDatos=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/PelosFibra')
        .then(response => {
            const data = response.data;
            setPelos(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setPaginatedPelos(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });
        axios.get("https://localhost:7097/api/ControladorDatos/Troncales")
        .then(response => {
            setTroncales(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error al cargar los Troncales:", error);
            setLoading(false);
        });

    }

    useEffect(() => {
        CargarDatos()
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setPaginatedPelos(Pelos.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setPeloBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (PeloBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarPelo/${PeloBorrar}`)
        .then(response=>{
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El Pelo de Fibra ha sido eliminado exitosamente.',
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
                text: 'Hubo un problema al eliminar el Pelo de Fibra.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })        
    }
    const handleDetalles = (pelo)=>{
        setDetallePelo(pelo);
        setShowDetalle(true)
    }
    const LimpiarFormulario = ()=>{
        setColorBuffer("");
        setColorPelo("");
        setTroncal("");
    }
    const handleGuardar = () =>{
        const pelo = {
            colorBuffer,
            colorPelo,
            troncal
        }
        if (!colorBuffer || !colorPelo || !troncal){
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
                text: 'Guardando el Pelo de Fibra...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearPelo",pelo,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El Pelo de Fibra ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el Pelo de Fibra.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Pelos de Fibra</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Pelo de Fibra</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>ColorBuffer</th>
                                <th>ColorPelo</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPelos.length > 0 ? (
                                paginatedPelos.map(pelo => (
                                    <tr key={pelo.idPeloFibra}>
                                        <td>{pelo.idPeloFibra}</td>
                                        <td>{pelo.colorBuffer}</td>
                                        <td>{pelo.colorPelo}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(pelo.idPeloFibra)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(pelo)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Pelos de Fibra disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>ColorBuffer</th>
                                <th>ColorPelo</th>
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
                    ¿Estás seguro de que deseas eliminar este Pelo de Fibra?
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
                    <Modal.Title>Detalles del Pelo de Fibra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detallePelo.idPeloFibra}</p>
                    <p><strong>Color Buffer:</strong> {detallePelo.colorBuffer}</p>
                    <p><strong>Color Pelo:</strong> {detallePelo.colorPelo}</p>
                    <p><strong>Troncal:</strong> {detallePelo.troncal}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar Pelo de Fibra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Color del Buffer</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={colorBuffer}
                                    onChange={(e)=>setColorBuffer(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Color del Pelo</Form.Label>
                                <Form.Control 
                                    type='text'
                                    value={colorPelo}
                                    onChange={(e)=>setColorPelo(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Troncal</Form.Label>
                                <Select
                                    value={troncales.find(option => option.value === troncal)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setTroncal(selectedOption.value)} // Obtén solo el valor
                                    options={troncales.map((item) => ({
                                        value: item.idTroncal,
                                        label: item.tr_Nombre
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

export default ListaPelo;
