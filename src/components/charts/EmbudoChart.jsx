import React, { useState } from 'react';

const EmbudoChart = () => {
    const [hoverIndex, setHoverIndex] = useState(null);

    const pasos = [
        { nombre: "Total llamadas", valor: 3299, porcentaje: "100.0% del total" },
        { nombre: "Contestadas", valor: 3298, porcentaje: "100.0% del total" },
        { nombre: "Efectivas (contacto)", valor: 185, porcentaje: "5.6% del total" },
        { nombre: "Conv > 30s", valor: 2056, porcentaje: "62.3% del total" },
        { nombre: "Con Saludo", valor: 221, porcentaje: "6.7% del total" },
        { nombre: "Ventas", valor: 62, porcentaje: "1.9% del total" },
    ];

    const maxValor = Math.max(...pasos.map(p => p.valor));

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '20px', paddingBottom: '10px' }}>
                Embudo de conversión
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pasos.map((paso, i) => {
                    const widthPercent = (paso.valor / maxValor) * 100;

                    return (
                        <div 
                            key={i} 
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'default' }}
                        >
                            <div style={{ width: '75%' }}>
                                <div style={{ 
                                    width: `${widthPercent}%`,
                                    background: 'linear-gradient(to right, #FC3276, #FD7751)', 
                                    borderRadius: '12px', 
                                    padding: '10px 18px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.4s ease',
                                    boxShadow: hoverIndex === i ? '0 4px 12px rgba(252, 50, 118, 0.3)' : 'none',
                                    transform: hoverIndex === i ? 'scale(1.02)' : 'scale(1)',
                                    minWidth: 'fit-content' 
                                }}>

                                    <span style={{ 
                                        color: '#ffffff', 
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {paso.nombre}
                                    </span>

                                   
                                    <span style={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                                        color: '#ffffff', 
                                        padding: '2px 10px', 
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        marginLeft: '15px',
                                        textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
                                    }}>
                                        {paso.valor.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ width: '25%', paddingLeft: '12px' }}>
                                <span style={{ 
                                    fontSize: '10px', 
                                    color: hoverIndex === i ? '#FC3276' : '#94a3b8', 
                                    fontWeight: '600'
                                }}>
                                    {paso.porcentaje}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmbudoChart;