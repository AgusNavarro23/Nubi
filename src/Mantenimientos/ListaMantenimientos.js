import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination, ModalHeader, ModalTitle, Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const ListaMantenimientos = () => {
    const [Mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const [Show, setShow] = useState(false);
    const [ShowDetalles, setShowDetalles] = useState(false);
    const [detallesMantenimiento, setDetallesMantenimiento] = useState({});

    const [tipoElemento, setTipoElemento] = useState('');
    const [opcionesElemento, setOpcionesElemento] = useState([]);
    const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
    const [fechaMantenimiento, setFechaMantenimiento] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para la búsqueda

    useEffect(() => {
        axios.get('https://localhost:7097/api/ControladorDatos/ListaMantenimientos')
            .then(response => {
                const data = response.data;
                setMantenimientos(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
                setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(Mantenimientos.slice(startIndex, endIndex));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar a la primera página
    };

    const filteredMantenimientos = Mantenimientos.filter(mantenimiento =>
        mantenimiento.idActividad.toString().includes(searchTerm) // Filtra por idActividad

    );

    const totalFilteredPages = Math.ceil(filteredMantenimientos.length / itemsPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setpaginatedTr(filteredMantenimientos.slice(startIndex, endIndex));
    }, [currentPage, searchTerm, Mantenimientos]);

    const handleTipoElementoChange = (e) => {
        const tipo = e.target.value;
        setTipoElemento(tipo);
        cargarOpcionesElemento(tipo);
    };

    const cargarOpcionesElemento = (tipo) => {
        let url = '';
        switch (tipo) {
            case 'Botella':
                url = 'https://localhost:7097/api/ControladorDatos/Botellas';
                break;
            case 'Troncal':
                url = 'https://localhost:7097/api/ControladorDatos/Troncales';
                break;
            case 'Nap':
                url = 'https://localhost:7097/api/ControladorDatos/Naps';
                break;
            default:
                setOpcionesElemento([]);
                return;
        }

        axios.get(url)
            .then(response => {
                let opciones = [];
                switch (tipo) {
                    case 'Botella':
                        opciones = response.data.map(item => ({
                            value: item.idBotella,
                            label: item.descripcion
                        }));
                        break;
                    case 'Troncal':
                        opciones = response.data.map(item => ({
                            value: item.idTroncal,
                            label: item.tr_Nombre
                        }));
                        break;
                    case 'Nap':
                        opciones = response.data.map(item => ({
                            value: item.idNAP,
                            label: item.codigoNap
                        }));
                        break;
                    default:
                        opciones = [];
                        break;
                }
                setOpcionesElemento(opciones);
            })
            .catch(error => {
                console.error('Error al cargar las opciones:', error);
                setOpcionesElemento([]);
            });
    };

    const handleGuardar = () => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Guardando el mantenimiento...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const datos = {
            tipoElemento,
            elementoId: elementoSeleccionado ? elementoSeleccionado.value : null,
            fechaMantenimiento: fechaMantenimiento,
            horaInicio: horaInicio, // Usar el objeto para horaInicio
            horaFin: horaFin, // Usar el objeto para horaFin
            descripcion
        };
    
        if (!tipoElemento || !descripcion) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son requeridos.',
                confirmButtonText: 'OK'
            });
            return; // Salir si hay campos faltantes
        }
    
        console.log(datos);
    
        axios.post('https://localhost:7097/api/ControladorDatos/GuardarMantenimiento', datos, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El mantenimiento ha sido guardado correctamente.',
                confirmButtonText: 'OK'
            }).then(() => {
                setShow(false);
                window.location.reload();
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar el mantenimiento.',
                confirmButtonText: 'OK'
            });
            console.error('Error al guardar mantenimiento:', error.response.data.errors); // Mostrar más detalles del error
        });
    };
    const handleDetalles = (mantenimiento) => {
        setDetallesMantenimiento(mantenimiento);
        setShowDetalles(true);
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Mantenimientos</h1>
                <div className='Btn-Header'>
                    <Button onClick={() => setShow(true)} className='btn-Crear'>Crear Mantenimiento</Button>
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
                                            <Button className='primary' onClick={() => handleDetalles(mantenimiento)}>
                                                <i className='bi bi-eye'></i>
                                                <span className='ms-2'>Detalle</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay Mantenimientos disponibles.</td>
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
            <Modal show={ShowDetalles} onHide={() => setShowDetalles(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Mantenimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Id:</strong> {detallesMantenimiento.idActividad}</p>
                    <p><strong>Tipo:</strong> {detallesMantenimiento.tipo}</p>
                    <p><strong>Fecha:</strong> {detallesMantenimiento.fecha}</p>
                    <p><strong>Hora Inicio:</strong> {detallesMantenimiento.horaInicio}</p>
                    <p><strong>Hora Fin:</strong> {detallesMantenimiento.horaFin}</p>
                    <p><strong>Descripción:</strong> {detallesMantenimiento.descripcion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalles(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={Show} onHide={() => setShow(false)} size='lg'>
                <Modal.Header closeButton>
                    <ModalTitle>Cargar Mantenimiento</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tipo Elemento</Form.Label>
                            <Form.Select value={tipoElemento} onChange={handleTipoElementoChange}>
                                <option value="">Selecciona un tipo...</option>
                                <option value="Botella">Botella</option>
                                <option value="Troncal">Troncal</option>
                                <option value="Nap">Nap</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicSelect">
                            <Form.Label>Elemento</Form.Label>
                            <Select
                                value={elementoSeleccionado}
                                onChange={setElementoSeleccionado}
                                options={opcionesElemento}
                                isClearable
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaMantenimiento}
                                onChange={(e) => setFechaMantenimiento(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hora Inicio</Form.Label>
                            <Form.Control
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hora Fin</Form.Label>
                            <Form.Control
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleGuardar}>
                            Guardar
                        </Button>
                        <Button variant='secondary' onClick={()=>setShow(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListaMantenimientos;
