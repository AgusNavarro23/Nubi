import React, { useState,useEffect } from "react";
import axios from "axios";
import '../Estilos/EstiloForm.css'
import { useNavigate,useParams } from "react-router-dom";

const EditarODF =()=>{
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const [ODFs, setODFs] = useState([]);
    const [ODF, setODF] = useState({ nombre: "", puertos: "" });
    const [loading, setLoading] = useState(true);
    const Volver =()=>{
        navigate("/ListaODF")
    }

    useEffect(() => {
        // Cargar todos los ODFs
        axios.get('http://localhost:5242/api/MantenimientosControlador/ODF')
            .then(response => {
                setODFs(response.data);
                // Encuentra el ODF específico basado en el ID de la URL
                const odfEncontrado = response.data.find(odf => odf.idOdf === parseInt(id));
                if (odfEncontrado) {
                    setODF(odfEncontrado);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los ODFs:', error);
                setLoading(false);
            });
    }, [id]); 
    const handleChange = (e) => {
        setODF({
            ...ODF,
            [e.target.id]: e.target.value
        });
    };


    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar ODF</h2>
                    <form>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                value={ODF.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese Nombre de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="nombre">Nombre ODF</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="puertos"
                                value={ODF.puertos}
                                onChange={handleChange}
                                placeholder="Ingrese Cantidad de Puertos de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="puertos">Puertos de ODF</label>
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



export default EditarODF