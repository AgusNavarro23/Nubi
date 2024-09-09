import React from "react";

const CrearServicio = () =>{
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Servicio</h2>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">N° Servicio</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Nombre Servicio</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Seleccionar Cliente</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <label for="floatingInput">Cliente</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Seleccionar NAP</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <label for="floatingInput">NAP</label>
                </div>
                <button className="Btn-ODF">Registrar Servicio</button>
            </div>
        </div>                
    </div>
    )
}
export default CrearServicio