import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaBotella = () => {
    const [Botellas, setBotellas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [BotSel,setBotSel] = useState("");
    const [BotBorrar,setBotBorrar]=useState("");

    useEffect(() => {
        axios.get('https://localhost:7097/api/ControladorDatos/Botellas')
            .then(response => {
                const data = response.data;
                setBotellas(data);
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
        setpaginatedTr(Botellas.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const CargarBotella = () => {
        navigate("/CrearBotella");
    }

    const BorrarClick = (ID) => {
        setShowModal(true);
        setBotBorrar(ID)
    }

    const BorrarSeleccionado = () => {
        if (BotBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarBotella/${BotBorrar}`)
        .then(response=>{
            setBotellas(Botellas.filter(botella => botella.idBotella !== BotBorrar));
            setShowModal(false);
        })
        .catch(error=>{
            console.error("Hubo un Error al eliminar la Botella",error)
            setShowModal(false)
        })
    }

    const VerClick = (ID) => {
        const botellaseleccionada = Botellas.find(botella => botella.idBotella === ID);
        setBotSel(botellaseleccionada);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Botellas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Botellas');
        XLSX.writeFile(wb, 'Botellas.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Botellas</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarBotella}>Cargar Botella</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Descripcion</th>
                                <th>Ubicación</th>
                                <th>Tipo</th>
                                <th>DistanciaOptica</th>
                                <th>DistanciaLineal</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(botella => (
                                    <tr key={botella.idBotella}>
                                        <td>{botella.idBotella}</td>
                                        <td>{botella.descripcion}</td>
                                        <td>{botella.ubicacion}</td>
                                        <td>{botella.tipo}</td>
                                        <td>{botella.distanciaOptica}</td>
                                        <td>{botella.distanciaLineal}</td>
                                        <td style={{ padding: '10px' }}>
                                            <Link to={`/EditarBotella/${botella.idBotella}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={()=>BorrarClick(botella.idBotella)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(botella.idBotella)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Botellas disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Id</th>
                                <th>Descripcion</th>
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
                    ¿Estás seguro de que deseas eliminar esta Botella?
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
                    {BotSel ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">ID de Botella</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.idBotella || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripcion</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.descripcion || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ubicación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.ubicacion || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tipo de Botella</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.tipo || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DistanciaOptica</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.distanciaOptica || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DistanciaLineal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={BotSel.distanciaLineal || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles de la Botella.</p>
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

export default ListaBotella;
