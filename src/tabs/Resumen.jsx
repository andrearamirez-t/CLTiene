import React from "react";
import ResultadosChart from "../components/ResultadosChart";
import EmbudoChart from "../components/EmbudoChart";
import DuracionChart from "../components/DuracionChart";
import InsightsCard from "../components/InsightsCard"; 

function Resumen() {
  const resultados = [
    { nombre: "Contactado", valor: "1.322 (40.1%)", ancho: "100%" },
    { nombre: "Sin Contacto", valor: "753 (22.8%)", ancho: "57%" },
    { nombre: "Sin Clasificar", valor: "624 (18.9%)", ancho: "47%" },
    { nombre: "Buzón de Voz", valor: "205 (6.2%)", ancho: "15%" },
    { nombre: "Rechazado", valor: "168 (5.1%)", ancho: "12%" },
    { nombre: "Interesado", valor: "83 (2.5%)", ancho: "6%" },
    { nombre: "No Disponible", valor: "74 (2.2%)", ancho: "5.5%" },
    { nombre: "Venta", valor: "62 (1.9%)", ancho: "4.7%" },
    { nombre: "Numero Equivocado", valor: "7 (0.2%)", ancho: "1%" },
  ];

  return (
    <div className="dashboard-grid">
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ResultadosChart datos={resultados} />
        <DuracionChart />
      </div>

      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <EmbudoChart />
        <InsightsCard />
      </div>
    </div>
  );
}

export default Resumen;