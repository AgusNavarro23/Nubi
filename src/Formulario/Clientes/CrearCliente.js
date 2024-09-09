import React from "react";

const CrearCliente = () =>{
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Cliente</h2>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Nombre Cliente</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Domicilio</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput"style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Telefono</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="mail" className="form-control" id="floatingInput"style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Correo</label>
                </div>
                <button className="Btn-ODF">Registrar Cliente</button>
            </div>
        </div>                
    </div>
    )
}
export default CrearCliente