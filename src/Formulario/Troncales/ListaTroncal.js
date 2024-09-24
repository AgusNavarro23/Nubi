import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaTroncal = () => {
    const [odf,setodf]=useState([]); //Variable para cargar los ODFs
    const [Troncales, setTroncales] = useState([]);//Variable para cargar los Troncales
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleTroncal,setDetalleTroncal] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [TrBorrar,setTrBorrar]=useState("");

    //Variables para guardar Troncal

    const [Tr_nombre, setTr_nombre] = useState("");
    const [Tr_TipoFibra, setTr_TipoFibra] = useState("");
    const [Tr_LongitudLineal, setTr_LongitudLineal] = useState("");
    const [Tr_LongitudOptica, setTr_LongitudOptica] = useState("");
    const [Tr_ODF, setTr_ODF] = useState("");


    const CargarDatos =()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Troncales')
        .then(response => {
            const data = response.data;
            setTroncales(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/ODFs')
        .then(response => {
            setodf(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error al cargar los Troncales:', error);
            setLoading(false);
        });
    }
    const LimpiarFormulario=()=>{
        setTr_nombre("");
        setTr_TipoFibra("");
        setTr_LongitudLineal("");
        setTr_LongitudOptica("");
        setTr_ODF("");
    }
    useEffect(() => {
        CargarDatos()
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(Troncales.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    const BorrarClick = (ID) => {
        setTrBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (TrBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarTroncal/${TrBorrar}`)
        .then(response=>{

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El Troncal ha sido eliminado exitosamente.',
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
        })}

    const handleDetalles = (troncal)=>{
        setDetalleTroncal(troncal);
        setShowDetalle(true)
    }
    
    const handleGuardar = () =>{
        
        const troncal = {
            tr_Nombre:Tr_nombre,
            tr_TipoFibra:Tr_TipoFibra,
            tr_LongitudLineal:Tr_LongitudLineal,
            tr_LongitudOptica:Tr_LongitudOptica,
            tr_ODF:Tr_ODF
        };
        if (!Tr_nombre || !Tr_TipoFibra || !Tr_LongitudLineal || !Tr_LongitudOptica || !Tr_ODF) {
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
                text: 'Guardando el Troncal...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearTroncal",troncal,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El Troncal ha sido guardado correctamente.',
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
                    text: 'Hubo un problema al guardar el Troncal.',
                    confirmButtonText: 'OK'
                });
            })
        }
    }
    return (
        <div>
            <div className="header">
                <h1>Lista de Troncales</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Troncal</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>TipoFibra</th>
                                <th>LongitudLineal</th>
                                <th>LongitudOptica</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(troncal => (
                                    <tr key={troncal.idTroncal}>
                                        <td>{troncal.idTroncal}</td>
                                        <td>{troncal.tr_Nombre}</td>
                                        <td>{troncal.tr_TipoFibra}</td>
                                        <td>{troncal.tr_LongitudLineal}</td>
                                        <td>{troncal.tr_LongitudOptica}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(troncal.idTroncal)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(troncal)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Troncales de Fibra disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>TipoFibra</th>
                                <th>LongitudLineal</th>
                                <th>LongitudOptica</th>
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
                    ¿Estás seguro de que deseas eliminar este Troncal de Fibra?
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
                    <p><strong>Id:</strong> {detalleTroncal.idTroncal}</p>
                    <p><strong>Nombre:</strong> {detalleTroncal.tr_Nombre}</p>
                    <p><strong>Tipo de Fibra:</strong> {detalleTroncal.tr_TipoFibra}</p>
                    <p><strong>Longitud Lineal:</strong> {detalleTroncal.tr_LongitudLineal}</p>
                    <p><strong>Longitud Optica:</strong> {detalleTroncal.tr_LongitudOptica}</p>
                    <p><strong>ODF:</strong> {detalleTroncal.tr_ODF}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar Troncal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                                <Form.Label>Nombre de Troncal</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={Tr_nombre}
                                    onChange={(e)=>setTr_nombre(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Tipo de Fibra</Form.Label>
                                <Form.Select onChange={(e)=>setTr_TipoFibra(e.target.value)}>
                                    <option>Seleccione un Tipo de Fibra</option>
                                    <option>12</option>
                                    <option>24</option>
                                    <option>48</option>
                                    <option>96</option>
                                    <option>144</option>
                                </Form.Select>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Longitud Lineal</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={Tr_LongitudLineal}
                                    onChange={(e)=>setTr_LongitudLineal(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Longitud Óptica</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={Tr_LongitudOptica}
                                    onChange={(e)=>setTr_LongitudOptica(e.target.value)}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>ODF</Form.Label>
                                <Select
                                    value={odf.find(option => option.value === Tr_ODF)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setTr_ODF(selectedOption.value)} // Obtén solo el valor
                                    options={odf.map((item) => ({
                                        value: item.idODF,
                                        label: item.odf_Nombre
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

export default ListaTroncal;
