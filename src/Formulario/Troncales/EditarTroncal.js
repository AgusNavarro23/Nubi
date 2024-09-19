import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";


const EditarTroncal =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Troncales, setTroncales] = useState([]);
    const [Troncal, setTroncal] = useState({ tr_Nombre: "", tr_TipoFibra: "",tr_LongitudLineal:"",tr_LongitudOptica:"" });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const Volver =()=>{
        navigate("/ListaTroncal")
    }
    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('https://localhost:7097/api/ControladorDatos/Troncales')
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
    const GuardarCambios = async (e)=>{
        e.preventDefault();
        try {
            await axios.post("https://localhost:7097/api/ControladorDatos/EditarTroncal", Troncal);
            setAlert({ message: "Troncal actualizado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        } catch (error) {
            setAlert({ message: error.response?.data || "Error al actualizar el Troncal", type: "danger" });
    }
}
    return(
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar Troncal de Fibra</h2>
                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                        </div>
                    )}
                    <form onSubmit={GuardarCambios}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="tr_Nombre"
                                value={Troncal.tr_Nombre}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Buffer"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="tr_Nombre">Nombre de Troncal</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="tr_TipoFibra"
                                value={Troncal.tr_TipoFibra}
                                onChange={handleChange}
                                placeholder="Ingrese Tipo de Fibra"
                                style={{ maxWidth: '40vw' }}
                                required
                            />
                            <label htmlFor="tr_TipoFibra">Tipo de Fibra</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="tr_LongitudLineal"
                                value={Troncal.tr_LongitudLineal}
                                onChange={handleChange}
                                placeholder="Ingrese Longitud Lineal"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="TipoFibra">Longitud Lineal</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="tr_LongitudOptica"
                                value={Troncal.tr_LongitudOptica}
                                onChange={handleChange}
                                placeholder="Longitud Óptica"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="TipoFibra">Longitud Óptica</label>
                        </div>
                        <footer>
                            <button className="Btn-ODF" style={{ marginRight: '5%' }} type="submit">Guardar Cambios</button>
                            <button className="Btn-ODF" onClick={Volver}>Cancelar</button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>    )
}
export default EditarTroncal