import { API_BASE } from '../config';
﻿import React, { useEffect, useState, useRef } from 'react';
import ControlesAnalisis from '../components/ui/ControlesAnalisis';
import GraficaCalidadIA from '../components/ui/GraficaCalidadIA';
import GraficaDistribucion from '../components/ui/GraficaDistribucion';
import { useFilters } from '../FiltersContext';

const Rendimiento = () => {

    const [rendimiento, setRendimiento] = useState([]);
    const { filters, buildQuery } = useFilters();
    const esServicio = filters.tipo_llamada?.toLowerCase() === 'servicio';

    const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("todos");
    const [columnaOrden, setColumnaOrden] = useState("llamadas");

    const [mostrarIA, setMostrarIA] = useState(false);
    const [cargandoIA, setCargandoIA] = useState(false);

    // const [datosCalidad, setDatosCalidad] = useState([]);
    // const [datosDistribucion, setDatosDistribucion] = useState([]);
    const [diagnosticoIA, setDiagnosticoIA] = useState("");
    const iaRef = useRef(null);

    useEffect(() => {
        if (iaRef.current) {
            iaRef.current.innerHTML = mostrarIA ? diagnosticoIA.replace(/\n/g, "<br/>") : '';
        }
    }, [mostrarIA, diagnosticoIA]);



    // CARGAR RENDIMIENTO DESDE API
    useEffect(() => {

        const params = buildQuery() || "";

        fetch(`${API_BASE}/api/rendimiento_agente${params ? `?${params}` : ""}`)
            .then(res => res.json())
            .then(data => {
                setRendimiento(data || []);
            });

    }, [filters]);



    const datosAsesores = rendimiento;



    // FILTRO Y ORDEN
    const asesoresFiltrados = [...datosAsesores]
        .filter(a => (a.n || "").toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) => {

            if (orden === "todos") return 0;

            let valA = a[columnaOrden];
            let valB = b[columnaOrden];

            return orden === "mayor"
                ? valB - valA
                : valA - valB;

        });



    // ANALISIS IA
    const ejecutarAnalisisIA = async () => {

        if (!asesorSeleccionado) {
            alert("Selecciona un asesor primero");
            return;
        }

        setCargandoIA(true);

        try {

            const params = buildQuery();
            const sep = params ? '&' : '?';
            const response = await fetch(`${API_BASE}/ia/analizar_asesor?asesor=${encodeURIComponent(asesorSeleccionado)}${params ? sep + params : ''}`);

            const result = await response.json();
            const data = result.result

            // setDatosCalidad(data.calidad || []);
            // setDatosDistribucion(data.distribucion || []);
            const raw = data || "";
            setDiagnosticoIA(raw
                .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
                .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
                .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0'));

            setMostrarIA(true);

        } catch (error) {

            console.error("Error analizando asesor:", error);

        }

        setCargandoIA(false);

    };



    const estiloFiltro = {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '4px',
        color: 'white',
        padding: '3px',
        fontSize: '10px',
        marginTop: '4px',
        width: '100%'
    };



    const fmtTMO = (seg) => {
        const s = Number(seg) || 0;
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
        return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    };

    const colorBadge = (val) => {
        if (val === 0 || val === null || val === undefined) return '#94a3b8';
        if (val < 2) return '#ef4444';
        if (val < 5) return '#f97316';
        return '#22c55e';
    };

    const estiloBadge = (val) => ({
        backgroundColor: colorBadge(val),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '11px',
        textAlign: 'center',
        display: 'inline-block',
        minWidth: '45px'
    });



    return (

        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '20px'
            }}>
                Rendimiento por Agente
            </h2>



            {/* TABLA */}

            <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}>

                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    color: '#cbd5e1',
                    fontSize: '13px'
                }}>

                    <thead>

                        <tr style={{
                            borderBottom: '1px solid #1e293b',
                            textAlign: 'left'
                        }}>

                            <th style={{ padding: '16px', color: '#64748b' }}>#</th>

                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>Cuenta</span>
                                    <input
                                        type="text"
                                        placeholder="🔍"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        style={estiloFiltro}
                                    />
                                </div>
                            </th>


                            {['Llamadas', 'TMO', 'Calidad /100', '% Efectividad', ...(!esServicio ? ['% Ventas'] : [])]
                                .map((label, i) => (

                                    <th key={i} style={{ padding: '12px 16px' }}>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                            <span>{label}</span>

                                            <select
                                                onChange={(e) => {

                                                    setColumnaOrden(
                                                        label.includes('Calidad') ? 'score_calidad' : label === 'TMO' ? 'tmo_seg' : label.includes('Efectividad') ? 'contacto_pct' : label.includes('Ventas') ? 'tasa_venta' : label.toLowerCase()
                                                    );

                                                    setOrden(e.target.value);

                                                }}
                                                style={estiloFiltro}
                                            >

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

                                <td style={{ padding: '16px', color: '#64748b' }}>
                                    {index + 1}
                                </td>

                                <td style={{ padding: '16px', fontWeight: '500' }}>
                                    {agente.n}
                                </td>

                                <td style={{ padding: '16px' }}>{agente.llamadas}</td>
                                <td style={{ padding: '16px' }}>{fmtTMO(agente.tmo_seg)}</td>
                                <td style={{ padding: '16px' }}>{agente.score_calidad}</td>
                                <td style={{ padding: '16px' }}>{agente.contacto_pct + '%'}</td>

                                {!esServicio && (
                                    <td style={{ padding: '16px' }}>
                                        <div style={estiloBadge(agente.tasa_venta)}>
                                            {agente.tasa_venta}%
                                        </div>
                                    </td>
                                )}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>



            {/* DIAGNÓSTICO IA */}

            {mostrarIA && (

                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '36px 40px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    marginBottom: '24px'
                }}>

                    <div style={{
                        borderLeft: '5px solid #FC3276',
                        paddingLeft: '20px',
                        marginBottom: '28px',
                        background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
                        borderRadius: '0 10px 10px 0',
                        padding: '14px 20px',
                    }}>
                        <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#FC3276', marginBottom: '4px' }}>
                            🔍 Análisis del Asesor
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {asesorSeleccionado}
                        </span>
                    </div>

                    <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}
                        dangerouslySetInnerHTML={{ __html: diagnosticoIA }} />

                </div>

            )}



            {/* CONTROLES */}

            <ControlesAnalisis
                asesores={datosAsesores}
                seleccionado={asesorSeleccionado}
                onSeleccionar={setAsesorSeleccionado}
                onAnalizar={ejecutarAnalisisIA}
                onLimpiar={() => { setMostrarIA(false); setDiagnosticoIA(""); }}
                cargando={cargandoIA}
                analizado={mostrarIA}
            />



            {/* GRÁFICAS */}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginTop: '30px',
                paddingBottom: '40px'
            }}>

                {/* <GraficaCalidadIA datos={datosCalidad} /> */}
                {/* <GraficaDistribucion datos={datosDistribucion} /> */}

            </div>

        </div>

    );

};

export default Rendimiento;


