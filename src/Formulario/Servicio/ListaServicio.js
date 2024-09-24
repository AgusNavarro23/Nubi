import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaServicio = () => {
    const [Clientes,setClientes]=useState([]); //Variable para cargar los Clientes
    const [NAPs,setNaps]=useState([]);//Variable para cargar las NAPs
    const [Servicios, setServicios] = useState([]);//Variable para cargar los Servicios
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleServicio,setDetalleServicio] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [SerBorrar,setSerBorrar] = useState("");

    //Variables para guardar Servicio
    const [idServicio,setIDServicio]=useState("")
    const [nombreServicio, setNombreServicio] = useState("");
    const [cliente, setCliente] = useState("");
    const [nap,setNAP ] = useState("");

    const CargarDatos=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/CargarServicios')
        .then(response => {
            const data = response.data;
            setServicios(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Servicios:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/CargarClientes')
        .then(response => {
            const data = response.data;
            setClientes(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Clientes:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/CargarNaps')
        .then(response => {
            const data = response.data;
            setNaps(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las NAPs:', error);
            setLoading(false);
        });

    }
    const LimpiarFormulario=()=>{
        setIDServicio("");
        setNombreServicio("");
        setCliente("");
        setNAP("");
    }
    
    useEffect(() => {
        CargarDatos();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(Servicios.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const BorrarClick = (ID) => {
        setSerBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (SerBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarServicio/${SerBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El Servicio ha sido eliminado exitosamente.',
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
                text: 'Hubo un problema al eliminar el Servicio.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })}

    const handleDetalles =(servicio)=>{
        setDetalleServicio(servicio)
        setShowDetalle(true)
    }
    const handleGuardar=()=>{
        const servicio ={
            idServicio,
            nombreServicio,
            cliente:cliente,
            nap:nap.value
        }
        console.log(servicio)
        if (!idServicio || !nombreServicio || !cliente || !nap){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son requeridos.',
                confirmButtonText: 'OK'
            });
            return; // Salir si hay campos faltantes
        }
        else{
            axios.post("https://localhost:7097/api/ControladorDatos/CrearServicio",servicio,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El Servicio ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el Servicio.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Servicios</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Servicio</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>NombreServicio</th>
                                <th>Cliente</th>
                                <th>NAP</th>
                                <th>NAPDerivada</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(servicio => (
                                    <tr key={servicio.idServicio}>
                                        <td>{servicio.idServicio}</td>
                                        <td>{servicio.nombreServicio}</td>
                                        <td>{servicio.cliente}</td>
                                        <td>{servicio.nap}</td>
                                        <td>{servicio.napDerivada}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(servicio.idServicio)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(servicio)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Servicios disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>NombreServicio</th>
                                <th>Cliente</th>
                                <th>NAP</th>
                                <th>NAPDerivada</th>
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
                    ¿Estás seguro de que deseas eliminar este Servicio?
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
                    <Modal.Title>Detalles del Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detalleServicio.nombreServicio}</p>
                    <p><strong>Cliente:</strong> {detalleServicio.descripcion}</p>
                    <p><strong>NAP :</strong> {detalleServicio.nap}</p>
                    <p><strong>NAP Derivada:</strong> {detalleServicio.napDerivada}</p>

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
                    <Modal.Title>Cargar Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>ID de Servicio</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={idServicio}
                                    onChange={(e)=>setIDServicio(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Nombre de Servicio</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={nombreServicio}
                                    onChange={(e)=>setNombreServicio(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>NAP</Form.Label>
                                <Select
                                    value={NAPs.find(option => option.value === nap)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setNAP(selectedOption)} // Obtén solo el valor
                                    options={NAPs.map((item) => ({
                                        value: item.codigoNap,
                                        label: item.codigoNap
                                    }))}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Cliente</Form.Label>
                                <Select
                                    value={Clientes.find(option => option.value === cliente)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setCliente(selectedOption.value)} // Obtén solo el valor
                                    options={Clientes.map((item) => ({
                                        value: item.idCliente,
                                        label: item.nombre
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

export default ListaServicio;
