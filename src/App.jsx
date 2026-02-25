import React, { useState } from 'react';
import { Phone, Download, CheckCircle, DollarSign, Clock, Calendar, Trophy, Star } from 'lucide-react';

function App() {
  const [tabActiva, setTabActiva] = useState('Resumen Ejecutivo');

  const tabs = [
    'Resumen Ejecutivo',
    'Rendimiento Asesores',
    'Análisis Detallado',
    'Inteligencia Operativa',
    'Transcripciones',
    'Agente IA PRO'
  ];

  const resultados = [
    { nombre: "Contactado", valor: "1.322 (40.1%)", ancho: "90%" },
    { nombre: "Sin Contacto", valor: "753 (22.8%)", ancho: "60%" },
    { nombre: "Sin Clasificar", valor: "624 (18.9%)", ancho: "50%" },
    { nombre: "Buzón de Voz", valor: "205 (6.2%)", ancho: "25%" },
    { nombre: "Rechazado", valor: "168 (5.1%)", ancho: "20%" },
    { nombre: "Venta", valor: "62 (1.9%)", ancho: "10%" },
  ];

  
  const datosDuracion = [
  { label: "Buzón", altura: "140px", color: "linear-gradient(to top, #EE7553, #E83A75)" },
  { label: "Muy Corta", altura: "80px", color: "linear-gradient(to top, #EE7553, #E83A75)" },
  { label: "Corta", altura: "160px", color: "linear-gradient(to top, #EE7553, #E83A75)" },
  { label: "Media", altura: "190px", color: "linear-gradient(to top, #EE7553, #E83A75)" },
  { label: "Larga", altura: "60px", color: "linear-gradient(to top, #EE7553, #E83A75)" },
];

  const getColorExito = (valorStr) => {
    const valor = parseFloat(valorStr);
    if (valor >= 4) return '#10b981';
    if (valor >= 2) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { font-family: 'Inter', sans-serif; display: flex; background: #f8fafc; min-height: 100vh; color: #1e293b; }
        .sidebar { width: 260px; background: #0f172a; color: white; padding: 25px; flex-shrink: 0; }
        .main { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; }
        .header-banner { background: linear-gradient(90deg, #db2777, #7c3aed); color: white; padding: 30px; border-radius: 15px; margin-bottom: 5px; }
        .kpi-row { display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; }
        .kpi-card { background: white; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
        .kpi-card span { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .kpi-card strong { color: #be123c; font-size: 14px; }
        .tabs-container { display: flex; gap: 20px; border-bottom: 1px solid #e2e8f0; margin: 10px 0; }
        .tab-button { background: none; border: none; padding: 10px 0; cursor: pointer; color: #64748b; font-size: 13px; font-weight: 500; position: relative; }
        .tab-button.active { color: #be123c; font-weight: 700; }
        .tab-button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #be123c; }
        
        .dashboard-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 20px; }
        .card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; }
        .card-title { font-size: 14px; font-weight: 700; margin-bottom: 20px; color: #2b3b1e; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
        
        /* Gráfica de Duración */
        .v-chart-container { height: 240px; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px 10px; border-bottom: 2px solid #f1f5f9;width: 100%;}
        .v-bar-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; width: 140px; }
        .v-bar { width: 120px; border-radius: 8px 8px 0 0; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05);}
        .v-label { margin-top: 15px; font-size: 12px; color: #64748b; font-weight: 600; }
        

        
        .h-chart-row { display: flex; align-items: center; margin-bottom: 10px; }
        .h-label { width: 100px; font-size: 11px; text-align: right; padding-right: 10px; color: #556947; }
        .h-bar-bg { flex: 1; height: 22px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .h-bar-fill { height: 100%; background: #E83A75; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; color: white; font-size: 10px; font-weight: bold; }

    
        .funnel-step { color: white; margin-bottom: 10px; padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; }
        .status-cell { padding: 5px 10px; border-radius: 4px; font-weight: bold; color: white; display: inline-block; min-width: 50px; text-align: center; }
        .dark-table-card { background: #0f172a; border-radius: 12px; overflow: hidden; }
        .dark-table { width: 100%; border-collapse: collapse; color: #f1f5f9; font-size: 12px; }
        .dark-table th { background: #0f172a; color: #94a3b8; padding: 12px; text-align: left; }
        .dark-table td { padding: 12px; border-bottom: 1px solid #1e293b; }
      `}</style>

      <aside className="sidebar">
        <h2 style={{ fontSize: '20px', marginBottom: '30px' }}>CLTIENE</h2>
        <div style={{ fontSize: '12px' }}>
          <p style={{ marginBottom: '5px' }}>PERIODO</p>
          <input type="date" defaultValue="2023-11-28" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px', marginBottom: '10px' }} />
          <input type="date" defaultValue="2024-02-23" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} />
        </div>
      </aside>

      <main className="main">
        <header className="header-banner">
          <h1 style={{ margin: 0, fontSize: '22px' }}>Rendimiento de Asesores y Éxito de Llamadas</h1>
          <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.8 }}>Validación y seguimiento de datos con IA</p>
        </header>

        <section className="kpi-row">
          <div className="kpi-card"><Phone size={18} color="#be123c" /><span>Total</span><strong>3,299</strong></div>
          <div className="kpi-card"><Download size={18} color="#be123c" /><span>Contestadas</span><strong>3,298</strong></div>
          <div className="kpi-card"><CheckCircle size={18} color="#be123c" /><span>Efectivas</span><strong>185</strong></div>
          <div className="kpi-card"><DollarSign size={18} color="#be123c" /><span>Ventas</span><strong>62</strong></div>
          <div className="kpi-card"><Clock size={18} color="#be123c" /><span>Hora</span><strong>9:00</strong></div>
          <div className="kpi-card"><Calendar size={18} color="#be123c" /><span>Día</span><strong>Viernes</strong></div>
          <div className="kpi-card"><Trophy size={18} color="#be123c" /><span>Top</span><strong>Jennifer</strong></div>
          <div className="kpi-card"><Star size={18} color="#be123c" /><span>Calidad</span><strong>12/100</strong></div>
        </section>

        <nav className="tabs-container">
          {tabs.map(tab => (
            <button key={tab} className={`tab-button ${tabActiva === tab ? 'active' : ''}`} onClick={() => setTabActiva(tab)}>{tab}</button>
          ))}
        </nav>

        {tabActiva === 'Resumen Ejecutivo' && (
          <div className="dashboard-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card">
                <div className="card-title">Distribución de Resultados</div>
                {resultados.map((res, i) => (
                  <div key={i} className="h-chart-row">
                    <div className="h-label">{res.nombre}</div>
                    <div className="h-bar-bg"><div className="h-bar-fill" style={{ width: res.ancho }}>{res.valor}</div></div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-title">Distribución por Duración</div>
                <div className="v-chart-container">
                  {datosDuracion.map((item, i) => (
                    <div key={i} className="v-bar-wrapper">
                      <div
                        className="v-bar"
                        style={{
                          height: item.altura,
                          background: item.color
                        }}
                      ></div>
                      <span className="v-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card">
                <div className="card-title">Embudo de conversión</div>
                <div className="funnel-step" style={{ background: '#EE7553' }}><span>Total</span><span>3,299</span></div>
                <div className="funnel-step" style={{ background: '#fb7185', width: '95%' }}><span>Contestadas</span><span>3,298</span></div>
                <div className="funnel-step" style={{ background: '#db2777', width: '75%' }}><span>Efectivas</span><span>185</span></div>
                <div className="funnel-step" style={{ background: '#be123c', width: '55%' }}><span>Ventas</span><span>62</span></div>
              </div>

              <div className="card" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#be123c' }}>Insights con IA</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                  <li>Las llamadas de duración "Media" generan el 60% de las ventas.</li>
                  <li>El rendimiento ha subido un 5% respecto a la semana pasada.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'Rendimiento Asesores' && (
          <div className="rendimiento-view">
            <div className="dark-table-card">
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>Asesor</th><th>Llamadas</th><th>Turnos Prom.</th><th>Palabras</th><th>Efectivas</th><th>Éxito %</th><th>Calidad IA</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: "Melany Camila Ramirez", ll: 422, t: 5.6, p: 237, e: 21, ex: "4.99%", c: 25 },
                    { n: "Maria de Villadiego", ll: 412, t: 5.4, p: 121, e: 14, ex: "3.41%", c: 18 },
                    { n: "Jenifer Andrea Rodriguez", ll: 651, t: 5.1, p: 229, e: 11, ex: "1.69%", c: 12 },
                    { n: "Dayana Alexandra Marulanda", ll: 593, t: 4.4, p: 111, e: 8, ex: "1.35%", c: 8 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.n}</strong></td>
                      <td>{row.ll}</td><td>{row.t}</td><td>{row.p}</td><td>{row.e}</td>
                      <td><span className="status-cell" style={{ background: getColorExito(row.ex) }}>{row.ex}</span></td>
                      <td><span className="status-cell" style={{ background: row.c > 20 ? '#10b981' : row.c > 10 ? '#f59e0b' : '#ef4444' }}>{row.c}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;