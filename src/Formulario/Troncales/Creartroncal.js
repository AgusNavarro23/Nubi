import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";


const CrearTroncal = () =>{
    const [odf, setodf] = useState([]); // Cambiado a arreglo vacío
    const [loading, setLoading] = useState(true); // Corrección de uso de useState
    const navigate = useNavigate();
    
    useEffect(() => {
        // Cargar todos los Troncales
        axios.get('http://localhost:5242/api/MantenimientosControlador/ODF')
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
    
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Troncal</h2>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Nombre Troncal</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Longitud Lineal</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput"style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Longitud Óptica</label>
                </div>
                <div class="form-floating mb-3">
                        <select className="form-select" aria-label="Default select example">
                            <option value="">Seleccionar ODF</option>
                            {odf.map(item => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    <label for="floatingInput">ODF</label>
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
    )
}
export default CrearTroncal