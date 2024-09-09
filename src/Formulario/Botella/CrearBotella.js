import React from "react";

const CrearBotella = () =>{
    return(
        <div className="container">
        <div className="card">
            <div className="card-body" style={{minWidth:'40vw',minHeight:'60vh',justifyContent:'center'}}>
                <h2 style={{marginBottom:'3%'}}>Cargar Botella</h2>
                <div class="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Ingrese Nombre de ODF" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Código Botella</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Distancia Lineal</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput"style={{maxWidth:'40vw'}}/>
                    <label for="floatingInput">Distancia Óptica</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Seleccionar Tipo</option>
                        <option value="1">BOTELLA TRONCAL</option>
                        <option value="2">CEDO</option>
                        <option value="3">BOTELLA DE DISTRIBUCION</option>
                    </select>
                    <label for="floatingInput">Tipo</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Seleccionar ODF</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <label for="floatingInput">ODF</label>
                </div>
                <button className="Btn-ODF">Registrar Botella</button>
            </div>
        </div>                
    </div>
    )
}
export default CrearBotella