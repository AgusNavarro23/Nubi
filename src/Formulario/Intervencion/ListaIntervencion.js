import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaIntervencion =()=>{
    const [pelos,setPelos]=useState([]); //Variable para cargar los Pelos
    const [botellas,setBotellas]=useState([]); //Variable para cargar las Botellas
    const [troncales,setTroncales]=useState([]); //Variable para cargar los Troncales
    const [intervenciones,setIntervenciones]=useState([]); //Variable para cargar las Intervenciones
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [ShowModal, setShowModal] = useState(false);//Variable para el modal de Eliminar
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Detalle
    const [detalleIntervencion,setDetalleIntervencion] = useState({})
    const [showFormulario,setShowFormulario]=useState(false);//Variable para el modal de Formulario
    const [IntBorrar,setIntBorar]=useState("");

    //Variables para guardar Intervención
    const [bufferEntrada,setBufferEntrada]=useState("");
    const [colorEntrada,setColorEntrada]=useState("");
    const [bufferSalida,setBufferSalida]=useState("");
    const [colorSalida,setColorSalida]=useState("");
    const [pelo,setPelo]=useState("");
    const [botella,setBotella]=useState("");
    const [troncal_Entrada,setTroncal_Entrada]=useState("");
    const [troncal_Salida,setTroncal_Salida]=useState("");

    const CargarDatos =()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/Intervenciones')
        .then(response => {
            const data = response.data;
            setIntervenciones(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las Intervenciones:', error);
            setLoading(false);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/Troncales')
        .then(response => {
            const data = response.data;
            setTroncales(data);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Troncales:', error);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas')
        .then(response => {
            const data = response.data;
            setBotellas(data);
        })
        .catch(error => {
            console.error('Hubo un error al obtener las Botellas:', error);
        });
        axios.get('https://localhost:7097/api/ControladorDatos/PelosFibra')
        .then(response => {
            const data = response.data;
            setPelos(data);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los Pelos de Fibra:', error);
        });

    }
    useEffect(() => {
        CargarDatos();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(intervenciones.slice(startIndex, endIndex));
    };
    const LimpiarFormulario=()=>{
        setBufferEntrada("");
        setColorEntrada("");
        setBufferSalida("");
        setColorSalida("");
        setPelo("");
        setBotella("");
        setTroncal_Entrada("");
        setTroncal_Salida("");
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    const handleDetalles = (intervencion)=>{
        setDetalleIntervencion(intervencion);
        setShowDetalle(true)
    }
    const BorrarClick=(ID)=>{
        setShowModal(true);
        setIntBorar(ID)
    }
    const BorrarSeleccionado = () => {
        if (IntBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarIntervencion/${IntBorrar}`)
        .then(response=>{
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La Intervención ha sido eliminada exitosamente.',
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
                text: 'Hubo un problema al eliminar la Intervención.',
                confirmButtonText: 'OK'
            });
            setShowModal(false)
        })
    }
    const handleGuardar =()=>{
        const intervencion ={
            bufferEntrada,
            colorEntrada,
            bufferSalida,
            colorSalida,
            pelo,
            botella,
            troncal_Entrada,
            troncal_Salida
        }
        console.log(intervencion)
        if (!bufferEntrada || !colorEntrada || !bufferSalida || !colorSalida || !pelo || !botella || !troncal_Entrada || !troncal_Salida){
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
                text: 'Guardando la Intervencion...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post("https://localhost:7097/api/ControladorDatos/CrearIntervencion",intervencion,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response =>{
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'La Intervencion ha sido guardado correctamente.',
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
                <h1>Lista de Intervenciones</h1>
                <div className='Btn-Header'>
                    <Button className='primary' onClick={()=>setShowFormulario(true)}>Cargar Intervencion</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>BufferEntrada</th>
                                <th>ColotEntrada</th>
                                <th>BufferSalida</th>
                                <th>ColorSalida</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(intervencion => (
                                    <tr key={intervencion.idIntervencion}>
                                        <td>{intervencion.idIntervencion}</td>
                                        <td>{intervencion.bufferEntrada}</td>
                                        <td>{intervencion.colorEntrada}</td>
                                        <td>{intervencion.bufferSalida}</td>
                                        <td>{intervencion.colorSalida}</td>
                                        <td style={{ padding: '10px' }}>
                                            <i onClick={()=>BorrarClick(intervencion.idIntervencion)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => handleDetalles(intervencion)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Intervenciones disponibles.</td>
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
                    ¿Estás seguro de que deseas eliminar esta Intervencion?
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
                    <Modal.Title>Detalles de la Intervencion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Descripción: {detalleIntervencion.bufferEntrada}</p>
                    <p>Ubicación: {detalleIntervencion.colorEntrada}</p>
                    <p>Tipo de Botella: {detalleIntervencion.bufferSalida}</p>
                    <p>Distancia Lineal: {detalleIntervencion.colorSalida}</p>
                    <p>Distancia Optica: {detalleIntervencion.pelo}</p>
                    <p>Distancia Optica: {detalleIntervencion.botella}</p>
                    <p>Distancia Optica: {detalleIntervencion.troncal_Entrada}</p>
                    <p>Distancia Optica: {detalleIntervencion.troncal_Salida}</p>
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
                    <Modal.Title>Cargar Intervencion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Buffer de Entrada</Form.Label>
                            <Form.Control
                                type='text'
                                value={bufferEntrada}
                                onChange={(e) => setBufferEntrada(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Color de Entrada</Form.Label>
                            <Form.Control
                                type='text'
                                value={colorEntrada}
                                onChange={(e) => setColorEntrada(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Buffer de Salida</Form.Label>
                            <Form.Control
                                type='text'
                                value={bufferSalida}
                                onChange={(e) => setBufferSalida(e.target.value)}
                            />
                        </Form.Group>
                        {/* Nuevos campos para latitud y longitud */}
                        <Form.Group className='mb-3'>
                            <Form.Label>Color de Salida</Form.Label>
                            <Form.Control
                                type='text'
                                value={colorSalida}
                                onChange={(e) => setColorSalida(e.target.value)}
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
                                <Form.Label>Troncal de Entrada</Form.Label>
                                <Select
                                    value={troncales.find(option => option.value === troncal_Entrada)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setTroncal_Entrada(selectedOption.value)} // Obtén solo el valor
                                    options={troncales.map((item) => ({
                                        value: item.idTroncal,
                                        label: item.tr_Nombre
                                    }))}
                                />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                                <Form.Label>Troncal de Salida</Form.Label>
                                <Select
                                    value={troncales.find(option => option.value === troncal_Salida)} // Esto mantiene el valor seleccionado
                                    onChange={(selectedOption) => setTroncal_Salida(selectedOption.value)} // Obtén solo el valor
                                    options={troncales.map((item) => ({
                                        value: item.idTroncal,
                                        label: item.tr_Nombre
                                    }))}
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
export default ListaIntervencion;