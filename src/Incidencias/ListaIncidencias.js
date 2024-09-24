import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Pagination, ModalHeader, ModalTitle, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function ListaIncidencias() {
    const [Mantenimientos, setMantenimientos] = useState([]); //Variable para cargar las Incidencias
    const [clientes, setClientes] = useState([]);//Variable para cargar los Clientes
    const [ptps, setPtps] = useState([]);//Variable para cargar los PTPs
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setPaginatedTr] = useState([]);
    const [ShowDetalle, setShowDetalle] = useState(false);//Variable para el modal de Eliminar
    const [detalleIncidencia, setDetalleIncidencia] = useState({});
    const [showFormulario, setShowFormulario] = useState(false);//Variable para el modal de EncontrarBotella
    const [searchTerm, setSearchTerm] = useState('');
    const [showClientes, setShowClientes] = useState(false);
    const [showPtps, setShowPtps] = useState(false);
    const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
    const [searchClientTerm, setSearchClientTerm] = useState('');
    const [searchPtpTerm, setSearchPtpTerm] = useState('');
    const [ShowModalFormulario, setShowModalFormulario] = useState(false);//Variable para el modal de Formulario
    const [botellaEncontrada, setBotellaEncontrada] = useState('');
    const [formularioData, setFormularioData] = useState({
        botella:'',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        duracion: 1,
        descripcion:""
    });


    const CargarDatos = () => {
        axios.get('https://localhost:7097/api/ControladorDatos/ListaIncidencias')
            .then(response => {
                const data = response.data;
                setMantenimientos(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
                setPaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                setLoading(false);
            })
            .catch(error => {
                console.error("Error cargando mantenimientos:", error);
                setLoading(false);
            });

        axios.get('https://localhost:7097/api/ControladorDatos/CargarClientes')
            .then(res => {
                setClientes(res.data);
            })
            .catch(error => console.error("Error cargando clientes:", error));

        axios.get('https://localhost:7097/api/ControladorDatos/Ptps')
            .then(res => {
                setPtps(res.data);
            })
            .catch(error => console.error("Error cargando PTPs:", error));
    }

    useEffect(() => {
        CargarDatos();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setPaginatedTr(Mantenimientos.slice(startIndex, endIndex));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredMantenimientos = Mantenimientos.filter(mantenimiento =>
        mantenimiento.idActividad.toString().includes(searchTerm)
    );

    const totalFilteredPages = Math.ceil(filteredMantenimientos.length / itemsPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedTr(filteredMantenimientos.slice(startIndex, endIndex));
    }, [currentPage, searchTerm, Mantenimientos]);

    const handleCheckboxChange = (item) => {
        setItemsSeleccionados(prev => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item);
            } else {
                return [...prev, item];
            }
        });
    };

    const filteredClientes = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchClientTerm.toLowerCase())
    );

    const filteredPtps = ptps.filter(ptp => 
        ptp.nombre.toLowerCase().includes(searchPtpTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    const handleDetalles=(incidencia)=>{
        setDetalleIncidencia(incidencia)
        setShowDetalle(true);
    }

    const handleEncontrar = () => {
        console.log(itemsSeleccionados);
        const url = showPtps
            ? "https://localhost:7097/api/ControladorDatos/EncontrarBotellaPtp"
            : "https://localhost:7097/api/ControladorDatos/EncontrarBotellaGpon";
        axios.post(url, itemsSeleccionados)
            .then(response => {
                const botella = response.data;
                setBotellaEncontrada(botella);

                Swal.fire({
                    title: 'Botella Encontrada',
                    text: `Se ha encontrado la botella: ${botellaEncontrada.primerElementoComun}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Cerrar el modal actual y abrir el formulario de nueva incidencia
                    setShowFormulario(false);
                    abrirFormularioIncidencia();
                });
            })
            .catch(error => {
                console.error("Error al buscar Botella:", error);
            });
    };
    const abrirFormularioIncidencia = () => {
        // Establecer fecha y hora preestablecidas
        const fechaActual = new Date();
        const fecha = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const horaActual = fechaActual.toTimeString().split(' ')[0].slice(0, 5); // Formato HH:MM

        setFormularioData({
            ...formularioData,
            botella:botellaEncontrada.primerElementoComun,
            fecha: fecha,
            horaInicio: horaActual,
            horaFin: calcularHoraFin(horaActual, formularioData.duracion)
        });

        setShowModalFormulario(true);
    };
    const calcularHoraFin = (horaInicio, duracion) => {
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const nuevaHora = new Date();
        nuevaHora.setHours(horas);
        nuevaHora.setMinutes(minutos + duracion * 60);

        return nuevaHora.toTimeString().split(' ')[0].slice(0, 5); // Devuelve en formato HH:MM
    };

    const handleDuracionChange = (e) => {
        const nuevaDuracion = parseInt(e.target.value);
        const nuevaHoraFin = calcularHoraFin(formularioData.horaInicio, nuevaDuracion);
        setFormularioData({
            ...formularioData,
            duracion: nuevaDuracion,
            horaFin: nuevaHoraFin
        });
    };
    
    const handleGuardar = () => {
        console.log(formularioData);
        
        const url = showPtps
            ? "https://localhost:7097/api/ControladorDatos/CrearIncidenciaPtp"
            : "https://localhost:7097/api/ControladorDatos/CrearIncidenciaGpon";
        
        Swal.fire({
            title: 'Cargando...',
            text: 'Guardando la Incidencia...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        axios.post(url, formularioData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La Incidencia ha sido guardada correctamente.',
                confirmButtonText: 'OK'
            }).then(() => {
                setShowFormulario(false);
                CargarDatos();
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar la Incidencia.',
                confirmButtonText: 'OK'
            });
        });
    };
    

    return (
        <div>
            <div className="header">
                <h1>Lista de Incidencias</h1>
                <div className='Btn-Header'>
                    <Button onClick={() => setShowFormulario(true)} className='btn-Crear'>Crear Incidencia</Button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
                />
                <div className="table-responsive table-stripped" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(mantenimiento => (
                                    <tr key={mantenimiento.idActividad}>
                                        <td>{mantenimiento.idActividad}</td>
                                        <td>{mantenimiento.tipo}</td>
                                        <td>{mantenimiento.fecha}</td>
                                        <td>{mantenimiento.horaInicio}</td>
                                        <td>{mantenimiento.horaFin}</td>
                                        <td>
                                            <Button className='primary'>
                                                <i className='bi bi-eye'></i>
                                                <span className='ms-2' onClick={()=>handleDetalles(mantenimiento)}>Detalle</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay Incidencias disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination>
                        {[...Array(totalFilteredPages)].map((_, index) => (
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
                        {/* Modal para Detalles */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Incidencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detalleIncidencia.idActividad}</p>
                    <p><strong>Tipo:</strong> {detalleIncidencia.tipo}</p>
                    <p><strong>Fecha:</strong> {detalleIncidencia.fecha}</p>
                    <p><strong>Hora de Inicio:</strong> {detalleIncidencia.horaInicio}</p>
                    <p><strong>Hora de Fin:</strong> {detalleIncidencia.horaFin}</p>
                    <p><strong>Observaciones:</strong> {detalleIncidencia.descripcion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Crear Incidencia */}
            <Modal show={showFormulario} onHide={() => setShowFormulario(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Crear Incidencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form style={{ display: 'flex', flexDirection: 'row' }}>
                        <Form.Check
                            type="radio"
                            label="Mostrar Clientes"
                            checked={showClientes}
                            onChange={() => { setShowClientes(true); setShowPtps(false); }}
                            style={{ marginRight: '5%' }}
                        />
                        <Form.Check
                            type="radio"
                            label="Mostrar PTPs"
                            checked={showPtps}
                            onChange={() => { setShowClientes(false); setShowPtps(true); }}
                        />
                    </Form>

                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={showClientes ? searchClientTerm : searchPtpTerm}
                        onChange={(e) => {
                            if (showClientes) {
                                setSearchClientTerm(e.target.value);
                            } else {
                                setSearchPtpTerm(e.target.value);
                            }
                        }}
                        style={{ marginTop: '20px', padding: '8px', width: '100%' }}
                    />

                    <div style={{ marginTop: '20px' }}>
                        {showClientes ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>ID Cliente</th>
                                        <th>Nombre</th>
                                        <th>Domicilio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClientes.map(cliente => (
                                        <tr key={cliente.idCliente}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={itemsSeleccionados.includes(cliente.nombre)}
                                                    onChange={() => handleCheckboxChange(cliente.nombre)}
                                                />
                                            </td>
                                            <td>{cliente.idCliente}</td>
                                            <td>{cliente.nombre}</td>
                                            <td>{cliente.domicilio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : showPtps ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>ID PTP</th>
                                        <th>Nombre</th>
                                        <th>Ubicación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPtps.map(ptp => (
                                        <tr key={ptp.idPtp}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={itemsSeleccionados.includes(ptp.nombre)}
                                                    onChange={() => handleCheckboxChange(ptp.nombre)}
                                                />
                                            </td>
                                            <td>{ptp.idPTPs}</td>
                                            <td>{ptp.nombre}</td>
                                            <td>{ptp.ubicacion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : null}
                    </div>

                    <textarea
                        value={itemsSeleccionados.join(', ')}
                        readOnly
                        rows="3"
                        style={{ width: '100%', marginTop: '20px' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFormulario(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleEncontrar}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
                        {/* Modal para el Formulario de Nueva Incidencia */}
                        <Modal show={ShowModalFormulario} onHide={() => setShowModalFormulario(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nueva Incidencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Botella Afectada</Form.Label>
                            <Form.Control type="text" value={botellaEncontrada.primerElementoComun} readOnly />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control type="date" value={formularioData.fecha} readOnly />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Hora Inicio</Form.Label>
                            <Form.Control type="time" value={formularioData.horaInicio} readOnly />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Duración (horas)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formularioData.duracion}
                                onChange={handleDuracionChange}
                                min="1"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Hora Fin</Form.Label>
                            <Form.Control type="time" value={formularioData.horaFin} readOnly />
                        </Form.Group>
                    </Form>
                    <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formularioData.descripcion}
                                onChange={(e) => setFormularioData({ ...formularioData, descripcion: e.target.value })}
                            />
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalFormulario(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleGuardar}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListaIncidencias;
