import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarBotella =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Botellas, setBotellas] = useState([]);
    const [Bot, setBot] = useState({ descripcion: ""});
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaBotella")
    }
    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('http://localhost:5242/api/MantenimientosControlador/Botellas')
            .then(response => {
                setBotellas(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const Botencontrado = response.data.find(botella => botella.idBotella === parseInt(id));
                if (Botencontrado) {
                    setBot(Botencontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Troncales:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setBot({
            ...Bot,
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
                    <h2 style={{ marginBottom: '3%' }}>Editar Botella</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="descripcion"
                                value={Bot.descripcion}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Buffer"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Descripción de Botella</label>
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
export default EditarBotella