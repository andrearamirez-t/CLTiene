import React from 'react';

const DuracionChart = () => {
    const datos = [
        { label: "Buzón", valor: "753", porcentaje: "22.8%", color: "#EE7553" },
        { label: "Muy Corta", valor: "490", porcentaje: "14.9%", color: "#EC635F" },
        { label: "Corta", valor: "733", porcentaje: "22.2%", color: "#EB526A" },
        { label: "Media", valor: "1,017", porcentaje: "30.8%", color: "#E94176" },
        { label: "Larga", valor: "306", porcentaje: "9.3%", color: "#E83081" },
    ];

    const maxValor = 1100; 

    return (
        <div className="card">
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '15px' }}>
                Distribución por Duración
            </div>
            
           
            <div style={{ 
                height: '220px', 
                position: 'relative', 
                marginTop: '30px', 
                paddingBottom: '30px',
                paddingLeft: '45px', 
                marginRight: '10px'
            }}>
                
                {/* Rejilla de fondo */}
                <div style={{ 
                    position: 'absolute', 
                    width: 'calc(100% - 55px)', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    left: '45px'
                }}>
                    {[1000, 800, 600, 400, 200, 0].map(val => (
                        <div key={val} style={{ borderBottom: '1px solid #f1f5f9', width: '100%', position: 'relative' }}>
                            <span style={{ 
                                position: 'absolute', 
                                left: '-40px',  
                                top: '-8px', 
                                fontSize: '10px', 
                                color: '#94a3b8',
                                width: '30px',
                                textAlign: 'right'
                            }}>{val}</span>
                        </div>
                    ))}
                </div>

                
                <div style={{ 
                    position: 'relative', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-around'
                }}>
                    {datos.map((item, i) => {
                        const valorNum = parseInt(item.valor.replace(',', ''));
                        const alturaPx = (valorNum / maxValor) * 100;

                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16%', height: '100%', justifyContent: 'flex-end' }}>
                                <div style={{ 
                                    fontSize: '9px', 
                                    fontWeight: 'bold', 
                                    marginBottom: '5px',
                                    color: 'white',
                                    position: 'absolute',
                                    bottom: `${alturaPx / 2}%`,  
                                    zIndex: 2,
                                    textAlign: 'center',
                                    width: '100%',
                                    pointerEvents: 'none'
                                }}>
                                    {item.valor}<br/>({item.porcentaje})
                                </div>

                                <div style={{ 
                                    height: `${alturaPx}%`, 
                                    width: '100%', 
                                    backgroundColor: item.color, 
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative',
                                    transition: 'height 0.6s ease-out',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} />
                                
                                <span style={{ 
                                    fontSize: '10px', 
                                    color: '#64748b', 
                                    marginTop: '10px', 
                                    fontWeight: '500', 
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center'
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DuracionChart;