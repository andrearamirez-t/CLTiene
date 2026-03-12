import React, { useState, useEffect } from 'react';
import Select from "../Select";

// const FiltrosLateral = ({ score, clasificacion, setClasificacion, setFiltroPalabra, chatData }) => {
const FiltrosLateral = ({ asesorCargado, handleChangeAgent: changeAgent, setFiltroPalabra, chatData }) => {
    const [inputValue, setInputValue] = useState("");
    const [temaBusqueda, setTemaBusqueda] = useState("");
    const [coincidencias, setCoincidencias] = useState(0);
    // const [mostrarLlamadas, setMostrarLlamadas] = useState(false);
    // const [analizando, setAnalizando] = useState(false);


    useEffect(() => {
        if (!temaBusqueda.trim() || !chatData || chatData.length === 0) {
            setCoincidencias(0);
            return;
        }
        const buscar = temaBusqueda.trim();
        const regex = new RegExp(buscar, 'gi');
        const textoChat = chatData.map(m => m.text).join(" ");
        const matches = textoChat.match(regex);
        setCoincidencias(matches ? matches.length : 0);
    }, [temaBusqueda, chatData]);

    // const ejecutarBusquedaAsesor = () => {
    //     if (inputValue.toLowerCase().includes("edwin")) {
    //         setAsesorCargado({
    //             nombre: "Edwin Cendales",
    //             cc: "1013599002",
    //             total: 27,
    //             contactado: 2,
    //             busquedaRealizada: true,
    //             llamadas: [
    //                 { id: "#6205", status: "Sin Contacto", tel: "3202213259" },
    //                 { id: "#6209", status: "Contactado", tel: "3123942839" }
    //             ]
    //         });
    //     }
    // };


    // const manejarAnalisisIA = () => {
    //     setAnalizando(true);

    //     setTimeout(() => {
    //         setAnalizando(false);
    //         alert("Análisis de IA completado para esta llamada");
    //     }, 2000);
    // };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>

            <div>
                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    🔍 BUSCAR POR TELÉFONO O ASESOR:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        // placeholder="Escribe edwin..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontSize: '13px' }}
                    />
                    {/* <button onClick={ejecutarBusquedaAsesor} style={{ padding: '0 15px', backgroundColor: '#626947', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Buscar
                    </button> */}
                </div>
            </div>

            {/* SELECCIONAR LLAMADA */}
            <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Seleccionar llamada:
                </label>
                {/* <div
                    onClick={() => setMostrarLlamadas(!mostrarLlamadas)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#fc3474', color: 'white', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    #617 | Contactado | {asesorCargado?.nombre || "-".split(' ')[0]}
                    <span>{mostrarLlamadas ? "▲" : "▼"}</span>
                </div> */}
                <Select onChange={e => changeAgent(e.target.value)} endPoint="/api/transcripcion/llamadas" name="select-calls" id="select-calls" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#fc3474', color: 'white', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} />
            </div>

            {/* RESALTAR TEMAS */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    🔍 RESALTAR TEMAS (Costos, WhatsApp...)
                </label>
                <input
                    type="text"
                    placeholder="Escribe palabra a buscar..."
                    onChange={(e) => {
                        setFiltroPalabra(e.target.value);
                        setTemaBusqueda(e.target.value);
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />

                {temaBusqueda && (
                    <div style={{ marginTop: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #bae6fd' }}>
                        🔍 Se encontraron {coincidencias} coincidencias
                    </div>
                )}
            </div>

            {/* LASIFICACION Y SCORE */}
            {/* <div>
                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    CLASIFICACIÓN DE GESTIÓN
                </label>
                <select
                    value={clasificacion}
                    onChange={(e) => setClasificacion(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 'bold' }}
                >
                    <option value="venta">✅ Venta / Cierre</option>
                    <option value="casi-venta">⏳ Casi Venta</option>
                    <option value="no-venta">❌ No Venta</option>
                </select>

                <div style={{ textAlign: 'center', border: '1px solid #2ecc71', padding: '15px', borderRadius: '12px', marginTop: '15px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', margin: '0 0 8px 0' }}>** SCORE DE CALIDAD IA **</p>
                    <div style={{ backgroundColor: '#2ecc71', color: 'white', padding: '8px', borderRadius: '25px', fontSize: '11px', fontWeight: 'bold' }}>
                        87/100 - Excelente - Venta
                    </div>
                </div>
            </div> */}

            {/* METRICAS */}
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>👤 Asesor: <b>{asesorCargado?.nombre || "-"}</b></p>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', fontWeight: 'bold' }}>{asesorCargado?.total || "-"} en filtro (1 con trans.)</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#fc3474', fontWeight: 'bold' }}>Contactados: {asesorCargado?.contactado || "-"}</p>
            </div>



        </div>
    );
};

export default FiltrosLateral;