import React from "react";

const CrearDistribucion = () =>{
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Distribucion</h2>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Descripción</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Distancia Óptica</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Seleccionar Botella</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <label for="floatingInput">Botella</label>
                </div>
                <button className="Btn-ODF">Registrar Distribucion</button>
            </div>
        </div>                
    </div>
    )
}
export default CrearDistribucion