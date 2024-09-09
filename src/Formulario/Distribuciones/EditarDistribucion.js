import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarDistribucion =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Distribuciones, setDistribuciones] = useState([]);
    const [Ds, setDs] = useState({ descripcion:"",botella:"",sector:""});
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaDistribucion")
    }
    useEffect(() => {
        // Cargar todos los Spliters
        axios.get('http://localhost:5242/api/MantenimientosControlador/Distribuciones')
            .then(response => {
                setDistribuciones(response.data);
                // Encuentra el spliter específico basado en el ID de la URL
                const Dsencontrado = response.data.find(distribucion => distribucion.descripcion === id);
                if (Dsencontrado) {
                    setDs(Dsencontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar las Distribuciones:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setDs({
            ...Ds,
            [e.target.id]: e.target.value
        });
    };


 
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    return(
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar Distribucion</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="descripcion"
                                value={Ds.descripcion}
                                onChange={handleChange}
                                placeholder="Ingrese Descripcion"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Descripcion de la Distribucion</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="botella"
                                value={Ds.botella}
                                onChange={handleChange}
                                placeholder="Ingrese Botella"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Botella de la Distribucion</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="sector"
                                value={Ds.sector}
                                onChange={handleChange}
                                placeholder="Ingrese Sector"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Sector de la Distribucion</label>
                        </div>

                        <footer>
                            <button className="Btn-ODF" style={{ marginRight: '5%' }}>Guardar Cambios</button>
                            <button className="Btn-ODF" onClick={Volver}>Cancelar</button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>    )
}
export default EditarDistribucion