import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CrearCliente = () =>{
    const [idCliente,setIDCliente]=useState("");
    const [nombre,setNombre]=useState("");
    const [domicilio,setDomicilio]=useState("");
    const [telefono,setTelefono]=useState("");
    const [correo,setCorreo]=useState("");
    const navigate=useNavigate();
    const [alert, setAlert] = useState({ message: "", type: "" });

    const Volver =()=>{
        navigate("/ListaCliente")
    }
    const GuardarCliente = async (e)=>{
        e.preventDefault();
        const Cliente = {
            IDCliente:idCliente,
            Nombre:nombre,
            Telefono:telefono,
            Domicilio:domicilio,
            Correo:correo
        }
        try{
            await axios.post("https://localhost:7097/api/ControladorDatos/CrearCliente",Cliente)
            setAlert({ message: "Cliente creado con éxito", type: "success" });
            setTimeout(() => {
                Volver();
            }, 2500);       
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "Error al crear el Cliente"
            setAlert({message:errorMessage,type:"danger"})
        }
    }
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Cliente</h2>
                {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                        </div>
                    )}
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" onChange={(e)=>setIDCliente(e.target.value)} placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">ID Cliente</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" onChange={(e)=>setNombre(e.target.value)} placeholder="Ingrese Nombre de Cliente" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Nombre Cliente</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" onChange={(e)=>setDomicilio(e.target.value)}  style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Domicilio</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" onChange={(e)=>setTelefono(e.target.value)} style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Telefono</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="mail" className="form-control" id="floatingInput" onChange={(e)=>setCorreo(e.target.value)}  style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Correo</label>
                </div>
                <button className="Btn-ODF" onClick={GuardarCliente} style={{marginRight:'5%'}}>Registrar Cliente</button>
                <button className="Btn-ODF" onClick={Volver}>Cancelar</button>
            </div>
        </div>                
    </div>
    )
}
export default CrearCliente