import { ChevronDown } from "lucide-react";

function Rendimiento() {

    const getColorExito = (valorStr) => {
        const valor = parseFloat(valorStr);
        if (valor >= 4) return '#10b981';
        if (valor >= 2) return '#f59e0b';
        return '#ef4444';
    };

    return (
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

            <div className="controls-row">
                <div className="selector-pink"><span>Melany Camila Ramirez</span><ChevronDown size={18} /></div>
                <button className="btn-analyze">Analizar Asesor con IA</button>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-title">Calidad del Asesor</div>
                    {[
                        { l: "Despedida", v: "368 (11.2%)", w: "95%", c: "#f43f5e" },
                        { l: "WhatsApp", v: "361 (10.9%)", w: "90%", c: "#e15b64" },
                        { l: "Beneficios", v: "42 (1.3%)", w: "15%", c: "#f87171" },
                        { l: "Saludo", v: "221 (6.7%)", w: "65%", c: "#fb923c" }
                    ].map((q, i) => (
                        <div key={i} className="q-row">
                            <div className="q-name">{q.l}</div>
                            <div className="q-track"><div className="q-fill" style={{ width: q.w, background: q.c }}>{q.v}</div></div>
                        </div>
                    ))}
                </div>
                <div className="card">
                    <div className="card-title">Distribución de Turnos</div>
                    <div style={{ paddingLeft: '30px' }}>
                        <div className="histo-container">
                            {[100, 70, 55, 40, 25, 15, 8, 4].map((h, i) => (
                                <div key={i} className="histo-bar" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: '#94a3b8' }}>
                            <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rendimiento