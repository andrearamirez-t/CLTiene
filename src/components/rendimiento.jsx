import React from 'react';

const Rendimiento = () => {
  const datos = [
    { nombre: "Melany Camila Ramirez", llamadas: 422, turnos: 5.6, palabras: 237, efectivas: 21, exito: "4.99%", calidad: 9 },
    { nombre: "Maria de Villadiego", llamadas: 412, turnos: 5.4, palabras: 121, efectivas: 14, exito: "3.41%", calidad: 23 },
    // Agrega el resto...
  ];

  return (
    <div className="rendimiento-view">
      <div className="dark-table-wrapper">
        <table className="dark-table">
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Llamadas</th>
              <th>Turnos Prom.</th>
              <th>Palabras Prom.</th>
              <th>Efectivas</th>
              <th>Éxito %</th>
              <th>Calidad IA</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((a, i) => (
              <tr key={i}>
                <td>{a.nombre}</td>
                <td>{a.llamadas}</td>
                <td>{a.turnos}</td>
                <td>{a.palabras}</td>
                <td>{a.efectivas}</td>
                <td>{a.exito}</td>
                <td className="calidad-cell"><span className="badge-calidad">{a.calidad}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Aquí irían las gráficas de barras inferiores del asesor */}
    </div>
  );
};

export default Rendimiento;