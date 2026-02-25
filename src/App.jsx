import React, { useState } from 'react';
import { Phone, Download, CheckCircle, DollarSign, Clock, Calendar, Trophy, Star, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';

import "./css/style.css"
import Resumen from './tabs/Resumen';
import Rendimiento from './tabs/Rendimiento';
import Analisis from './tabs/Analisis';
import Inteligencia from './tabs/Inteligencia';
import Transcripciones from './tabs/Transcripciones';
import Agente from './tabs/Agente';

function App() {
  const [tabActiva, setTabActiva] = useState('Resumen Ejecutivo');

  const tabs = ['Resumen Ejecutivo', 'Rendimiento Asesores', 'Análisis Detallado', 'Inteligencia Operativa', 'Transcripciones', 'Agente IA PRO'];

  

 

  return (
    <div className="dashboard-container">

      <Sidebar />

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
          <div className="kpi-card"><Trophy size={18} color="#be123c" /><span>Saludo</span><strong>7%</strong></div>
          <div className="kpi-card"><Star size={18} color="#be123c" /><span>Calidad</span><strong>12/100</strong></div>
        </section>

        <nav className="tabs-container">
          {tabs.map(tab => (
            <button key={tab} className={`tab-button ${tabActiva === tab ? 'active' : ''}`} onClick={() => setTabActiva(tab)}>{tab}</button>
          ))}
        </nav>

        {tabActiva == "Resumen Ejecutivo" && (<Resumen tabName={tabActiva} />)}
        {tabActiva == "Rendimiento Asesores" && (<Rendimiento tabName={tabActiva} />)}
        {tabActiva == "Análisis Detallado" && (<Analisis />)}
        {tabActiva == "Inteligencia Operativa" && (<Inteligencia tabName={tabActiva} />)}
        {tabActiva == "Transcripciones" && (<Transcripciones tabName={tabActiva} />)}
        {tabActiva == "Agente IA PRO" && (<Agente tabName={tabActiva} />)}


        


        {tabActiva === 'Análisis Detallado' && (
          <div className="analisis-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="dashboard-grid">
              {/* Planes Mencionados */}
              <div className="card">
                <div className="card-title">Planes Mencionados</div>
                {[
                  { n: "No Identificado", v: "2,113 (64.1%)", w: "90%" },
                  { n: "Plan Mascotas", v: "733 (22.2%)", w: "35%" },
                  { n: "Plan Salud", v: "185 (5.6%)", w: "15%" },
                  { n: "Plan Movilidad", v: "144 (4.4%)", w: "12%" },
                  { n: "Plan Vivienda", v: "111 (3.4%)", w: "8%" }
                ].map((p, i) => (
                  <div key={i} className="h-chart-row">
                    <div className="h-label" style={{ width: '120px' }}>{p.n}</div>
                    <div className="h-bar-bg"><div className="h-bar-fill" style={{ width: p.w, background: '#EE7553' }}>{p.v}</div></div>
                  </div>
                ))}
              </div>

              {/* Motivos de Rechazo */}
              <div className="card">
                <div className="card-title">Motivos de Rechazo</div>
                {[
                  { n: "No Interesa", v: "333 (51.2%)", w: "80%" },
                  { n: "Sin Motivo", v: "166 (25.5%)", w: "40%" },
                  { n: "Ya Tiene Servicio", v: "11 (1.7%)", w: "5%" },
                  { n: "Precio", v: "2 (0.3%)", w: "2%" },
                  { n: "No Aplica", v: "2 (0.3%)", w: "2%" },
                  { n: "Otro", v: "103 (61.3%)", w: "80%" }
                ].map((m, i) => (
                  <div key={i} className="h-chart-row">
                    <div className="h-label" style={{ width: '120px' }}>{m.n}</div>
                    <div className="h-bar-bg"><div className="h-bar-fill" style={{ width: m.w, background: '#f87171' }}>{m.v}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Mascotas con números internos */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="card-title">Tipo de Mascota</div>
                <div className="pie-placeholder" style={{
                  background: 'conic-gradient(#f43f5e 0% 70%, #fb923c 70% 85%, #fda4af 85% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px'
                }}>
                  <span style={{ position: 'absolute', top: '40px', left: '60px' }}>70%</span>
                  <span style={{ position: 'absolute', top: '80px', right: '20px', fontSize: '10px' }}>15%</span>
                </div>
                <div className="pie-legend">
                  <span><span className="dot" style={{ backgroundColor: '#f43f5e' }}></span> No especificado </span>
                  <span><span className="dot" style={{ backgroundColor: '#f43f5e' }}></span> Perro </span>
                  <span><span className="dot" style={{ backgroundColor: '#fb923c' }}></span> Ambos </span>
                  <span><span className="dot" style={{ backgroundColor: '#fda4af' }}></span> Gato </span>
                </div>
              </div>

              {/* Vehículos con números internos */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="card-title">Tipo de Vehículo</div>
                <div className="pie-placeholder" style={{
                  background: 'conic-gradient(#db2777 0% 50%, #f472b6 50% 80%, #fbcfe8 80% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px'
                }}>
                  <span style={{ position: 'absolute', top: '50px', left: '35px' }}>50%</span>
                  <span style={{ position: 'absolute', top: '40px', right: '35px', fontSize: '12px' }}>30%</span>
                </div>
                <div className="pie-legend">
                  <span><span className="dot" style={{ backgroundColor: '#f43f5e' }}></span> No especificado </span>
                  <span><span className="dot" style={{ backgroundColor: '#db2777' }}></span> Carro </span>
                  <span><span className="dot" style={{ backgroundColor: '#f472b6' }}></span> Moto </span>
                  <span><span className="dot" style={{ backgroundColor: '#fbcfe8' }}></span> Ambos </span>
                </div>
              </div>
            </div>

            <button className="btn-analyze" style={{ width: '100%', padding: '15px', fontSize: '14px' }}>Análisis Profundo IA - Patrones de Ventas</button>
          </div>
        )}


        {tabActiva === 'Inteligencia Operativa' && (
          <div className="operativa-view" style={{ padding: '20px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* PRIMERA FILA: HORA Y DÍA */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
              {/* RENDIMIENTO POR HORA */}
              <div className="card" style={{ flex: 1, minWidth: '450px', padding: '15px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '30px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Rendimiento por Hora</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 35px 40px 35px' }}>
                  <div style={{ position: 'absolute', top: '-25px', left: '0', display: 'flex', gap: '15px', fontSize: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: '#e11d48' }}></div> Total Llamadas
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '10px', height: '2px', backgroundColor: '#10b981' }}></div> % Efectivas
                    </span>
                  </div>
                  <div style={{ position: 'absolute', left: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#999' }}>
                    <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
                  </div>
                  <div style={{ position: 'absolute', right: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>
                    <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                  </div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 1 }}>
                    {[0, 0, 0, 2, 1, 5, 215, 413, 317, 487, 361, 139, 321, 370, 354, 150, 55, 10, 21, 15, 5, 2].map((v, i) => (
                      <div key={i} style={{ width: '3%', height: `${(v / 500) * 100}%`, backgroundColor: '#e11d48' }}></div>
                    ))}
                  </div>
                  <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, overflow: 'visible' }}>
                    <polyline points="0,220 30,218 60,10 90,210 120,205 150,200 180,190 210,200 240,210 270,215 300,220" fill="none" stroke="#10b981" strokeWidth="2" />
                    <text x="50" y="25" fill="#10b981" fontSize="10" fontWeight="bold">50.0%</text>
                    <text x="140" y="185" fill="#10b981" fontSize="9">5.3%</text>
                  </svg>
                  <div style={{ position: 'absolute', bottom: '-20px', width: '100%', textAlign: 'center', fontSize: '10px', color: '#999' }}>Hora</div>
                </div>
              </div>

              {/* RENDIMIENTO POR DÍA */}
              <div className="card" style={{ flex: 1, minWidth: '450px', padding: '15px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '30px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Rendimiento por Día</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 35px 40px 35px' }}>
                  <div style={{ position: 'absolute', left: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#999' }}>
                    <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span>
                  </div>
                  <div style={{ position: 'absolute', right: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>
                    <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                  </div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 1 }}>
                    {[{ d: 'Lun', v: 528 }, { d: 'Mar', v: 558 }, { d: 'Mie', v: 411 }, { d: 'Jue', v: 462 }, { d: 'Vie', v: 831 }, { d: 'Sab', v: 425 }, { d: 'Dom', v: 84 }].map((day, i) => (
                      <div key={i} style={{ width: '12%', height: `${(day.v / 900) * 100}%`, backgroundColor: '#e11d48', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <span style={{ color: 'white', fontSize: '9px', fontWeight: 'bold' }}>{day.v}</span>
                        <span style={{ position: 'absolute', bottom: '-20px', fontSize: '10px', color: '#666' }}>{day.d}</span>
                      </div>
                    ))}
                  </div>
                  <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, overflow: 'visible' }}>
                    <polyline points="20,200 80,160 140,120 200,90 260,130 320,170 380,30" fill="none" stroke="#10b981" strokeWidth="2" />
                    <circle cx="200" cy="90" r="3" fill="#10b981" />
                    <text x="190" y="80" fill="#10b981" fontSize="10" fontWeight="bold">7.1%</text>
                    <circle cx="380" cy="30" r="3" fill="#10b981" />
                    <text x="370" y="20" fill="#10b981" fontSize="10" fontWeight="bold">8.3%</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* SEGUNDA FILA: VENTAS VS SERVICIO Y SUBJETIVIDAD */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Ventas vs Servicio</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', paddingLeft: '60px' }}>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#e11d48' }}></div> Total</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#10b981' }}></div> Efectivas</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[{ label: 'ventas', total: 813, efec: 53, tW: '45%', eW: '10%' }, { label: 'servicio', total: 706, efec: 38, tW: '40%', eW: '8%' }, { label: 'mixto', total: 1780, efec: 94, tW: '95%', eW: '15%' }].map((item, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '-60px', top: '10px', fontSize: '11px', color: '#666' }}>{item.label}</span>
                        <div style={{ height: '18px', width: item.eW, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '0 2px 2px 0' }}>{item.efec}</div>
                        <div style={{ height: '18px', width: item.tW, backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '0 2px 2px 0' }}>{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Subjetividad vs Confianza</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 40px' }}>
                  <div style={{ position: 'absolute', right: '-10px', top: '0', fontSize: '10px' }}>
                    <div style={{ color: '#ccc' }}>Módulo</div>
                    <div style={{ color: '#fda4af' }}>● ASISTENCIA</div>
                    <div style={{ color: '#6ee7b7' }}>● CRM</div>
                  </div>
                  <div style={{ position: 'absolute', left: '-30px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
                    <span>1</span><span>0</span><span>-1</span>
                  </div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', borderBottom: '1px solid #eee' }}>
                    <div style={{ position: 'absolute', top: '50%', width: '100%', borderTop: '1.5px solid #333' }}></div>
                  </div>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', backgroundColor: 'white', border: '2px solid #10b981', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}></div>
                </div>
              </div>
            </div>

            {/* TERCERA FILA: DESEMPEÑO Y EVOLUCIÓN */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Desempeño Asesor</h4>
                </div>
                <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ width: '10%', height: '100%', backgroundColor: '#f59e0b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontSize: '9px', fontWeight: 'bold', transform: 'rotate(-90deg)' }}>100%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Evolución Ventas</h4>
                </div>
                <div style={{ position: 'relative', height: '200px' }}>
                  <svg style={{ width: '100%', height: '100%' }}>
                    <path d="M0,150 L100,100 L200,50 L300,120 L400,110 L400,200 L0,200 Z" fill="#fce7f3" />
                    <polyline points="0,150 100,100 200,50 300,120 400,110" fill="none" stroke="#db2777" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}



       

      </main>
    </div>
  );
}

export default App;