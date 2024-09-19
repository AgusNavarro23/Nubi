import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaNap = () => {
    const [Naps, setNaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Número de items por página
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedTr, setpaginatedTr] = useState([]);
    const navigate = useNavigate();
    const [ShowModal, setShowModal] = useState(false);
    const [ShowDetalle, setShowDetalle] = useState(false);
    const [NapSel,setNapSel] = useState("");
    const [NAPBorrar, setNAPBorrar]=useState("");

    useEffect(() => {
        axios.get('https://localhost:7097/api/ControladorDatos/Naps')
            .then(response => {
                const data = response.data;
                setNaps(data);
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
        setpaginatedTr(Naps.slice(startIndex, endIndex));
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const CargarNap = () => {
        navigate("/CrearNap");
    }

    const BorrarClick = (ID) => {
        setNAPBorrar(ID);
        setShowModal(true);
    }

    const BorrarSeleccionado = () => {
        if (NAPBorrar===null) return;
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarNap/${NAPBorrar}`)
        .then(response =>{
            setNaps(Naps.filter(nap =>nap.idNAP !==NAPBorrar))
            setShowModal(false);
            alert("NAP eliminada exitosamente");
        })
        .catch(error =>{
            console.error("Hubo un error al eliminar la NAP",error);
            setShowModal(false);
            alert("Hubo un error al eliminar la NAP");
        })
    }


    const VerClick = (ID) => {
        const napseleccionada = Naps.find(nap => nap.idNAP === ID);
        setNapSel(napseleccionada);
        setShowDetalle(true);
    }

    const DescargarPlanilla = () => {
        const ws = XLSX.utils.json_to_sheet(Naps);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Naps');
        XLSX.writeFile(wb, 'Naps.xlsx');
    }

    return (
        <div>
            <div className="header">
                <h1>Lista de Naps</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarNap}>Cargar Nap</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
                </div>
            </div>
            <div className="card" style={{ marginLeft: '5%', marginTop: '6%' }}>
                <div className="table-responsive" style={{ padding: '2%' }}>
                    <table id="example" className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>IDNap</th>
                                <th>CódigoNAP</th>
                                <th>Ubicación</th>
                                <th>DistanciaOptica</th>
                                <th>Iconos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTr.length > 0 ? (
                                paginatedTr.map(nap => (
                                    <tr key={nap.idNAP}>
                                        <td>{nap.idNAP}</td>
                                        <td>{nap.codigoNap}</td>
                                        <td>{nap.ubicacion}</td>
                                        <td>{nap.distanciaOptica}</td>
                                        <td style={{ padding: '10px' }}>
                                            <Link to={`/EditarNap/${nap.idNAP}`}><i className="bi bi-pencil-square" style={{ padding: '5px', color: '#E58A92' }}></i></Link>
                                            <i onClick={()=>BorrarClick(nap.idNAP)} className="bi bi-trash" style={{ padding: '5px', color: '#E58A92' }}></i>
                                            <i onClick={() => VerClick(nap.idNAP)} className="bi bi-eye" style={{ padding: '5px', color: '#E58A92' }}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay Naps disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>IDNap</th>
                                <th>CodigoNAP</th>
                                <th>Ubicación</th>
                                <th>DistanciaOptica</th>
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
                    ¿Estás seguro de que deseas eliminar esta Nap?
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
                    {NapSel ? (
                        <>
                             <div className="form-group">
                                <label className="form-label">ID de Nap</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={NapSel.idNAP || ''}
                                    readOnly
                                />
                            </div>                       
                            <div className="form-group">
                                <label className="form-label">Código de Nap</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={NapSel.codigoNap || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ubicación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={NapSel.ubicacion || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DistanciaOptica</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={NapSel.distanciaOptica || ''}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles de la NAP.</p>
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

export default ListaNap;
