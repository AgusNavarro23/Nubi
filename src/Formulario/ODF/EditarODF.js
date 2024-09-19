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
    const [alert, setAlert] = useState({ message: "", type: "" });

    const Volver =()=>{
        navigate("/ListaODF")
    }

    useEffect(() => {
        // Cargar todos los ODFs
        axios.get('https://localhost:7097/api/ControladorDatos/ODFs')
            .then(response => {
                setODFs(response.data);
                // Encuentra el ODF específico basado en el ID de la URL
                const odfEncontrado = response.data.find(odf => odf.idODF === parseInt(id));
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

    const GuardarCambios = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7097/api/ControladorDatos/EditarODF", ODF);
            setAlert({ message: "ODF actualizado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);
        } catch (error) {
            setAlert({ message: error.response?.data || "Error al actualizar el ODF", type: "danger" });
    }
};

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Editar ODF</h2>
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
                                id="odf_Nombre"
                                value={ODF.odf_Nombre}
                                onChange={handleChange}
                                placeholder="Ingrese Nombre de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="odf_Nombre">Nombre ODF</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className="form-control"
                                id="odf_Puertos"
                                value={ODF.odf_Puertos}
                                onChange={handleChange} 
                                placeholder="Ingrese Cantidad de Puertos de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                            <label htmlFor="odf_Puertos">Puertos de ODF</label>
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



export default EditarODF