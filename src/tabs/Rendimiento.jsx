import React, { useEffect, useState } from 'react';
import ControlesAnalisis from '../components/ui/ControlesAnalisis';
import GraficaCalidadIA from '../components/ui/GraficaCalidadIA';
import GraficaDistribucion from '../components/ui/GraficaDistribucion';
import { useFilters } from '../FiltersContext';

const Rendimiento = () => {

    const [rendimiento, setRendimiento] = useState([]);
    const { filters, buildQuery } = useFilters();

    const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("todos");
    const [columnaOrden, setColumnaOrden] = useState("llamadas");

    const [mostrarIA, setMostrarIA] = useState(false);
    const [cargandoIA, setCargandoIA] = useState(false);

    const [datosCalidad, setDatosCalidad] = useState([]);
    const [datosDistribucion, setDatosDistribucion] = useState([]);
    const [diagnosticoIA, setDiagnosticoIA] = useState("");



    // CARGAR RENDIMIENTO DESDE API
    useEffect(() => {

        const params = buildQuery() || "";

        fetch(`http://localhost:8000/api/rendimiento_agente${params ? `?${params}` : ""}`)
            .then(res => res.json())
            .then(data => {
                console.log("API rendimiento:", data);
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

            const response = await fetch("http://localhost:8000/api/analisis_asesor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    asesor: asesorSeleccionado
                })
            });

            const data = await response.json();

            setDatosCalidad(data.calidad || []);
            setDatosDistribucion(data.distribucion || []);
            setDiagnosticoIA(data.diagnostico || "");

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



    const estiloBadge = (color) => ({
        backgroundColor: color,
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


                            {['Llamadas', 'Turnos', 'Palabras', 'Efectivas', 'Éxito_%', 'Calidad_IA']
                                .map((label, i) => (

                                    <th key={i} style={{ padding: '12px 16px' }}>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                            <span>{label}</span>

                                            <select
                                                onChange={(e) => {

                                                    setColumnaOrden(
                                                        label.toLowerCase().includes('éxito')
                                                            ? 'exito'
                                                            : label.toLowerCase().includes('calidad')
                                                                ? 'calidad'
                                                                : label.toLowerCase()
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
                                <td style={{ padding: '16px' }}>{agente.turnos}</td>
                                <td style={{ padding: '16px' }}>{agente.palabras}</td>
                                <td style={{ padding: '16px' }}>{agente.efectivas}</td>

                                <td style={{ padding: '16px' }}>
                                    <div style={estiloBadge(agente.color)}>
                                        {agente.exito}%
                                    </div>
                                </td>

                                <td style={{ padding: '16px' }}>
                                    <div style={estiloBadge(agente.color)}>
                                        {agente.calidad}%
                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>



            {/* DIAGNÓSTICO IA */}

            {mostrarIA && (

                <div style={{
                    backgroundColor: '#f0f4ff',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '30px',
                    borderLeft: '6px solid #be185d',
                    marginBottom: '24px'
                }}>

                    <div style={{ whiteSpace: "pre-wrap" }}>
                        {diagnosticoIA}
                    </div>

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

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginTop: '30px',
                paddingBottom: '40px'
            }}>

                <GraficaCalidadIA datos={datosCalidad} />
                <GraficaDistribucion datos={datosDistribucion} />

            </div>

        </div>

    );

};

export default Rendimiento;