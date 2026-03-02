import React from 'react';

const FilaRanking = ({ asesor }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 20px',
            marginBottom: '10px',
            fontSize: '13px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            {/* Info del Asesor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>
                    #{asesor.posicion} {asesor.nombre}
                </span>
                <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', gap: '15px' }}>
                    <span>📞 {asesor.llamadas} llamadas</span>
                    <span>💰 {asesor.ventas} ventas ({asesor.porcentaje}%)</span>
                    <span>⏳ {asesor.turnos} turnos</span>
                </div>
            </div>

            {/* Puntaje  */}
            <div style={{
                backgroundColor: '#e91e63',
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px'
            }}>
                {asesor.puntos} pts
            </div>
        </div>
    );
};

export default FilaRanking;