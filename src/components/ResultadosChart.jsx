import React from 'react';

const ResultadosChart = ({ datos }) => {
    return (
        <div className="card">
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '25px' }}>
                Distribución de Resultados
            </div>
            
            <div style={{ position: 'relative', paddingBottom: '30px', marginTop: '10px' }}>
                
                <div style={{ 
                    position: 'absolute', width: 'calc(100% - 150px)', height: '100%', 
                    left: '140px', display: 'flex', justifyContent: 'space-between', zIndex: 0 
                }}>
                    {[0, 200, 400, 600, 800, 1000, 1200].map(val => (
                        <div key={val} style={{ borderLeft: '1px solid #f1f5f9', height: '100%', position: 'relative' }}>
                            <span style={{ position: 'absolute', bottom: '-20px', left: '-10px', fontSize: '10px', color: '#94a3b8' }}>{val}</span>
                        </div>
                    ))}
                </div>

                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {datos.map((res, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '130px', textAlign: 'right', paddingRight: '10px', fontSize: '11px', color: '#64748b' }}>
                                {res.nombre}
                            </div>
                            <div style={{ flex: 1, height: '22px' }}>
                                <div style={{ 
                                    width: res.ancho, 
                                    height: '100%', 
                                    
                                    background: 'linear-gradient(to right, #FC3276, #FD7751)', 
                                    borderRadius: '2px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'flex-end', 
                                    paddingRight: '10px',
                                    transition: 'width 0.8s ease-in-out'
                                }}>
                                    <span style={{ fontSize: '9px', color: 'white', fontWeight: 'bold' }}>
                                        {res.valor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>Cantidad</div>
        </div>
    );
};

export default ResultadosChart;

