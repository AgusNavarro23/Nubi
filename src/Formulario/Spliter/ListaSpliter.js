import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaSpliter = () => {
    const [Spliters, setSpliters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [SpSel,setSpSel] = useState("");

    useEffect(() => {
        axios.get('https://localhost:7097/api/ControladorDatos/Spliters')
            .then(response => {
                const data = response.data;
                setSpliters(data);
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
        setpaginatedTr(Spliters.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const CargarSpliter = () => {
        navigate("/CrearSpliter");
    }

    const BorrarClick = () => {
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        // Implementa la lógica para borrar el elemento seleccionado
    }

    const VerClick = (ID) => {
        const spliterseleccionado = Spliters.find(spliter => spliter.idSpliter === ID);
        setSpSel(spliterseleccionado);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Spliters);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Spliters');
        XLSX.writeFile(wb, 'Spliters.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Spliters</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarSpliter}>Cargar Spliter</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
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
                                            <Link to={`/EditarSpliter/${spliter.idSpliter}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={BorrarClick} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(spliter.idSpliter)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
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

            {/* Modal de Observación */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {SpSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">ID de Spliter</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={SpSel.idSpliter || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sector</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={SpSel.sector || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Casette</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SpSel.casette || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del Spliter.</p>
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

export default ListaSpliter;
