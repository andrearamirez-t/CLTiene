import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_BASE, apiFetch } from '../config';
import ChatVisor from '../components/Transcripciones/ChatVisor';

/**
 * PROTOTIPO — "Mi Desempeño" (vista individual del asesor).
 * Página aparte, aislada del dashboard de supervisor. Reutiliza endpoints que ya
 * existen (rendimiento_agente + analizar_asesor). El asesor se elige con un
 * selector ("simular como…"); en la versión real saldría del token autenticado
 * (identidad parametrizada — ver regla de seguridad).
 */
const MiDesempeno = () => {
  const [asesores, setAsesores] = useState([]);      // rendimiento_agente (periodo)
  const [sel, setSel] = useState("");                 // asesor simulado
  const [desde, setDesde] = useState("");             // filtro de fecha
  const [hasta, setHasta] = useState("");
  const [coach, setCoach] = useState("");             // HTML del Coach IA
  const [cargandoCoach, setCargandoCoach] = useState(false);
  const [evol, setEvol] = useState([]);               // evolución semanal
  const [llamadas, setLlamadas] = useState([]);       // lista de llamadas del asesor
  const [llamadaSel, setLlamadaSel] = useState("");   // llamada elegida
  const [chat, setChat] = useState([]);               // mensajes de la transcripción

  // ?nombre_asesor=..&fecha_desde=..&fecha_hasta=.. (incluye el asesor solo si se pide)
  const qp = (conAsesor) => {
    const p = new URLSearchParams();
    if (conAsesor && sel) p.set('nombre_asesor', sel);
    if (desde) p.set('fecha_desde', desde);
    if (hasta) p.set('fecha_hasta', hasta);
    const s = p.toString();
    return s ? `?${s}` : '';
  };

  // Rendimiento de todos los asesores en el periodo (KPIs del asesor + benchmark)
  useEffect(() => {
    apiFetch(`${API_BASE}/api/rendimiento_agente${qp(false)}`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data.filter(a => (a.llamadas || 0) > 0) : [];
        setAsesores(arr);
        setSel(prev => (!arr.length || (prev && arr.some(a => a.n === prev))) ? prev : arr[0].n);
      })
      .catch(() => setAsesores([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta]);

  const yo = useMemo(() => asesores.find(a => a.n === sel) || null, [asesores, sel]);

  // Benchmark anónimo: posición por contacto_pct (1 = mejor)
  const bench = useMemo(() => {
    if (!yo || !asesores.length) return null;
    const orden = [...asesores].sort((a, b) => (b.contacto_pct || 0) - (a.contacto_pct || 0));
    const rank = orden.findIndex(a => a.n === sel) + 1;
    const total = orden.length;
    const topPct = Math.max(1, Math.round((rank / total) * 100));
    return { rank, total, topPct, fill: Math.max(6, 100 - Math.round(((rank - 1) / total) * 100)) };
  }, [yo, asesores, sel]);

  const fmtTMO = (seg) => {
    const s = Number(seg) || 0;
    const m = Math.floor(s / 60), ss = s % 60;
    return `${m}:${String(ss).padStart(2, '0')}`;
  };

  const generarCoach = async () => {
    if (!sel) return;
    setCargandoCoach(true);
    try {
      const extra = new URLSearchParams();
      if (desde) extra.set('fecha_desde', desde);
      if (hasta) extra.set('fecha_hasta', hasta);
      const res = await apiFetch(`${API_BASE}/ia/analizar_asesor?asesor=${encodeURIComponent(sel)}${extra.toString() ? '&' + extra.toString() : ''}`);
      const result = await res.json();
      const raw = result.result || "";
      setCoach(raw
        .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
        .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
        .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0'));
    } catch {
      setCoach("<p style='color:#dc2626'>No se pudo generar el coach. Intenta de nuevo.</p>");
    }
    setCargandoCoach(false);
  };

  // Al cambiar de asesor, limpiar el coach anterior
  useEffect(() => { setCoach(""); }, [sel]);

  // Evolución semanal del asesor seleccionado
  useEffect(() => {
    if (!sel) return;
    apiFetch(`${API_BASE}/evolucion-ventas${qp(true)}`)
      .then(r => r.json())
      .then(d => setEvol(Array.isArray(d) ? d : []))
      .catch(() => setEvol([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, desde, hasta]);

  // Lista de llamadas del asesor (selector de transcripción)
  useEffect(() => {
    if (!sel) { setLlamadas([]); return; }
    setLlamadaSel(""); setChat([]);
    apiFetch(`${API_BASE}/api/transcripcion/llamadas${qp(true)}`)
      .then(r => r.json())
      .then(d => setLlamadas(Array.isArray(d) ? d : []))
      .catch(() => setLlamadas([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, desde, hasta]);

  // Transcripción de la llamada elegida
  useEffect(() => {
    if (!llamadaSel) { setChat([]); return; }
    apiFetch(`${API_BASE}/api/transcripcion/llamada/${llamadaSel}${qp(true)}`)
      .then(r => r.json())
      .then(d => setChat(Array.isArray(d?.mensajes) ? d.mensajes : []))
      .catch(() => setChat([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llamadaSel]);

  const fmtSemana = (f) => {
    const d = new Date(f);
    return isNaN(d) ? String(f).slice(5) : `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
  };

  const kpi = (label, value, sub) => (
    <div style={{ flex: 1, minWidth: 150, background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '0 0 60px' }}>
      {/* Banner prototipo */}
      <div style={{ background: '#fef3c7', borderBottom: '1px solid #fcd34d', color: '#92400e', fontSize: 12, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <strong>🧪 Modo prototipo</strong>
        <span>Vista de ejemplo del panel personal del asesor. En la versión real, el asesor entra con su usuario y ve solo lo suyo.</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Desde
            <input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #fcd34d', fontSize: 12 }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Hasta
            <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #fcd34d', fontSize: 12 }} />
          </label>
          {(desde || hasta) && <button onClick={() => { setDesde(""); setHasta(""); }} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #fcd34d', background: '#fff', cursor: 'pointer', fontSize: 11 }}>Limpiar</button>}
          Simular como:
          <select value={sel} onChange={e => setSel(e.target.value)}
            style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #fcd34d', background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: 12 }}>
            {asesores.map(a => <option key={a.n} value={a.n}>{a.n}</option>)}
          </select>
        </span>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px' }}>
        {/* Header personal */}
        <div style={{ background: 'linear-gradient(120deg, #FC3276 0%, #9333ea 100%)', borderRadius: 18, padding: '28px 32px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Mi Desempeño</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>{yo ? yo.n : '—'}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, opacity: 0.9 }}>{(desde || hasta) ? `${desde || '…'} → ${hasta || '…'}` : 'Histórico'}<br />Solo mis llamadas</div>
        </div>

        {!yo ? (
          <div style={{ color: '#64748b', padding: 40, textAlign: 'center' }}>Cargando…</div>
        ) : (
          <>
            {/* KPIs personales */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
              {kpi('Mis llamadas', yo.llamadas ?? '—')}
              {kpi('Contacto efectivo', (yo.contacto_pct ?? 0) + '%')}
              {kpi('Mi TMO', fmtTMO(yo.tmo_seg), 'tiempo hablado prom.')}
              {kpi('Calidad', (yo.score_calidad ?? 0) + '/100')}
              {kpi('Posibles ventas', (yo.tasa_venta ?? 0) + '%')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
              {/* Benchmark anónimo */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📊 Mi posición en el equipo <span style={{ color: '#94a3b8', fontWeight: 500 }}>(anónima)</span></div>
                {bench && (
                  <>
                    <div style={{ height: 12, borderRadius: 8, background: 'linear-gradient(90deg,#fbcfe8,#f9a8d4)', position: 'relative', marginBottom: 12 }}>
                      <div style={{ position: 'absolute', left: `calc(${bench.fill}% - 3px)`, top: -3, width: 6, height: 18, borderRadius: 3, background: '#0f172a' }} />
                    </div>
                    <div style={{ fontSize: 13, color: '#334155' }}>
                      Estás en el <strong style={{ color: '#FC3276' }}>top {bench.topPct}%</strong> del equipo en contacto efectivo (posición {bench.rank} de {bench.total}) — <span style={{ color: '#64748b' }}>sin ver nombres de nadie.</span>
                    </div>
                  </>
                )}
              </div>

              {/* Coach IA */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>🧠 Mi Coach IA</div>
                  <button onClick={generarCoach} disabled={cargandoCoach}
                    style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: cargandoCoach ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, color: '#fff', background: cargandoCoach ? '#cbd5e0' : 'linear-gradient(135deg,#FC3276,#db2777)' }}>
                    {cargandoCoach ? '⌛ Generando…' : coach ? '↻ Regenerar' : '🧠 Generar mi coach'}
                  </button>
                </div>
                {coach
                  ? <div style={{ lineHeight: 1.7, color: '#334155', fontSize: 13 }} dangerouslySetInnerHTML={{ __html: coach }} />
                  : <div style={{ color: '#94a3b8', fontSize: 13 }}>Genera un diagnóstico personal con tus fortalezas, puntos a mejorar y una meta — con IA sobre tus propias llamadas.</div>}
              </div>
            </div>

            {/* Evolución semanal */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', marginTop: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📈 Mi evolución semanal <span style={{ color: '#94a3b8', fontWeight: 500 }}>(últimas 12 semanas)</span></div>
              {evol.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={evol.slice(-12)} margin={{ top: 8, right: 20, left: -10, bottom: 4 }}>
                    <defs>
                      <linearGradient id="gLlam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FC3276" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FC3276" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                    <XAxis dataKey="fecha" tickFormatter={fmtSemana} fontSize={10} tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip labelFormatter={fmtSemana} />
                    <Legend verticalAlign="top" align="left" height={30} iconType="circle" />
                    <Area type="monotone" dataKey="llamadas" name="Mis llamadas" stroke="#FC3276" strokeWidth={2} fill="url(#gLlam)" dot={{ r: 3, fill: '#FC3276' }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="posibles_ventas" name="Posibles ventas" stroke="#10b981" strokeWidth={2} fill="transparent" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>Sin datos de evolución para este asesor.</div>
              )}
            </div>

            {/* Mis transcripciones */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>💬 Mis transcripciones <span style={{ color: '#94a3b8', fontWeight: 500 }}>({llamadas.length})</span></div>
                <select value={llamadaSel} onChange={e => setLlamadaSel(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: '#FC3276', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', maxWidth: 460 }}>
                  <option value="">Selecciona una de mis llamadas…</option>
                  {llamadas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              {chat.length
                ? <ChatVisor chat={chat} resaltar="" />
                : <div style={{ color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>Elige una llamada para revisar la conversación (cliente / asesor) y autoevaluarte.</div>}
            </div>

            <div style={{ marginTop: 22, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
              Prototipo — datos reales del asesor seleccionado. En la versión real, el asesor entra con su usuario y esto se filtra solo a él.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MiDesempeno;
