import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal,Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Importa la biblioteca XLSX

const ListaODF = () => {
    const [ODFs, setODFs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
    const [ShowModal,setShowModal]=useState(false);
    const [ShowDetalle,setShowDetalle]=useState(false);
    const [ODFSel,setODFSel]=useState("");
    
    
    useEffect(() => {
        // Reemplaza la URL con la de tu API
        axios.get('http://localhost:5242/api/MantenimientosControlador/ODF')
            .then(response => {
                setODFs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los ODFs:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div class="loader-container">
                <div class="loader"></div>
            </div>  
        );
    }
    const CargarODF=()=>{
        navigate("/CrearODF")
    }

    const BorrarClick = ()=>{
        setShowModal(true);
    }
    const BorrarSeleccionado =()=>{

    }
    const VerClick=(ID)=>{
        const odfseleccionado = ODFs.find(odf => odf.idOdf===ID);
        setODFSel(odfseleccionado);
        console.log(ODFSel)
        setShowDetalle(true);

    }
    const DescargarPlanilla=()=>{
        const ws = XLSX.utils.json_to_sheet(ODFs);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb,ws,'ODFS');
        XLSX.writeFile(wb,'ODFs.xlsx');
    }
    return (
        <div>
            <div className="header">
                <h1>Lista de ODFs</h1>
                <div className='Btn-Header'>
                    <button onClick={CargarODF}>Cargar ODF</button>
                    <button onClick={DescargarPlanilla}>Descargar Plantilla</button>
                </div>
            </div>
            <div class="card" style={{marginLeft:'5%',marginTop:'6%'}}>
            <div class="table-responsive" style={{padding:'2%'}}>
                <table id="example" className="table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Puertos</th>
                            <th>Iconos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ODFs.length > 0 ? (
                            ODFs.map(odf => (
                                <tr key={odf.idOdf}>
                                    <td>{odf.idOdf}</td>
                                    <td>{odf.nombre}</td>
                                    <td>{odf.puertos}</td>
                                    <td style={{padding:'10px'}}>
                                        <Link to={`/EditarODF/${odf.idOdf}`}><i className="bi bi-pencil-square" style={{padding:'5px', color:'#E58A92'}}></i></Link>
                                        <i onClick={BorrarClick} className="bi bi-trash" style={{padding:'5px',color:'#E58A92'}}></i>
                                        <i onClick={() => VerClick(odf.idOdf)} className="bi bi-eye" style={{padding:'5px',color:'#E58A92'}}></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay ODFs disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Puertos</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            </div>
                        {/* Modal de confirmación */}
            <Modal show={ShowModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>  
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este ODF?
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
            <Modal show = {ShowDetalle} onHide={()=>setShowDetalle(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {ODFSel ? (
                        <>
                    <div className="form-group">
                        <label className="form-label">Nombre de ODF</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ODFSel.nombre || ''} 
                            readOnly 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Puertos de ODF</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ODFSel.puertos || ''} 
                            readOnly 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Marca de ODF</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ODFSel.marca || ''} 
                            readOnly 
                        />
                    </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del ODF.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="info" onClick={() => setShowDetalle(false)}>
                            Volver
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaODF;
