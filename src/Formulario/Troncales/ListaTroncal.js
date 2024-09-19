import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaTroncal = () => {
    const [Troncales, setTroncales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [TronSel,setTronSel] = useState("");
    const [TrBorrar,setTrBorrar]=useState("");


    useEffect(() => {
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

    const CargarTroncal = () => {
        navigate("/CrearTroncal");
    }

    const BorrarClick = (ID) => {
        setTrBorrar(ID)
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (TrBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarTroncal/${TrBorrar}`)
        .then(response=>{
            setTroncales(Troncales.filter(troncal => troncal.idTroncal !== TrBorrar));
            setShowModal(false);
        })
        .catch(error=>{
            console.error("Hubo un Error al eliminar el Troncal",error)
            setShowModal(false)
        })    }

    const VerClick = (ID) => {
        const troncalseleccionado = Troncales.find(troncal => troncal.idTroncal === ID);
        setTronSel(troncalseleccionado);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Troncales);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Troncales');
        XLSX.writeFile(wb, 'Troncales.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Troncales</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarTroncal}>Cargar Troncal</button>
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
                                            <Link to={`/EditarTroncal/${troncal.idTroncal}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={()=>BorrarClick(troncal.idTroncal)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(troncal.idTroncal)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
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

            {/* Modal de Observación */}
            <Modal show={ShowDetalle} onHide={() => setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {TronSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">ID de Troncal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={TronSel.idTroncal || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nombre de Troncal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={TronSel.tr_Nombre || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tipo de Fibra</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={TronSel.tr_TipoFibra || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Longitud Lineal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={TronSel.tr_LongitudLineal || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Longitud Óptica</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={TronSel.tr_LongitudOptica || ''}
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

export default ListaTroncal;
