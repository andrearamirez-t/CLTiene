import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useFilters } from "../FiltersContext";

import { API_BASE } from "../config";
import logoCLTiene from "../assets/logo_cl_tiene.png";

// Carga el logo a un dataURL (jsPDF.addImage necesita base64). Devuelve null si falla.
const cargarLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve({ dataUrl: c.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => resolve(null);
    img.src = logoCLTiene;
  });

// La IA emite bloques con fondo oscuro (rgb(15,23,42)); en pantalla el texto oscuro
// queda ilegible. Convertimos esos colores a un tema claro SOLO para el render en
// pantalla (el PDF usa el HTML crudo y no depende de estos estilos).
const limpiarHTML = (raw) =>
  String(raw || "")
    .replace(/background-color\s*:\s*rgb\(\s*15\s*,\s*23\s*,\s*42\s*\)[^;"']*/gi, "background-color: #ffffff")
    .replace(/color\s*:\s*rgb\(\s*203\s*,\s*213\s*,\s*225\s*\)[^;"']*/gi, "color: #334155")
    .replace(/color\s*:\s*rgb\(\s*148\s*,\s*163\s*,\s*184\s*\)[^;"']*/gi, "color: #64748b")
    .replace(/border(?:-bottom)?\s*:\s*1px solid rgb\(\s*30\s*,\s*41\s*,\s*59\s*\)[^;"']*/gi, "border-bottom: 1px solid #e2e8f0");

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

  const descargarPDF = async () => {
    if (!reporte) return;
    const logo = await cargarLogo();
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40, maxW = 515;
    const PINK = [252, 50, 118], GRAY = [71, 85, 105], SLATE = [30, 41, 59];
    // Colores de badge para el semáforo (fondo saturado + texto blanco)
    const STATUS = {
      verde: [22, 163, 74], amarillo: [217, 119, 6], naranja: [217, 119, 6],
      rojo: [220, 38, 38], "n/d": [148, 163, 184], azul: [37, 99, 235],
    };
    let y = margin;

    // Sanitiza caracteres que la fuente estándar del PDF no soporta (evita texto cortado)
    const clean = (s) =>
      String(s)
        .replace(/→/g, "->").replace(/★/g, "*")
        .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
        .replace(/[–—]/g, "-").replace(/…/g, "...")
        // Semáforo: la fuente del PDF no renderiza emojis de color -> a palabra
        .replace(/🟢/g, "Verde").replace(/🟡/g, "Amarillo").replace(/🟠/g, "Amarillo")
        .replace(/🔴/g, "Rojo").replace(/⚪/g, "N/D").replace(/🔵/g, "Azul")
        // Cualquier otro caracter fuera de Latin-1 (emojis sueltos) que la fuente no soporta
        .replace(/[^\x00-\xFF]/g, "")
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
    // Título de sección: gris pizarra (formal) + regla rosa de acento debajo
    const seccion = (txt, size = 13) => {
      salto(10); ensure(28);
      doc.setFont(undefined, "bold"); doc.setFontSize(size); doc.setTextColor(...SLATE);
      doc.splitTextToSize(clean(txt), maxW).forEach((line) => { ensure(18); doc.text(line, margin, y); salto(18); });
      doc.setDrawColor(...PINK); doc.setLineWidth(1.2); doc.line(margin, y, margin + 46, y);
      doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.6); doc.line(margin + 46, y, 555, y);
      salto(12);
      doc.setFont(undefined, "normal"); doc.setTextColor(...GRAY);
    };

    // Viñeta con punto rosa dibujado (no depende de la fuente; el char "•" no se renderiza en jsPDF)
    const vineta = (txt, indent = 16, size = 10.5) => {
      const t = clean(txt);
      if (!t) return;
      doc.setFontSize(size); doc.setTextColor(...GRAY); doc.setFont(undefined, "normal");
      doc.splitTextToSize(t, maxW - indent).forEach((line, i) => {
        ensure(size + 4);
        if (i === 0) { doc.setFillColor(...PINK); doc.circle(margin + 6, y - 3, 1.7, "F"); }
        doc.text(line, margin + indent, y); salto(size + 4);
      });
    };

    // Dibuja una tabla real (encabezado rosa, filas zebra, bordes, columnas auto-ancho)
    const drawTable = (headers, rows) => {
      if (!headers.length) return;
      const lineH = 11, padX = 7, padY = 5, fs = 9;

      // Ancho de columna: las columnas NUMÉRICAS (1..n) reservan PRIMERO el ancho de
      // su encabezado (1 línea garantizada, no se parte "Posibles/Ventas"); la col 0
      // (nombre) toma lo que sobre, acotada al nombre más largo. Los nombres pueden
      // envolver a 2 líneas si son muy largos; los encabezados nunca.
      doc.setFontSize(fs);
      const wOf = (s, bold) => { doc.setFont(undefined, bold ? "bold" : "normal"); return doc.getTextWidth(clean(String(s ?? ""))); };
      const headMin = headers.map((h) => wOf(h, true) + 2 * padX + 3);
      const sumNum = headMin.reduce((a, b, i) => a + (i === 0 ? 0 : b), 0); // numéricas, sin col0
      const col0Data = Math.max(0, ...rows.map((r) => wOf(r[0], false))) + 2 * padX + 3;
      const col0 = Math.max(headMin[0], Math.min(col0Data, maxW - sumNum));
      doc.setFont(undefined, "normal");
      const minW = headers.map((h, c) => (c === 0 ? col0 : headMin[c]));
      const rawW = headers.map((_, c) =>
        Math.max(4, ...rows.map((r) => clean(String(r[c] ?? "")).length))
      );
      const totalRaw = rawW.reduce((a, b) => a + b, 0) || 1;
      const sumMin = minW.reduce((a, b) => a + b, 0);
      let W;
      if (sumMin >= maxW) {
        const k = maxW / sumMin;              // caso extremo: no caben ni así → escala
        W = minW.map((w) => w * k);
      } else {
        const extra = maxW - sumMin;          // espacio sobrante repartido por datos
        W = minW.map((mw, c) => mw + extra * (rawW[c] / totalRaw));
      }

      // Alineación por columna: col 0 texto (izq), columna de semáforo centrada (badge),
      // el resto (números) a la derecha → se lee como reporte financiero.
      const esStatusCol = headers.map((_, c) =>
        rows.some((r) => STATUS[clean(String(r[c] ?? "")).toLowerCase()])
      );
      const alignOf = (c) => (c === 0 ? "left" : esStatusCol[c] ? "center" : "right");

      const renderRow = (cells, { head = false, idx = 0 } = {}) => {
        doc.setFontSize(fs);
        doc.setFont(undefined, head ? "bold" : "normal");
        // Altura de fila = máximo de líneas envueltas entre sus celdas
        let maxLines = 1;
        const wrapped = cells.map((cell, c) => {
          const lines = doc.splitTextToSize(clean(String(cell ?? "")), W[c] - 2 * padX);
          if (lines.length > maxLines) maxLines = lines.length;
          return lines;
        });
        const h = maxLines * lineH + 2 * padY;

        // Salto de página → repite el encabezado arriba
        if (y + h > 790) { doc.addPage(); y = margin; renderRow(headers, { head: true }); }

        // Fondo (rosa el encabezado, zebra el cuerpo)
        if (head) doc.setFillColor(...PINK);
        else if (idx % 2) doc.setFillColor(248, 250, 252);
        else doc.setFillColor(255, 255, 255);
        doc.rect(margin, y, maxW, h, "F");

        // Contenido celda por celda
        let x = margin;
        wrapped.forEach((lines, c) => {
          const raw = clean(String(cells[c] ?? ""));
          const badge = !head && STATUS[raw.toLowerCase()];
          const align = alignOf(c);
          if (badge) {
            // Semáforo como badge de color con texto blanco
            doc.setFont(undefined, "bold"); doc.setFontSize(fs);
            const tw = doc.getTextWidth(raw);
            const pillW = Math.min(tw + 16, W[c] - 6), pillH = 15;
            const px = x + (W[c] - pillW) / 2, py = y + (h - pillH) / 2;
            doc.setFillColor(...badge);
            doc.roundedRect(px, py, pillW, pillH, 5, 5, "F");
            doc.setTextColor(255, 255, 255);
            doc.text(raw, x + W[c] / 2, py + pillH / 2, { align: "center", baseline: "middle" });
            doc.setFont(undefined, "normal");
          } else {
            doc.setTextColor(...(head ? [255, 255, 255] : c === 0 ? SLATE : GRAY));
            const tx = align === "left" ? x + padX : align === "right" ? x + W[c] - padX : x + W[c] / 2;
            lines.forEach((ln, i) =>
              doc.text(ln, tx, y + padY + lineH * (i + 1) - 2, { align })
            );
          }
          x += W[c];
        });

        // Bordes: recuadro de la fila + separadores verticales
        doc.setDrawColor(head ? 252 : 226, head ? 50 : 232, head ? 118 : 240);
        doc.setLineWidth(0.5);
        doc.rect(margin, y, maxW, h, "S");
        let vx = margin;
        for (let c = 0; c < W.length - 1; c++) { vx += W[c]; doc.line(vx, y, vx, y + h); }

        y += h;
        doc.setFont(undefined, "normal");
      };

      salto(4);
      // Evita el ENCABEZADO HUÉRFANO al final de una página: si no caben al menos el
      // encabezado + 1 fila de datos, salta de página para que la tabla arranque completa.
      const altoAprox = 2 * (lineH + 2 * padY) + lineH; // header + 1 fila (con margen)
      if (y + altoAprox > 790) { doc.addPage(); y = margin; }
      renderRow(headers, { head: true });
      rows.forEach((r, i) => renderRow(r, { idx: i + 1 }));
      salto(12);
      doc.setTextColor(...GRAY);
    };

    // Banda de encabezado
    doc.setFillColor(...PINK); doc.rect(0, 0, 595, 76, "F");
    doc.setTextColor(255, 255, 255); doc.setFont(undefined, "bold"); doc.setFontSize(16);
    doc.text("Reporte Estratégico de Operaciones", margin, 38);
    doc.setFont(undefined, "normal"); doc.setFontSize(10);
    doc.text("CL Tiene Soluciones - Agente IA PRO (DivergencyAI SAS)", margin, 58);
    // Logo CL Tiene (wordmark blanco) alineado a la derecha de la banda
    if (logo) {
      const lw = 130, lh = lw * (logo.h / logo.w);
      doc.addImage(logo.dataUrl, "PNG", 595 - margin - lw, (76 - lh) / 2, lw, lh);
    }
    // Período según los filtros de fecha del sidebar
    const fd = filters?.fecha_desde, fh = filters?.fecha_hasta;
    let periodo = "Período: todo el histórico";
    if (fd && fh) periodo = `Período: ${fd} a ${fh}`;
    else if (fd) periodo = `Período: desde ${fd}`;
    else if (fh) periodo = `Período: hasta ${fh}`;

    y = 98;
    doc.setTextColor(120, 120, 120); doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleDateString()}   |   ${periodo}`, margin, y);
    salto(16);

    // Parsear el HTML del reporte para preservar la estructura (títulos, párrafos, listas, tablas)
    const cont = document.createElement("div");
    cont.innerHTML = reporte;

    // --- Resumen Ejecutivo: extraerlo y renderizarlo como PANEL destacado (BLUF) ---
    const panelResumen = (items, concl) => {
      const indent = 20, size = 10.5, lh = size + 4, padTop = 14, padBot = 12;
      doc.setFontSize(size); doc.setFont(undefined, "normal");
      const bloques = items.map((it) => doc.splitTextToSize(clean(it), maxW - indent - 12));
      const cLines = concl ? doc.splitTextToSize(clean(concl), maxW - indent - 12) : [];
      const nBullets = bloques.reduce((a, b) => a + b.length, 0);
      const boxH = padTop + nBullets * lh + (cLines.length ? 8 + cLines.length * lh : 0) + padBot;
      ensure(boxH + 6);
      const top = y;
      // Panel gris claro con borde y barra rosa a la izquierda
      doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.6);
      doc.roundedRect(margin, top, maxW, boxH, 7, 7, "FD");
      doc.setFillColor(...PINK); doc.rect(margin, top + 3, 4, boxH - 6, "F");
      // Contenido
      let ty = top + padTop + 6;
      doc.setTextColor(...GRAY); doc.setFontSize(size);
      bloques.forEach((lns) => {
        lns.forEach((ln, i) => {
          if (i === 0) { doc.setFillColor(...PINK); doc.circle(margin + 14, ty - 3, 1.7, "F"); }
          doc.text(ln, margin + indent, ty); ty += lh;
        });
      });
      if (cLines.length) {
        ty += 8; doc.setFont(undefined, "bold"); doc.setTextColor(...SLATE);
        cLines.forEach((ln) => { doc.text(ln, margin + indent - 4, ty); ty += lh; });
        doc.setFont(undefined, "normal");
      }
      y = top + boxH; salto(14); doc.setTextColor(...GRAY);
    };

    const resH2 = [...cont.querySelectorAll("h1,h2,h3")].find((h) => /resumen ejecutivo/i.test(h.textContent));
    if (resH2) {
      // La IA insiste en meter el estatus/contacto efectivo en el Resumen. Fix determinista:
      // lo detectamos y lo REUBICAMOS en la sección Estatus (no depende del prompt).
      const esEstatus = (t) => /contestad|contacto efectivo|sin contacto|estatus del marcador|no contestad/i.test(t || "");
      const estatusH2 = [...cont.querySelectorAll("h1,h2,h3")].find((h) => /estatus/i.test(h.textContent));
      let anchor = estatusH2;
      const relocar = (texto) => {
        if (!estatusH2 || !texto) return;
        const np = document.createElement("p");
        np.textContent = texto;
        anchor.insertAdjacentElement("afterend", np);
        anchor = np;   // preserva el orden de los reubicados
      };

      // Bloque del Resumen = hermanos de resH2 hasta el siguiente encabezado (seguro esté o
      // no envuelto en un div, y sin tocar otras secciones).
      const bloque = [];
      for (let n = resH2.nextElementSibling; n && !/^h[1-3]$/i.test(n.tagName); n = n.nextElementSibling) {
        bloque.push(n);
      }
      const items = [];
      let concl = "";
      bloque.forEach((n) => {
        const tag = n.tagName.toLowerCase();
        if (tag === "ul" || tag === "ol") {
          [...n.querySelectorAll("li")].forEach((li) => {
            const t = li.textContent.trim();
            if (!t) return;
            esEstatus(t) ? relocar(t) : items.push(t);   // estatus en un bullet -> a su sección
          });
        } else {
          const t = n.textContent.trim();
          if (!t) return;
          if (esEstatus(t)) relocar(t);                  // estatus en un párrafo -> a su sección
          else if (!concl) concl = t;                    // primer párrafo limpio = conclusión
        }
      });

      seccion(resH2.textContent);
      panelResumen(items, concl);
      // Quitar del DOM el bloque del Resumen ya renderizado (los reubicados son nodos nuevos)
      resH2.remove(); bloque.forEach((n) => n.remove());
    }

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
          el.querySelectorAll(":scope > li").forEach((li) => vineta(li.textContent));
          salto(4);
        } else if (tag === "li") {
          vineta(el.textContent);
        } else if (tag === "br") {
          salto(5);
        } else if (tag === "table") {
          const trs = [...el.querySelectorAll("tr")];
          if (!trs.length) return;
          const headRow = el.querySelector("thead tr") || trs[0];
          const headers = [...headRow.querySelectorAll("th,td")].map((c) => c.textContent.trim());
          const bodyTrs = el.querySelector("tbody")
            ? [...el.querySelectorAll("tbody tr")]
            : trs.slice(1);
          const rows = bodyTrs.map((tr) => {
            const cs = [...tr.querySelectorAll("td,th")].map((c) => c.textContent.trim());
            while (cs.length < headers.length) cs.push("");
            return cs.slice(0, headers.length);
          });
          drawTable(headers, rows);
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
      doc.text(`Página ${p} de ${totalPaginas}`, 500, 830);
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
            dangerouslySetInnerHTML={{ __html: limpiarHTML(reporte) }}
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
