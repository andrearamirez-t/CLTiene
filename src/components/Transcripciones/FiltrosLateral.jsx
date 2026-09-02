import React, { useState, useEffect } from 'react';
import Select from "../Select";
import { API_BASE, apiFetch } from '../../config';

const FiltrosLateral = ({ asesorCargado, changeAgent, inputValue, changeFilter, setFiltroPalabra, chatData, cuentaActual }) => {
    const [temaBusqueda, setTemaBusqueda] = useState("");
    const [coincidencias, setCoincidencias] = useState(0);
    const [historial, setHistorial] = useState([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    const esTelefono = (v) => /^\d{7,15}$/.test(v.trim());
    // Teléfono activo: lo que el usuario escribió, o el de la llamada seleccionada
    const telefonoActivo = esTelefono(inputValue) ? inputValue.trim() : (cuentaActual || null);

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

    useEffect(() => {
        if (!telefonoActivo) {
            setHistorial([]);
            return;
        }
        setCargandoHistorial(true);
        apiFetch(`${API_BASE}/api/transcripcion/historial/${telefonoActivo}`)
            .then(r => r.json())
            .then(data => setHistorial(Array.isArray(data) ? data : []))
            .catch(() => setHistorial([]))
            .finally(() => setCargandoHistorial(false));
    }, [telefonoActivo]);

    const colorResultado = (res) => {
        if (!res) return '#94a3b8';
        const r = res.toLowerCase();
        if (r.includes('venta')) return '#16a34a';
        if (r.includes('contact')) return '#2563eb';
        if (r.includes('rechazo') || r.includes('sin contacto')) return '#dc2626';
        return '#64748b';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>

            <div>
                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    🔍 BUSCAR POR TELÉFONO O ASESOR:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            changeFilter(value);
                            if (!esTelefono(value)) changeAgent(value);
                        }}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontSize: '13px' }}
                    />
                </div>
            </div>

            {/* HISTORIAL POR TELÉFONO */}
            {telefonoActivo && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                        📋 HISTORIAL DE LLAMADAS — {telefonoActivo}
                    </label>
                    {cargandoHistorial ? (
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Cargando...</p>
                    ) : historial.length === 0 ? (
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>No se encontraron llamadas para este número.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                            {historial.map((h, i) => (
                                <div
                                    key={i}
                                    onClick={() => h.tiene_transcripcion && changeAgent(h.id)}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: h.tiene_transcripcion ? '#ffffff' : '#f8fafc',
                                        cursor: h.tiene_transcripcion ? 'pointer' : 'default',
                                        transition: 'box-shadow 0.15s',
                                    }}
                                    onMouseEnter={e => { if (h.tiene_transcripcion) e.currentTarget.style.boxShadow = '0 2px 8px rgba(252,50,118,0.18)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b' }}>#{h.id} · {h.fecha}</span>
                                        <span style={{
                                            fontSize: '10px', fontWeight: '700', color: 'white',
                                            backgroundColor: colorResultado(h.resultado),
                                            padding: '2px 7px', borderRadius: '20px',
                                        }}>{h.resultado}</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{h.asesor}</div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                                        ⏱ {h.duracion} · {h.duracion_est}
                                        {!h.tiene_transcripcion && <span style={{ color: '#f59e0b', marginLeft: '6px' }}>sin transcripción</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SELECCIONAR LLAMADA */}
            {!esTelefono(inputValue) && (
                <div style={{ position: 'relative' }}>
                    <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                        Seleccionar llamada:
                    </label>
                    <Select depsUseEffect={[]} selected={e => e.target.value} onChange={e => changeAgent(e.target.value)} endPoint="/api/transcripcion/llamadas" name="select-calls" id="select-calls" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#fc3474', color: 'white', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} />
                </div>
            )}

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

            {/* MÉTRICAS */}
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>👤 Asesor: <b>{asesorCargado?.nombre || "-"}</b></p>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', fontWeight: 'bold' }}>{asesorCargado?.total || "-"} en filtro (1 con trans.)</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#fc3474', fontWeight: 'bold' }}>Contactados: {asesorCargado?.contactado || "-"}</p>
            </div>

        </div>
    );
};

export default FiltrosLateral;
