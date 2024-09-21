import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal,Button,Pagination,ModalTitle,Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ListaODF = () => {
    const [ODFs, setODFs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ShowModal,setShowModal]=useState(false);
    const [ShowDetalle,setShowDetalle]=useState(false);
    const [ODFSel,setODFSel]=useState("");
    const [ODFBorrar,setODFBorrar]=useState("");
    const [showFormulario,setShowFormulario]=useState(false);
    
    //Variables para la carga de datos
    const [nombreODF,setNombreODF] = useState("")
    const [puertosODF,setPuertosODF] = useState("")
    
    const CargarOdfs=()=>{
        axios.get('https://localhost:7097/api/ControladorDatos/ODFs')
        .then(response => {
            setODFs(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Hubo un error al obtener los ODFs:', error);
            setLoading(false);
        });
    }

    useEffect(() => {
        CargarOdfs();
    }, []);

    if (loading) {
        return (
            <div class="loader-container">
                <div class="loader"></div>
            </div>  
        );
    }
    const BorrarClick = (ID)=>{
        setODFBorrar(ID)
        setShowModal(true);
    }
    const BorrarSeleccionado =()=>{
        if (ODFBorrar===null) return;
        Swal.fire({
            title: 'Cargando...',
            text: 'Guardando el mantenimiento...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        axios.delete(`https://localhost:7097/api/ControladorDatos/BorrarODF/${ODFBorrar}`)
        .then(response=>{
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El ODF ha sido eliminado exitosamente.',
                confirmButtonText: 'OK'
            }).then(() => {
                setShowModal(false);
                CargarOdfs();
            });
        })
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el ODF.',
                confirmButtonText: 'OK'
            });
        })
    }
    const VerClick=(ID)=>{
        const odfseleccionado = ODFs.find(odf => odf.idODF===ID);
        setODFSel(odfseleccionado);
        console.log(ODFSel)
        setShowDetalle(true);
    }
    const GuardarODF=()=>{
        const ODF ={
            odf_Nombre:nombreODF,
            odf_Puertos:puertosODF,
        }
        if (!nombreODF || !puertosODF) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son requeridos.',
                confirmButtonText: 'OK'
            });
            return; // Salir si hay campos faltantes
        }
        else{
            Swal.fire({
                title: 'Cargando...',
                text: 'Guardando el mantenimiento...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            axios.post('https://localhost:7097/api/ControladorDatos/CrearODF', ODF, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El ODF ha sido guardado correctamente.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setShowFormulario(false);
                    CargarOdfs();
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
        }
    }
    return (
        <div>
            <div className="header">
                <h1>Lista de ODFs</h1>
                <div className='Btn-Header'>
                    <Button onClick={()=>setShowFormulario(true)} className='btn-Crear'>Cargar ODF</Button>
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
                                <tr key={odf.idODF}>
                                    <td>{odf.idODF}</td>
                                    <td>{odf.odf_Nombre}</td>
                                    <td>{odf.odf_Puertos}</td>
                                    <td style={{padding:'10px'}}>
                                        <i onClick={()=> BorrarClick(odf.idODF)} className="bi bi-trash" style={{padding:'5px',color:'#E58A92'}}></i>
                                        <i onClick={() => VerClick(odf.idODF)} className="bi bi-eye" style={{padding:'5px',color:'#E58A92'}}></i>
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
                            value={ODFSel.odf_Nombre || ''} 
                            readOnly 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Puertos de ODF</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ODFSel.odf_Puertos || ''} 
                            readOnly 
                        />
                    </div>
                        </>
                    ) : (
                        <p>No se encontraron detalles del ODF.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => setShowDetalle(false)}>
                            Volver
                        </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFormulario} onHide={()=>setShowFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cargar ODF</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>Nombre de ODF</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={nombreODF}
                                    onChange={(e)=>setNombreODF(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Cantidad de Puertos</Form.Label>
                                <Form.Select
                                    value={puertosODF}
                                    onChange={(e)=>setPuertosODF(e.target.value)}
                                >
                                    <option>Selecciona la cantidad de puertos</option>
                                    <option>12</option>
                                    <option>24</option>
                                    <option>48</option>
                                    <option>96</option>
                                    <option>144</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                        <Modal.Footer>
                            <Button variant="primary" onClick={GuardarODF}>
                                Guardar
                            </Button>
                            <Button variant='secondary' onClick={()=>setShowFormulario(false)}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListaODF;
