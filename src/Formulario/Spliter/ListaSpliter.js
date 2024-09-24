import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select'

const ListaSpliter = () => {
    const [botellas,setBotellas]=useState([]);//Variable para cargar las Botellas
    const [Spliters, setSpliters] = useState([]);//Variable para cargar los Spliters
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);

    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleSpliter,setDetalleSpliter] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario


    //Variables para guardar Spliter
    const [sector,setSector]=useState("");
    const [casette,setCassette]=useState("");
    const [botella,setBotella]=useState("");


    const CargarDatos=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas')
            .then(response => {
                const data = response.data;
                setBotellas(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Hubo un error al obtener las Botellas:', error);
                setLoading(false);
            });
        axios.get('https://localhost:7097/api/ControladorDatos/Spliters')
        .then(response => {
            const data = response.data;
            setSpliters(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));                
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
        setpaginatedTr(Spliters.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    const LimpiarFormulario=()=>{
        setSector("");
        setCassette("");
        setBotella("");
    }
    const BorrarClick = () => {
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        // Implementa la lógica para borrar el elemento seleccionado
    }
    const handleDetlles=(spliter)=>{
        setDetalleSpliter(spliter)
        setShowDetalle(true);
    }
    const botellaDescripcion = botellas.find(b => b.idBotella === detalleSpliter.botella)?.descripcion || 'No encontrada';

    const handleGuardar=()=>{
        const spliter ={
            sector,
            casette,
            botella
        }
        if (!sector || !casette || !botella){
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
            axios.post("https://localhost:7097/api/ControladorDatos/CrearSpliter",spliter,{
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
                <h1>Lista de Spliters</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Spliter</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Sector</th>
                                <th>Casette</th>
                                <th>Botella</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(spliter => (
                                    <tr key={spliter.idSpliter}>
                                        <td>{spliter.idSpliter}</td>
                                        <td>{spliter.sector}</td>
                                        <td>{spliter.casette}</td>
                                        <td>{spliter.botella}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={BorrarClick} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetlles(spliter)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Spliters disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>Sector</th>
                                <th>Casette</th>
                                <th>Botella</th>
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
                    ¿Estás seguro de que deseas eliminar este Spliter?
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
                    <p><strong>Id:</strong> {detalleSpliter.idSpliter}</p>
                    <p><strong>Sector:</strong> {detalleSpliter.sector}</p>
                    <p><strong>Cassette:</strong> {detalleSpliter.casette}</p>
                    <p><strong>Botella:</strong> {botellaDescripcion}</p> {/* Aquí se muestra la descripción de la botella */}
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar Spliter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Sector</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={sector}
                                    onChange={(e)=>setSector(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Cassette</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={casette}
                                    onChange={(e)=>setCassette(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>ODF</Form.Label>
                                <Select
                                    value={botellas.find(option => option.value === botella)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setBotella(selectedOption.value)} // Obtén solo el valor
                                    options={botellas.map((item) => ({
                                        value: item.idBotella,
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

export default ListaSpliter;
