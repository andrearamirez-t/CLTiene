import React, { useState } from 'react';
import { ChevronDown, User, Trash2, Search } from "lucide-react";

const ControlesAnalisis = ({ asesores = [], seleccionado, onSeleccionar, onAnalizar, cargando, analizado }) => {
    const [abierto, setAbierto] = useState(false);

    return (
        <div style={{ margin: '20px 0', position: 'relative', zIndex: 1000 }}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                Asesor para análisis IA:
            </span>

            <div style={{ display: 'flex', gap: '12px' }}>

                <div style={{ position: 'relative', flex: 1 }}>
                    <div
                        onClick={() => setAbierto(!abierto)}
                        style={{
                            background: 'linear-gradient(90deg, #FC3276, #FC3276)',
                            color: 'white',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontWeight: '600',
                            height: '40px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={16} />
                            <span>{seleccionado || "Seleccionar Asesor"}</span>
                        </div>
                        <ChevronDown size={18} style={{
                            transform: abierto ? 'rotate(180deg)' : 'none',
                            transition: '0.3s'
                        }} />
                    </div>

                    {abierto && (
                        <div style={{
                            position: 'absolute',
                            top: '105%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            zIndex: 10000,
                            maxHeight: '180px',
                            overflowY: 'auto'
                        }}>
                            {asesores.map((a, i) => {
                                const nombre = a.nombre || a.n || a.asesor;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => { onSeleccionar(nombre); setAbierto(false); }}
                                        style={{
                                            padding: '12px 15px',
                                            color: seleccionado === nombre ? '#FC3276' : '#cbd5e1',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #1e293b'
                                        }}
                                    >
                                        {nombre}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>


                <button
                    onClick={onAnalizar}
                    disabled={cargando}
                    style={{
                        flex: 1,
                        backgroundColor: analizado ? '#FD7751' : '#FC3276',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        height: '40px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {cargando ? (
                        "Procesando..."
                    ) : analizado ? (
                        <>
                            <Trash2 size={16} /> Limpiar Análisis
                        </>
                    ) : (
                        <>
                            <Search size={16} /> Analizar Asesor con IA
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ControlesAnalisis;