import React, { useState } from "react";
import { jsPDF } from "jspdf";

const ReporteCompleto = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const generarReporte = async () => {
    setLoading(true);
    setReporte(null);
    try {
      const response = await fetch("http://localhost:8000/api/analisis_automatico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo_analisis: "ejecutivo" })
      });
      const data = await response.json();
      if (data.resultado) {
        setReporte(data.resultado);
      }
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    }
    setLoading(false);
  };

  const descargarReportePDF = () => {
    if (!reporte) return;

    const doc = new jsPDF();
    const margin = 20;
    let yPosition = 20;

    // --- ENCABEZADO ---
    doc.setFontSize(18);
    doc.setTextColor(252, 50, 118); 
    doc.text("REPORTE ESTRATÉGICO DE OPERACIONES", margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha: ${new Date().toLocaleDateString()} | Generado por: Agente IA PRO`, margin, yPosition);
    
    doc.setDrawColor(252, 50, 118);
    doc.line(margin, yPosition + 2, 190, yPosition + 2);
    yPosition += 15;

    // --- SECCIÓN RESUMEN ---
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("1. Resumen Ejecutivo", margin, yPosition);
    
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const resumenLineas = doc.splitTextToSize(reporte.resumen, 170);
    doc.text(resumenLineas, margin, yPosition);
    yPosition += (resumenLineas.length * 6) + 10;

    // --- SECCIÓN HALLAZGOS ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. Hallazgos Clave", margin, yPosition);
    
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    reporte.hallazgos?.forEach((h, i) => {
        const text = `${i + 1}. ${h}`;
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, margin, yPosition);
        yPosition += (lines.length * 6);
    });
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("3. Recomendaciones", margin, yPosition);
    
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    reporte.recomendaciones?.forEach((r) => {
        const text = `• ${r}`;
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, margin, yPosition);
        yPosition += (lines.length * 6);
    });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Documento confidencial - CL TIENE SOLUCIONES", margin, 285);

    doc.save(`Reporte_IA_${new Date().getTime()}.pdf`);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px", fontFamily: 'sans-serif' }}>
      
      <div style={{ backgroundColor: "#ffffff", borderRadius: "15px", padding: "30px", border: "1px solid #e2e8f0", textAlign: 'center' }}>
        <h2>📊 Inteligencia Operativa</h2>
        <button
          onClick={generarReporte}
          disabled={loading}
          style={{
            width: "100%", maxWidth: "350px", backgroundColor: loading ? "#cbd5e0" : "#FC3276",
            color: "white", padding: "16px", borderRadius: "12px", border: "none", fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⌛ PROCESANDO..." : "GENERAR REPORTE EJECUTIVO"}
        </button>
      </div>

      {reporte && (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "15px", padding: "40px", border: "1px solid #e2e8f0" }}>
          
          <div style={{ borderLeft: "6px solid #FC3276", paddingLeft: "25px", marginBottom: "35px" }}>
            <h3 style={{ color: "#FC3276", margin: "0" }}>💡 Resumen Ejecutivo</h3>
            <p>{reporte.resumen}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
            <div style={{ backgroundColor: "#f7fafc", padding: "20px", borderRadius: "15px" }}>
              <h4>🔍 Hallazgos Clave</h4>
              <ul>{reporte.hallazgos?.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </div>
            <div style={{ backgroundColor: "#fff5f5", padding: "20px", borderRadius: "15px" }}>
              <h4>🚀 Recomendaciones</h4>
              <ul>{reporte.recomendaciones?.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>

          {/* BOTÓN DESCARGAR PDF */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={descargarReportePDF}
              style={{
                backgroundColor: "#FC3276", 
                color: "white", padding: "12px 40px", borderRadius: "10px", border: "none",
                fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px"
              }}
            >
              DESCARGAR EN PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteCompleto;