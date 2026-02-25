function Analisis() {

    return (<div className="analisis-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          </div>);
}

export default Analisis

