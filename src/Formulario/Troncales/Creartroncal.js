import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";


const CrearTroncal = () =>{
    const [odf, setodf] = useState([]); // Cambiado a arreglo vacío
    const [loading, setLoading] = useState(true);
    const [Tr_nombre, setTr_nombre] = useState("");
    const [Tr_TipoFibra, setTr_TipoFibra] = useState("");
    const [Tr_LongitudLineal, setTr_LongitudLineal] = useState("");
    const [Tr_LongitudOptica, setTr_LongitudOptica] = useState("");
    const [Tr_ODF, setTr_ODF] = useState("");
    const [alert, setAlert] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    
    useEffect(() => {
        // Cargar todos los Troncales
        axios.get('https://localhost:7097/api/ControladorDatos/ODFs')
            .then(response => {
                setodf(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Troncales:', error);
                setLoading(false);
            });
    }, []); 

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
    const Volver =()=>{
        navigate("/ListaTroncal")
    }
    const EnviarTroncal = async (e)=>{
        e.preventDefault();
        try{
            const Troncal ={
                Tr_nombre:Tr_nombre,
                Tr_TipoFibra:Tr_TipoFibra,
                Tr_LongitudLineal:Tr_LongitudLineal,
                Tr_LongitudOptica:Tr_LongitudOptica,
                Tr_ODF:Tr_ODF,
            }
            const response = await axios.post("https://localhost:7097/api/ControladorDatos/CrearTroncal",Troncal)
            setAlert({ message: "Troncal creado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        }catch(error){
            setAlert({ message: error.response?.data || "Error al crear el Troncal", type: "danger" });
        }
    }
    return(
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar Troncal</h2>
                    
                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    )}

                    <form onSubmit={EnviarTroncal}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="Tr_nombre"
                                placeholder="Ingrese Nombre de Troncal"
                                value={Tr_nombre}
                                onChange={(e) => setTr_nombre(e.target.value)}
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="Tr_nombre">Nombre Troncal</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="Tr_TipoFibra"
                                placeholder="Ingrese Tipo de Fibra"
                                value={Tr_TipoFibra}
                                onChange={(e) => setTr_TipoFibra(e.target.value)}
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="Tr_TipoFibra">Tipo de Fibra</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="Tr_LongitudLineal"
                                placeholder="Ingrese Longitud Lineal"
                                value={Tr_LongitudLineal}
                                onChange={(e) => setTr_LongitudLineal(e.target.value)}
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="Tr_LongitudLineal">Longitud Lineal</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="Tr_LongitudOptica"
                                placeholder="Ingrese Longitud Óptica"
                                value={Tr_LongitudOptica}
                                onChange={(e) => setTr_LongitudOptica(e.target.value)}
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="Tr_LongitudOptica">Longitud Óptica</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select
                                className="form-select"
                                aria-label="Seleccionar ODF"
                                value={Tr_ODF}
                                onChange={(e) => setTr_ODF(e.target.value)}
                            >
                                <option value="">Seleccionar ODF</option>
                                {odf.map(item => (
                                    <option key={item.idODF} value={item.idODF}>
                                        {item.odf_Nombre}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="Tr_ODF">ODF</label>
                        </div>

                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar Troncal
                            </Button>
                            <Button className="Btn-ODF" type="button" onClick={Volver}>
                                Cancelar
                            </Button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CrearTroncal