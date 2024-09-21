import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const MantenimientosProgramados = () => {
  const [date, setDate] = useState(new Date());
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedMantenimientos, setSelectedMantenimientos] = useState([]);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await axios.get('https://localhost:7097/api/ControladorDatos/ListaMantenimientos');
        setMantenimientos(response.data);

        // Obtener mantenimientos para la fecha actual por defecto
        const mantenimientosHoy = getMantenimientosForDate(new Date(), response.data);
        setSelectedMantenimientos(mantenimientosHoy);
      } catch (error) {
        console.error('Error al obtener los mantenimientos:', error);
      }
    };
    fetchMantenimientos();
  }, []);

  const getMantenimientosForDate = (date, mantenimientosList = mantenimientos) => {
    const formattedDate = date.toISOString().split('T')[0];
    return mantenimientosList.filter(m => m.fecha === formattedDate);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedMantenimientos(getMantenimientosForDate(newDate));
  };

  const isDateWithMantenimiento = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return mantenimientos.some(m => m.fecha === formattedDate);
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'85vw'}}>
      <div className="container mt-5" style={{width:'100vw' ,height:'90vh'}}>
        <div className="row">
          {/* Calendario en el lado izquierdo */}
          <div className="col-md-6">
            <h2>Calendario de Mantenimientos</h2>
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileClassName={({ date }) => isDateWithMantenimiento(date) ? 'bg-danger text-white' : null}
            />
          </div>

          {/* Lista de mantenimientos a la derecha */}
          <div className="col-md-6">
            <h4>Mantenimientos para {date.toLocaleDateString()}</h4>
            <ul className="list-group">
              {selectedMantenimientos.length === 0 ? (
                <li className="list-group-item">No hay mantenimientos programados.</li>
              ) : (
                selectedMantenimientos.map((m, index) => (
                  <li key={index} className="list-group-item">
                    <button
                      className="btn btn-link"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}>
                      Mantenimiento N° {m.idActividad}
                    </button>
                    <div className="accordion-collapse collapse" id={`collapse${index}`}>
                      <div className="card card-body">
                        <p><strong>Mantenimiento:</strong> {m.tipo}</p>
                        <p><strong>Fecha:</strong> {m.fecha}</p>
                        <p><strong>Hora de Inicio:</strong> {m.horaInicio}</p>
                        <p><strong>Hora de Fin:</strong> {m.horaFin}</p>
                        <p><strong>Detalles:</strong> {m.descripcion}</p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MantenimientosProgramados;
