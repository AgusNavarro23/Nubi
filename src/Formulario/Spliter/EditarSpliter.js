import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarSpliter =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Spliters, setSpliters] = useState([]);
    const [Spl, setSpl] = useState({ sector:"",casette:""});
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaSpliter")
    }
    useEffect(() => {
        // Cargar todos los Spliters
        axios.get('http://localhost:5242/api/MantenimientosControlador/Spliters')
            .then(response => {
                setSpliters(response.data);
                // Encuentra el spliter específico basado en el ID de la URL
                const Spencontrado = response.data.find(spliter => spliter.idSpliter === parseInt(id));
                if (Spencontrado) {
                    setSpl(Spencontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Spliters:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setSpl({
            ...Spl,
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
        <div >
            <div className="header">

            </div>
            <div className="card" style={{marginLeft:'5%'}}>
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar Spliter</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="sector"
                                value={Spl.sector}
                                onChange={handleChange}
                                placeholder="Ingrese Sector"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Sector del Spliter</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="casette"
                                value={Spl.casette}
                                onChange={handleChange}
                                placeholder="Ingrese Casette"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="descripcion">Casette del Spliter</label>
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
export default EditarSpliter