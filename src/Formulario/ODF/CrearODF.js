import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import Papa from 'papaparse';
import '../Estilos/EstiloForm.css';

const CrearODF = () => {
    const navigate = useNavigate();
    const [archivo, setArchivo] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const Volver = () => {
        navigate("/ListaODF");
    };

    const manejarArchivo = (event) => {
        const file = event.target.files[0];
        setArchivo(file);

        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    // Verificar la estructura de los datos
                    console.log('Datos CSV:', results.data);
                    
                    // Asegurarse de que los datos sean una matriz de objetos
                    setCsvData(results.data);
                    setShowModal(true);
                },
                header: true,
                skipEmptyLines: true
            });
        }
    };

    const manejarEnvio = (event) => {
        event.preventDefault();
        if (archivo) {
            // Manejar la carga del archivo aquí
            console.log('Archivo seleccionado:', archivo);
        } else {
            console.log('No se ha seleccionado ningún archivo');
        }
    };

    const renderTable = () => {
        if (csvData.length === 0) return null;

        // Extraer encabezados y filas
        const headers = Object.keys(csvData[0]);
        const rows = csvData;

        return (
            <table className="table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header, i) => (
                                <td key={i}>{row[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body" style={{ minWidth: '40vw', minHeight: '60vh', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: '3%' }}>Cargar ODF</h2>
                    <Form onSubmit={manejarEnvio}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre ODF</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese Nombre de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Puertos de ODF</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese Cantidad de Puertos de ODF"
                                style={{ maxWidth: '40vw' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Selecciona un archivo</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv"
                                onChange={manejarArchivo}
                                style={{ maxWidth: '40vw' }}
                            />
                        </Form.Group>
                        <footer>
                            <Button className="Btn-ODF" type="submit" style={{ marginRight: '5%' }}>
                                Registrar ODF
                            </Button>
                            <Button className="Btn-ODF" onClick={Volver}>
                                Cancelar
                            </Button>
                        </footer>
                    </Form>
                </div>
            </div>

            {/* Modal para mostrar la tabla */}
            <Modal show={showModal} onHide={() => setShowModal(false)} className='modal-custom'>
                <Modal.Header closeButton>
                    <Modal.Title>Datos del CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderTable()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrearODF;