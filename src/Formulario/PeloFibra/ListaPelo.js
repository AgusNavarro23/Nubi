import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaPelo = () => {
    const [Pelos, setPelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedPelos, setPaginatedPelos] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [PeloSel, setPeloSel] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5242/api/MantenimientosControlador/PeloFibra')
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

    const CargarPelo = () => {
        navigate("/CrearPelo");
    }

    const BorrarClick = () => {
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        // Implementa la lógica para borrar el elemento seleccionado
    }

    const VerClick = (ID) => {
        const peloseleccionado = Pelos.find(pelo => pelo.ïdPelo === ID);
        setPeloSel(peloseleccionado);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Pelos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pelos');
        XLSX.writeFile(wb, 'Pelos.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Pelos de Fibra</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarPelo}>Cargar Pelo</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
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
                                    <tr key={pelo.ïdPelo}>
                                        <td>{pelo.ïdPelo}</td>
                                        <td>{pelo.colorBuffer}</td>
                                        <td>{pelo.colorPelo}</td>
                                        <td style={{ padding: '10px' }}>
                                            <Link to={`/EditarPelo/${pelo.ïdPelo}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={BorrarClick} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(pelo.ïdPelo)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
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

            {/* Modal de Observación */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {PeloSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">Color del Buffer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={PeloSel.colorBuffer || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Color del Pelo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={PeloSel.colorPelo || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">ID Troncal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={PeloSel.troncal || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del Pelo de Fibra.</p>
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

export default ListaPelo;
