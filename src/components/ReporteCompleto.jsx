import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useFilters } from "../FiltersContext";

import { API_BASE } from "../config";

const ReporteCompleto = () => {
  const { buildQuery } = useFilters();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const generarReporte = async () => {
    setLoading(true);
    setReporte(null);
    try {
      const params = buildQuery();
      const url = `${API_BASE}/ia/reporte_completo${params ? `?${params}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.result) setReporte(data.result);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    }
    setLoading(false);
  };

  const descargarPDF = () => {
    if (!reporte) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(252, 50, 118);
    doc.text("REPORTE ESTRATÉGICO DE OPERACIONES", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Fecha: ${new Date().toLocaleDateString()} | Generado por: Agente IA PRO`,
      margin,
      y
    );
    doc.setDrawColor(252, 50, 118);
    doc.line(margin, y + 2, 190, y + 2);
    y += 15;

    const texto = reporte.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    doc.setFontSize(11);
    doc.setTextColor(30);
    const lineas = doc.splitTextToSize(texto, 170);
    lineas.forEach((linea) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(linea, margin, y);
      y += 6;
    });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Documento confidencial - CL TIENE SOLUCIONES", margin, 285);
    doc.save(`Reporte_IA_${Date.now()}.pdf`);
  };

  return (
    <div style={styles.wrapper}>
      {/* Tarjeta de acción */}
      <div style={styles.actionCard}>
        <div style={styles.actionHeader}>
          <span style={styles.actionIcon}>📊</span>
          <div>
            <h3 style={styles.actionTitle}>Inteligencia Operativa</h3>
            <p style={styles.actionSubtitle}>
              Análisis completo basado en los filtros activos del dashboard
            </p>
          </div>
        </div>
        <button
          onClick={generarReporte}
          disabled={loading}
          style={loading ? styles.btnDisabled : styles.btn}
        >
          {loading ? "⌛ PROCESANDO..." : "GENERAR REPORTE EJECUTIVO"}
        </button>
      </div>

      {/* Skeleton de carga */}
      {loading && (
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>🤖</div>
          <p style={styles.loadingTitle}>La IA está analizando los datos...</p>
          <p style={styles.loadingSubtitle}>Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Resultado */}
      {!loading && reporte && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <span style={styles.resultBadge}>💡 Reporte Ejecutivo</span>
            <span style={styles.resultMeta}>
              Generado con los filtros activos del dashboard
            </span>
          </div>

          <div
            style={styles.resultBody}
            dangerouslySetInnerHTML={{ __html: reporte }}
          />

          <div style={styles.pdfRow}>
            <button onClick={descargarPDF} style={styles.pdfBtn}>
              📄 DESCARGAR EN PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px 32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  actionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  actionIcon: {
    fontSize: "36px",
  },
  actionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  actionSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  btn: {
    width: "100%",
    maxWidth: "360px",
    background: "linear-gradient(135deg, #FC3276 0%, #db2777 100%)",
    color: "white",
    padding: "15px 24px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.6px",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(252,50,118,0.35)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  btnDisabled: {
    width: "100%",
    maxWidth: "360px",
    background: "#cbd5e0",
    color: "white",
    padding: "15px 24px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.6px",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  loadingCard: {
    backgroundColor: "#fff5f9",
    borderRadius: "16px",
    padding: "40px",
    border: "1px solid #fce7f3",
    textAlign: "center",
  },
  loadingIcon: {
    fontSize: "44px",
    marginBottom: "12px",
  },
  loadingTitle: {
    margin: "0 0 6px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#FC3276",
  },
  loadingSubtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#94a3b8",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "36px 40px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  resultHeader: {
    borderLeft: "5px solid #FC3276",
    paddingLeft: "20px",
    marginBottom: "28px",
    background: "linear-gradient(90deg, #fff5f9 0%, transparent 80%)",
    borderRadius: "0 10px 10px 0",
    padding: "14px 20px",
  },
  resultBadge: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    color: "#FC3276",
    marginBottom: "4px",
  },
  resultMeta: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  resultBody: {
    lineHeight: "1.8",
    color: "#334155",
    fontSize: "14px",
  },
  pdfRow: {
    textAlign: "center",
    marginTop: "36px",
    paddingTop: "24px",
    borderTop: "1px solid #f1f5f9",
  },
  pdfBtn: {
    background: "linear-gradient(135deg, #FC3276 0%, #db2777 100%)",
    color: "white",
    padding: "13px 48px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(252,50,118,0.3)",
  },
};

export default ReporteCompleto;
