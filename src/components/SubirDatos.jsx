import React, { useState, useEffect, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

import { API_BASE } from "../config";

const SubirDatos = () => {
    const [estado, setEstado] = useState(null);
    const [polling, setPolling] = useState(false);
    const logsRef = useRef(null);

    useEffect(() => {
        if (!polling) return;
        const id = setInterval(async () => {
            const res = await fetch(`${API_BASE}/api/upload/estado`);
            const data = await res.json();
            setEstado(data);
            if (!data.corriendo) setPolling(false);
        }, 2000);
        return () => clearInterval(id);
    }, [polling]);

    useEffect(() => {
        if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }, [estado?.logs]);

    const iniciar = async () => {
        setEstado({ corriendo: true, logs: ['Iniciando...'], error: null, filas: null });
        setPolling(true);
        await fetch(`${API_BASE}/api/upload/iniciar`, { method: 'POST' });
    };

    const terminado = estado && !estado.corriendo && estado.logs.length > 0;
    const exito = terminado && !estado.error;

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '30px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Upload size={22} color="#be123c" />
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Subir datos a BigQuery</h2>
            </div>

            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                Extrae los registros desde el SQL Server de la CUN, los procesa y los sube a BigQuery
                reemplazando la tabla actual.
            </p>

            <button
                onClick={iniciar}
                disabled={estado?.corriendo}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: estado?.corriendo ? '#94a3b8' : '#be123c',
                    color: 'white', border: 'none', borderRadius: 8,
                    padding: '10px 22px', fontSize: 14, fontWeight: 600,
                    cursor: estado?.corriendo ? 'not-allowed' : 'pointer'
                }}
            >
                {estado?.corriendo
                    ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Procesando...</>
                    : <><Upload size={16} /> Iniciar carga</>
                }
            </button>

            {estado && (
                <div style={{ marginTop: 24 }}>
                    {exito && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', marginBottom: 12, fontWeight: 600 }}>
                            <CheckCircle size={18} /> Carga completada exitosamente
                        </div>
                    )}
                    {estado.error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>
                            <AlertCircle size={18} /> Error: {estado.error}
                        </div>
                    )}

                    <div
                        ref={logsRef}
                        style={{
                            background: '#0f172a', color: '#94a3b8',
                            borderRadius: 8, padding: '14px 16px',
                            fontFamily: 'monospace', fontSize: 12,
                            height: 260, overflowY: 'auto', lineHeight: 1.7
                        }}
                    >
                        {estado.logs.map((l, i) => (
                            <div key={i} style={{ color: l.startsWith('ERROR') ? '#f87171' : '#94a3b8' }}>
                                {'>'} {l}
                            </div>
                        ))}
                        {estado.corriendo && <div style={{ color: '#38bdf8' }}>{'>'} ...</div>}
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default SubirDatos;