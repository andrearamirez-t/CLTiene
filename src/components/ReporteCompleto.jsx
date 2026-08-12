import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useFilters } from "../FiltersContext";

import { API_BASE } from "../config";

const ReporteCompleto = () => {
  const { buildQuery, filters } = useFilters();
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
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40, maxW = 515;
    const PINK = [252, 50, 118], GRAY = [71, 85, 105];
    let y = margin;

    // Sanitiza caracteres que la fuente estándar del PDF no soporta (evita texto cortado)
    const clean = (s) =>
      String(s)
        .replace(/→/g, "->").replace(/★/g, "*")
        .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
        .replace(/[–—]/g, "-").replace(/…/g, "...")
        .replace(/\s+/g, " ").trim();

    const salto = (h = 13) => { y += h; if (y > 790) { doc.addPage(); y = margin; } };
    const ensure = (h) => { if (y + h > 790) { doc.addPage(); y = margin; } };
    const parrafo = (txt, size = 10.5, color = GRAY, bold = false, indent = 0) => {
      const t = clean(txt);
      if (!t) return;
      doc.setFontSize(size); doc.setTextColor(...color); doc.setFont(undefined, bold ? "bold" : "normal");
      doc.splitTextToSize(t, maxW - indent).forEach((line) => {
        ensure(size + 4); doc.text(line, margin + indent, y); salto(size + 4);
      });
      doc.setFont(undefined, "normal");
    };
    const seccion = (txt, size = 13) => {
      salto(8); ensure(26);
      doc.setFont(undefined, "bold"); doc.setFontSize(size); doc.setTextColor(...PINK);
      doc.splitTextToSize(clean(txt), maxW).forEach((line) => { ensure(18); doc.text(line, margin, y); salto(18); });
      doc.setDrawColor(244, 194, 210); doc.setLineWidth(0.6); doc.line(margin, y, 555, y); salto(11);
      doc.setFont(undefined, "normal"); doc.setTextColor(...GRAY);
    };

    // Banda de encabezado
    doc.setFillColor(...PINK); doc.rect(0, 0, 595, 76, "F");
    doc.setTextColor(255, 255, 255); doc.setFont(undefined, "bold"); doc.setFontSize(16);
    doc.text("Reporte Estrategico de Operaciones", margin, 38);
    doc.setFont(undefined, "normal"); doc.setFontSize(10);
    doc.text("CL Tiene Soluciones - Agente IA PRO (DivergencyAI SAS)", margin, 58);
    // Período según los filtros de fecha del sidebar
    const fd = filters?.fecha_desde, fh = filters?.fecha_hasta;
    let periodo = "Periodo: todo el historico";
    if (fd && fh) periodo = `Periodo: ${fd} a ${fh}`;
    else if (fd) periodo = `Periodo: desde ${fd}`;
    else if (fh) periodo = `Periodo: hasta ${fh}`;

    y = 98;
    doc.setTextColor(120, 120, 120); doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleDateString()}   |   ${periodo}`, margin, y);
    salto(16);

    // Parsear el HTML del reporte para preservar la estructura (títulos, párrafos, listas, tablas)
    const cont = document.createElement("div");
    cont.innerHTML = reporte;
    const walk = (node) => {
      node.childNodes.forEach((el) => {
        if (el.nodeType === 3) { const t = el.textContent.trim(); if (t) parrafo(t); return; }
        if (el.nodeType !== 1) return;
        const tag = el.tagName.toLowerCase();
        if (/^h[1-6]$/.test(tag)) {
          seccion(el.textContent, tag === "h1" || tag === "h2" ? 13 : 12);
        } else if (tag === "p") {
          parrafo(el.textContent); salto(3);
        } else if (tag === "ul" || tag === "ol") {
          el.querySelectorAll(":scope > li").forEach((li) => parrafo("•  " + li.textContent, 10.5, GRAY, false, 12));
          salto(4);
        } else if (tag === "li") {
          parrafo("•  " + el.textContent, 10.5, GRAY, false, 12);
        } else if (tag === "br") {
          salto(5);
        } else if (tag === "table") {
          el.querySelectorAll("tr").forEach((tr) => {
            const fila = [...tr.querySelectorAll("td,th")].map((c) => c.textContent.trim()).filter(Boolean).join("   |   ");
            if (fila) parrafo(fila, 9.5);
          });
          salto(4);
        } else {
          walk(el); // div, span, section, etc. → recursar
        }
      });
    };
    walk(cont);

    // Pie de página con numeración en todas las páginas
    const totalPaginas = doc.getNumberOfPages();
    for (let p = 1; p <= totalPaginas; p++) {
      doc.setPage(p);
      doc.setDrawColor(228, 228, 228); doc.setLineWidth(0.5); doc.line(margin, 816, 555, 816);
      doc.setFontSize(8); doc.setTextColor(150, 150, 150); doc.setFont(undefined, "normal");
      doc.text("CL Tiene Soluciones - DivergencyAI SAS   |   Confidencial", margin, 830);
      doc.text(`Pagina ${p} de ${totalPaginas}`, 500, 830);
    }
    doc.save(`Reporte_IA_${new Date().toISOString().slice(0, 10)}.pdf`);
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
