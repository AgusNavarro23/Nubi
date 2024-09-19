import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaCliente = () => {
    const [Clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [CliSel,setCliSel] = useState("");
    const [CliBorrar,setCliBorrar]=useState("");

    useEffect(() => {
        axios.get('https://localhost:7097/api/ControladorDatos/CargarClientes')
            .then(response => {
                const data = response.data;
                setClientes(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
                setpaginatedTr(data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                setLoading(false);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los Pelos de Fibra:', error);
                setLoading(false);
            });
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        setpaginatedTr(Clientes.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const CargarCliente = () => {
        navigate("/CrearCliente");
    }

    const BorrarClick = (ID) => {
        setShowModal(true);
        setCliBorrar(ID)
    }

    const BorrarSeleccionado = () => {
        if (CliBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarCliente/${CliBorrar}`)
        .then(response=>{
            setClientes(Clientes.filter(cliente => cliente.idCliente !== CliBorrar));
            setShowModal(false);
        })
        .catch(error=>{
            console.error("Hubo un Error al eliminar el Cliente",error)
            setShowModal(false)
        })
    }

    const VerClick = (ID) => {
        const clienteseleccionado = Clientes.find(clientes => clientes.idCliente === ID);
        setCliSel(clienteseleccionado);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Clientes);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        XLSX.writeFile(wb, 'Clientes.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Clientes</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarCliente}>Cargar Cliente</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
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
                                            <Link to={`/EditarBotella/${cliente.idCliente}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={()=>BorrarClick(cliente.idCliente)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(cliente.idCliente)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
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

            {/* Modal de Observación */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {CliSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">ID de Cliente</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={ CliSel.idCliente|| ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={CliSel.nombre || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Domicilio</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={CliSel.domicilio || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Telefono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={CliSel.telefono || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Correo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={CliSel.correo || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del cliente.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => setShowDetalle(false)}>
                        Volver
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ListaCliente;
