import React, { useState,useEffect } from "react";
import axios from "axios";
import '../Estilos/EstiloForm.css'
import { useNavigate,useParams } from "react-router-dom";

const EditarPelo =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Pelos, setPelos] = useState([]);
    const [Pelo, setPelo] = useState({ colorBuffer: "", colorPelo: "",troncal:"" });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const Volver =()=>{
        navigate("/ListaPelo")
    }

    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('https://localhost:7097/api/ControladorDatos/PelosFibra')
            .then(response => {
                setPelos(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const peloEncontrado = response.data.find(pelo => pelo.idPeloFibra === parseInt(id));
                if (peloEncontrado) {
                    setPelo(peloEncontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los Pelos:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setPelo({
            ...Pelo,
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

    const GuardarCambios=async(e)=>{
        e.preventDefault();
        try {
            await axios.post("https://localhost:7097/api/ControladorDatos/EditarPelo", Pelo);
            setAlert({ message: "Pelo de Fibra actualizado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        } catch (error) {
            setAlert({ message: error.response?.data || "Error al actualizar el Pelo de Fibra", type: "danger" });
    }
    }

    return (
        <div >
            <div className="header">

            </div>
            <div className="card" style={{marginLeft:'5%'}}>
            {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                        </div>
                    )}
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar Pelo de Fibra</h2>
                    <form onSubmit={GuardarCambios}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="colorBuffer"
                                value={Pelo.colorBuffer}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Buffer"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="colorBuffer">Color Buffer</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="colorPelo"
                                value={Pelo.colorPelo}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Pelo"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="colorPelo">Color Pelo</label>
                        </div>
                        <footer>
                            <button className="Btn-ODF" style={{ marginRight: '5%' }} type="submit">Guardar Cambios</button>
                            <button className="Btn-ODF" onClick={Volver}>Cancelar</button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default EditarPelo