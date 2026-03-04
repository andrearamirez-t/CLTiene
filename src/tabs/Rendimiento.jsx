import React, { useState } from 'react';
import ControlesAnalisis from '../components/ui/ControlesAnalisis';
import GraficaCalidadIA from '../components/ui/GraficaCalidadIA';
import GraficaDistribucion from '../components/ui/GraficaDistribucion';

const Rendimiento = () => {
    const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("todos");
    const [columnaOrden, setColumnaOrden] = useState("llamadas");
    const [mostrarIA, setMostrarIA] = useState(false);
    const [cargandoIA, setCargandoIA] = useState(false);

    
    const datosAsesores = [
        { n: "Melany Camila Ramirez", llamadas: 422, turnos: 5.6, palabras: 21, efectivas: 21, exito: 85, calidad: 95, color: "#22c55e" },
        { n: "Maria de Villadiego", llamadas: 412, turnos: 5.4, palabras: 14, efectivas: 14, exito: 70, calidad: 88, color: "#22c55e" },
        { n: "Jenifer Andrea Rodriguez", llamadas: 651, turnos: 5.1, palabras: 11, efectivas: 11, exito: 45, calidad: 75, color: "#eab308" },
        { n: "Dayana Alexandra Marulanda", llamadas: 593, turnos: 4.4, palabras: 8, efectivas: 8, exito: 30, calidad: 60, color: "#ef4444" }
    ];

    const [datosCalidad, setDatosCalidad] = useState([
        { name: 'Despedida', valor: 368, etiqueta: '368 (11.2%)' },
        { name: 'WhatsApp', valor: 361, etiqueta: '361 (10.9%)' },
        { name: 'Beneficios', valor: 42, etiqueta: '42 (1.3%)' },
        { name: 'Saludo', valor: 221, etiqueta: '221 (6.7%)' }
    ]);

    const [datosDistribucion, setDatosDistribucion] = useState([
        { turnos: 0, frecuencia: 1000 }, { turnos: 2, frecuencia: 650 },
        { turnos: 5, frecuencia: 550 }, { turnos: 8, frecuencia: 400 },
        { turnos: 10, frecuencia: 250 }, { turnos: 15, frecuencia: 250 }
    ]);

    const asesoresFiltrados = [...datosAsesores]
        .filter(a => a.n.toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) => {
            if (orden === "todos") return 0;
            let valA = a[columnaOrden];
            let valB = b[columnaOrden];
            return orden === "mayor" ? valB - valA : valA - valB;
        });

    const ejecutarAnalisisIA = () => {
        if (mostrarIA) {
            setMostrarIA(false);
            setAsesorSeleccionado("");
            return;
        }
        if (!asesorSeleccionado) {
            alert("Por favor, selecciona un asesor primero.");
            return;
        }
        setCargandoIA(true);
        setTimeout(() => {
            setCargandoIA(false);
            setMostrarIA(true);
            setDatosCalidad(prev => prev.map(d => ({ ...d, valor: Math.floor(Math.random() * 350) + 20 })));
            setDatosDistribucion(prev => prev.map(d => ({ ...d, frecuencia: Math.floor(Math.random() * 900) + 100 })));
        }, 800);
    };

    const estiloFiltro = { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', padding: '3px', fontSize: '10px', marginTop: '4px', width: '100%' };
    const estiloBadge = (color) => ({ backgroundColor: color, color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', display: 'inline-block', minWidth: '45px' });

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}> Rendimiento por Agente </h2>

            {/* TABLA */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                            <th style={{ padding: '16px', color: '#64748b' }}>#</th>
                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>Cuenta</span>
                                    <input type="text" placeholder="🔍" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={estiloFiltro} />
                                </div>
                            </th>
                            {['Llamadas', 'Turnos_Prom', 'Palabras_Prom', 'Efectivas', 'Éxito_%', 'Calidad_IA'].map((label, i) => (
                                <th key={i} style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{label}</span>
                                        <select onChange={(e) => { setColumnaOrden(label.toLowerCase().includes('éxito') ? 'exito' : label.toLowerCase().includes('calidad') ? 'calidad' : label.toLowerCase()); setOrden(e.target.value); }} style={estiloFiltro}>
                                            <option value="todos">Todos</option>
                                            <option value="mayor">Mayor a Menor</option>
                                            <option value="menor">Menor a Mayor</option>
                                        </select>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {asesoresFiltrados.map((agente, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '16px', color: '#64748b' }}>{index}</td>
                                <td style={{ padding: '16px', fontWeight: '500' }}>{agente.n}</td>
                                <td style={{ padding: '16px' }}>{agente.llamadas}</td>
                                <td style={{ padding: '16px' }}>{agente.turnos}</td>
                                <td style={{ padding: '16px' }}>{agente.palabras}</td>
                                <td style={{ padding: '16px' }}>{agente.efectivas}</td>
                                <td style={{ padding: '16px' }}><div style={estiloBadge(agente.color)}>{agente.exito}%</div></td>
                                <td style={{ padding: '16px' }}><div style={estiloBadge(agente.color)}>{agente.calidad}%</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DIAGNÓSTICO */}
            {mostrarIA && (
                <div style={{ backgroundColor: '#f0f4ff', border: '1px solid #d1d5db', borderRadius: '12px', padding: '30px', borderLeft: '6px solid #be185d', marginBottom: '24px' }}>
                    <p>1. <strong>**DIAGNÓSTICO:**</strong> {asesorSeleccionado} presenta un rendimiento sólido.</p>
                    <p style={{ color: '#be185d', fontWeight: 'bold', marginTop: '10px' }}>2. FORTALEZAS:</p>
                    <ul style={{ paddingLeft: '20px' }}><li>Excelente cierre de llamadas.</li><li>Consistencia auditada por IA.</li></ul>
                    <p style={{ fontStyle: 'italic', color: '#64748b', marginTop: '10px' }}>Análisis generado para {asesorSeleccionado} ✨</p>
                </div>
            )}

            {/* CONTROLES */}
            <ControlesAnalisis
                asesores={datosAsesores}
                seleccionado={asesorSeleccionado}
                onSeleccionar={setAsesorSeleccionado}
                onAnalizar={ejecutarAnalisisIA}
                cargando={cargandoIA}
                analizado={mostrarIA}
            />

            {/* GRÁFICAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '30px', paddingBottom: '40px' }}>
                <GraficaCalidadIA datos={datosCalidad} />
                <GraficaDistribucion datos={datosDistribucion} />
            </div>
        </div>
    );
};

export default Rendimiento;