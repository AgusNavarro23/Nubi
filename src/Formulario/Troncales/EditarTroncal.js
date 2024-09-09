import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarTroncal =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Troncales, setTroncales] = useState([]);
    const [Troncal, setTroncal] = useState({ nombre: "", tipoFibra: "" });
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaTroncal")
    }
    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('http://localhost:5242/api/MantenimientosControlador/Troncales')
            .then(response => {
                setTroncales(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const trencontrado = response.data.find(troncal => troncal.idTroncal === parseInt(id));
                if (trencontrado) {
                    setTroncal(trencontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Troncales:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setTroncal({
            ...Troncal,
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
                    <h2 style={{ marginBottom: '3%' }}>Editar Troncal de Fibra</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                value={Troncal.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Buffer"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="nombre">Nombre de Troncal</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="tipoFibra"
                                value={Troncal.tipoFibra}
                                onChange={handleChange}
                                placeholder="Ingrese Tipo de Fibra"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="tipoFibra">Tipo de Fibra</label>
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
export default EditarTroncal