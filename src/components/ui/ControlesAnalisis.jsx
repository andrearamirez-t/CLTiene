import React, { useState } from 'react';
import { ChevronDown, User } from "lucide-react";

const ControlesAnalisis = ({ asesores = [], seleccionado, onSeleccionar }) => {
    const [abierto, setAbierto] = useState(false);

    
    if (!asesores || !Array.isArray(asesores)) {
        return <div style={{ color: '#64748b', fontSize: '12px', padding: '10px' }}>Cargando datos...</div>;
    }

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
                            background: 'linear-gradient(90deg, #ec4899, #db2777)',
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
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#0f172a', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            marginTop: '4px',
                            zIndex: 10000,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }}>
                            {asesores.map((a, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => {
                                        onSeleccionar(a.n);
                                        setAbierto(false);
                                    }}
                                    style={{
                                        padding: '12px 15px',
                                        color: seleccionado === a.n ? '#ec4899' : '#cbd5e1',
                                        backgroundColor: seleccionado === a.n ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        borderBottom: '1px solid #1e293b'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1e293b'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = seleccionado === a.n ? 'rgba(236, 72, 153, 0.1)' : 'transparent'}
                                >
                                    {a.n}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button style={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #be185d, #9d174d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>
                    Analizar Asesor con IA
                </button>
            </div>
        </div>
    );
};

export default ControlesAnalisis;