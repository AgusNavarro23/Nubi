import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrearPelo = () => {
    const [troncal, setTroncal] = useState([]); // Cambiado a arreglo vacío
    const [loading, setLoading] = useState(true); // Corrección de uso de useState
    const navigate = useNavigate();
    useEffect(() => {
        // Cargar todos los Troncales
        axios.get('http://localhost:5242/api/MantenimientosControlador/Troncales')
            .then(response => {
                setTroncal(response.data);
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
        navigate("/ListaPelo")
    }
    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar Pelo</h2>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput1" placeholder="Ingrese Color Buffer" style={{ maxWidth: '40vw' }} />
                        <label htmlFor="floatingInput1">Color Buffer</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput2" placeholder="Ingrese Color Pelo" style={{ maxWidth: '40vw' }} />
                        <label htmlFor="floatingInput2">Color Pelo</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select className="form-select" aria-label="Default select example">
                            <option value="">Seleccionar Troncal</option>
                            {troncal.map(item => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                        <label htmlFor="floatingInput3">Troncal</label>
                    </div>
                    <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar ODF
                            </Button>
                            <Button className="Btn-ODF" onClick={Volver}>
                                Cancelar
                            </Button>
                    </footer>
                </div>
            </div>                
        </div>
    );
}

export default CrearPelo;