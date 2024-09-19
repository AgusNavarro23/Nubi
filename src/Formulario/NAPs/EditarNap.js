import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarNap =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Naps, setNaps] = useState([]);
    const [Np, setNp] = useState({ codigo: "",pelo:""});
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaNap")
    }
    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('http://localhost:5242/api/MantenimientosControlador/Naps')
            .then(response => {
                setNaps(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const napencontrada = response.data.find(nap => nap.código === id);
                if (napencontrada) {
                    setNp(napencontrada);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Troncales:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setNp({
            ...Np,
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
                    <h2 style={{ marginBottom: '3%' }}>Editar Nap</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="código"
                                value={Np.código}
                                onChange={handleChange}
                                placeholder="Ingrese còdigo de Nap"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="código">Código de Nap</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="pelo"
                                value={Np.pelo}
                                onChange={handleChange}
                                placeholder="Ingrese Ubicación de Nap"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="pelo">Pelo de Nap</label>
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
export default EditarNap