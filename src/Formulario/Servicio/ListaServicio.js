import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaServicio = () => {
    const [Servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [SerSel,setSerSel] = useState("");

    useEffect(() => {
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

    const CargarServicio = () => {
        navigate("/CrearServicio");
    }

    const BorrarClick = () => {
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        // Implementa la lógica para borrar el elemento seleccionado
    }

    const VerClick = (ID) => {
        const servicioencontrado = Servicios.find(servicio => servicio.idServicio === ID);
        setSerSel(servicioencontrado);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Servicios);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Servicios');
        XLSX.writeFile(wb, 'Servicios.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Servicios</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarServicio}>Cargar Servicio</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
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
                                            <Link to={`/EditarServicio/${servicio.idServicio}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={BorrarClick} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(servicio.idServicio)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
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

            {/* Modal de Observación */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {SerSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">ID de Servicio</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SerSel.idServicio || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripcion</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SerSel.nombreServicio || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del Servicio.</p>
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

export default ListaServicio;
