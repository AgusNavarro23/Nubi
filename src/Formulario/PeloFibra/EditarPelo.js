import React, { useState,useEffect } from "react";
import axios from "axios";
import '../Estilos/EstiloForm.css'
import { useNavigate,useParams } from "react-router-dom";

const EditarPelo =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [Pelos, setPelos] = useState([]);
    const [Pelo, setPelo] = useState({ colorBuffer: "", colorPelo: "" });
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaPelo")
    }

    useEffect(() => {
        // Cargar todos los Pelos
        axios.get('http://localhost:5242/api/MantenimientosControlador/PeloFibra')
            .then(response => {
                setPelos(response.data);
                // Encuentra el Pelo específico basado en el ID de la URL
                const peloEncontrado = response.data.find(pelo => pelo.ïdPelo === parseInt(id));
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

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar Pelo de Fibra</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                value={Pelo.colorBuffer}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Buffer"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="nombre">Color Buffer</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="puertos"
                                value={Pelo.colorPelo}
                                onChange={handleChange}
                                placeholder="Ingrese Color de Pelo"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="puertos">Color Pelo</label>
                        </div>
                        <footer>
                            <button className="Btn-ODF" style={{ marginRight: '5%' }}>Guardar Cambios</button>
                            <button className="Btn-ODF" onClick={Volver}>Cancelar</button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default EditarPelo