import React from 'react';

const EmbudoChart = () => {
    const pasos = [
        { nombre: "Total llamadas", valor: "3,299", porcentaje: "100.0% del total", width: "100%" },
        { nombre: "Contestadas", valor: "3,298", porcentaje: "100.0% del total", width: "100%" },
        { nombre: "Efectivas (contacto)", valor: "185", porcentaje: "5.6% del total", width: "40%" },
        { nombre: "Conv > 30s", valor: "2,056", porcentaje: "62.3% del total", width: "65%" },
        { nombre: "Con Saludo", valor: "221", porcentaje: "6.7% del total", width: "45%" },
        { nombre: "Ventas", valor: "62", porcentaje: "1.9% del total", width: "35%" },
    ];

    const baseStyle = {
        background: 'linear-gradient(to right, #822BD2, #408DFF)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '10px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'width 0.3s ease'
    };

    return (
        <div className="card">
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
                Embudo de conversión
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pasos.map((paso, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        
                        <div style={{ width: '75%' }}>
                            <div style={{ ...baseStyle, width: paso.width }}>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '5px' }}>
                                    {paso.nombre}
                                </span>
                                <span>{paso.valor}</span>
                            </div>
                        </div>
                        
                       
                        <div style={{ width: '25%', paddingLeft: '10px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                {paso.porcentaje}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmbudoChart;