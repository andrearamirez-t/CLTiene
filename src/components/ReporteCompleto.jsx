import React, { useState } from "react";

const ReporteCompleto = () => {

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const generarReporte = async () => {

    setLoading(true);

    try {

      const response = await fetch("http://localhost:8000/api/analisis_automatico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo_analisis: "resumen_ejecutivo"
        })
      });

      const data = await response.json();

      setReporte(data?.resultado || "No se pudo generar el reporte.");

    } catch (error) {

      console.error("Error generando reporte:", error);

    }

    setLoading(false);
  };

  return (

    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>

      <div style={{
        backgroundColor:"white",
        border:"1px solid #e2e8f0",
        borderRadius:"15px",
        padding:"30px"
      }}>

        <h2>📄 Reporte Ejecutivo Completo</h2>

        <button
          onClick={generarReporte}
          style={{
            width:"100%",
            backgroundColor:"#FC3276",
            color:"white",
            padding:"12px",
            borderRadius:"8px",
            border:"none",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          Generar Reporte
        </button>

      </div>

      <div style={{
        backgroundColor:"#ffffff",
        border:"1px solid #e2e8f0",
        borderRadius:"15px",
        padding:"40px"
      }}>

        {loading && <p>Generando análisis con IA...</p>}

        {reporte && (
          <div style={{whiteSpace:"pre-wrap"}}>
            {reporte}
          </div>
        )}

      </div>

    </div>
  );
};

export default ReporteCompleto;