import React from 'react';

const ResumenEjecutivo = () => {
  const resultados = [
    { nombre: "Contactado", valor: "1.322 (40.1%)", ancho: "90%" },
    { nombre: "Sin Contacto", valor: "753 (22.8%)", ancho: "60%" },
    { nombre: "Sin Clasificar", valor: "624 (18.9%)", ancho: "50%" },
    { nombre: "Buzón de Voz", valor: "205 (6.2%)", ancho: "25%" },
    { nombre: "Rechazado", valor: "168 (5.1%)", ancho: "20%" },
    { nombre: "Venta", valor: "62 (1.9%)", ancho: "10%" },
  ];

  return (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-title">Distribución de Resultados</div>
        {resultados.map((r, i) => (
          <div className="h-chart-row" key={i}>
            <div className="h-label">{r.nombre}</div>
            <div className="h-bar-bg">
              <div className="h-bar-fill" style={{ width: r.ancho }}>{r.valor}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Embudo de conversión</div>
        {/* Aquí puedes mover el código del embudo que tenías en App.jsx */}
      </div>
    </div>
  );
};

export default ResumenEjecutivo;