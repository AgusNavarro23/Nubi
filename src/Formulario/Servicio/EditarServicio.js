import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarServicio =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Servicios, setServicios] = useState([]);
    const [Ser, setSer] = useState({ idServicio: "",nombreServicio:""});
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const Volver =()=>{
        navigate("/ListaServicio")
    }
    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('http://localhost:5242/api/MantenimientosControlador/Servicios')
            .then(response => {
                setServicios(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const serencontradp = response.data.find(servicio => servicio.idServicio === parseInt(id));
                if (serencontradp) {
                    setSer(serencontradp);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Troncales:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setSer({
            ...Ser,
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
                    <h2 style={{ marginBottom: '3%' }}>Editar Servicio</h2>
                    <form>
                    <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="idServicio"
                                value={Ser.idServicio}
                                onChange={handleChange}
                                placeholder="Ingrese ID de Servicio"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="idServicio">ID de Servicio</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nombreServicio"
                                value={Ser.nombreServicio}
                                onChange={handleChange}
                                placeholder="Ingrese Nombre de Servicio"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="nombreServicio">Nombre de Servicio</label>
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
export default EditarServicio