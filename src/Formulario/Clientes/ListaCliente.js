import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaCliente = () => {
    const [Clientes, setClientes] = useState([]); //Variable para cargar los Clientes
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleCliente,setDetalleCliente] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [CliBorrar,setCliBorrar]=useState("");

    //Variables para cargar Clientes
    const [idCliente, setIDCliente]=useState("");
    const [nombre,setNombre]=useState("");
    const [domicilio,setDomicilio]=useState("");
    const [telefono,setTelefono]=useState("");
    const [correo,setCorreo]=useState("");

    const CargarDatos = ()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/CargarClientes')
        .then(response => {
            const data = response.data;
            setClientes(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Clientes:', error);
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
        setpaginatedTr(Clientes.slice(startIndex, endIndex));
    };

    const LimpiarFormulario=()=>{
        setIDCliente("");
        setNombre("");
        setDomicilio("");
        setTelefono("");
        setCorreo("");
    }
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setShowModal(true);
        setCliBorrar(ID)
    }

    const BorrarSeleccionado = () => {
        if (CliBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarCliente/${CliBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El cliente ha sido eliminado exitosamente.',
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
                text: 'Hubo un problema al eliminar el Cliente.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })}

    const handleDetalles=(cliente)=>{
        setDetalleCliente(cliente)
        setShowDetalle(true)
    }
    const handleGuardar=()=>{
        const cliente ={
            idCliente,
            nombre,
            domicilio,
            telefono,
            correo
        }
        if (!idCliente || !nombre || !domicilio || !telefono || !correo){
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
            axios.post("https://localhost:7097/api/ControladorDatos/CrearCliente",cliente,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El Cliente ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el Cliente.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Clientes</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Cliente</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Domicilio</th>
                                <th>Telefono</th>
                                <th>Correo</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(cliente => (
                                    <tr key={cliente.idCliente}>
                                        <td>{cliente.idCliente}</td>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.domicilio}</td>
                                        <td>{cliente.correo}</td>
                                        <td>{cliente.telefono}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(cliente.idCliente)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(cliente)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Clientes disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Domicilio</th>
                                <th>Telefono</th>
                                <th>Correo</th>
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
                    ¿Estás seguro de que deseas eliminar este Cliente?
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
                    <p><strong>Id Cliente:</strong> {detalleCliente.idCliente}</p>
                    <p><strong>Nombre:</strong> {detalleCliente.nombre}</p>
                    <p><strong>Domicilio:</strong> {detalleCliente.domicilio}</p>
                    <p><strong>Telefono:</strong> {detalleCliente.telefono}</p>
                    <p><strong>Correo:</strong> {detalleCliente.correo}</p>

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
                    <Modal.Title>Cargar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>ID Cliente</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={idCliente}
                                    onChange={(e)=>setIDCliente(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Nombre de Cliente</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={nombre}
                                    onChange={(e)=>setNombre(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Domicilio</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={domicilio}
                                    onChange={(e)=>setDomicilio(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={telefono}
                                    onChange={(e)=>setTelefono(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={correo}
                                    onChange={(e)=>setCorreo(e.target.value)}
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

export default ListaCliente;
