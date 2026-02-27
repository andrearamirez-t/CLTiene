import React, { useState } from 'react';

const Transcripciones = () => {
    // Score de ejemplo: 87 (Verde)
    const [score] = useState(87);

    const getQualityStyle = (val) => {
        if (val <= 40) return { bg: '#ff4d4d', text: 'Bajo - Necesita mejorar' };
        if (val <= 75) return { bg: '#3498db', text: 'Intermedio - Aceptable' };
        return { bg: '#2ecc71', text: 'Bueno - Excelente desempeño' };
    };

    const quality = getQualityStyle(score);

    return (
        <div style={{ padding: '40px', backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>

            {/* SECCIÓN SUPERIOR: FILTROS + TRANSCRIPCIÓN */}
            <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>

                {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y FILTROS */}
                <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <h2 style={{ fontSize: '16px', color: '#626947', margin: 0 }}>Visor de Transcripciones AI</h2>

                    {/* 1. Buscador con Borde Fucsia */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                            ** Buscar por teléfono o asesor **
                        </label>
                        <input
                            type="text"
                            placeholder="Angie..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#1e293b',
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none',
                                border:"none"
                            }}
                        />
                    </div>

                    {/* 2. Seleccionar llamada */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Seleccionar llamada:</label>
                        <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fc3474', color: 'white', fontWeight: 'bold', fontSize: '13px' }}>
                            <option>#3317 | Conectada | 3136437775 | Angie</option>
                        </select>
                    </div>

                    {/* 3. Filtro de Gestión */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#475569' }}>
                            ** Clasificación de Gestión **
                        </label>
                        <select
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#fc3474',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '13px',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="" style={{ color: '#fff' }}>Seleccionar Clasificación...</option>
                            <option value="venta" style={{ color: '#fff' }}>✅ Venta Exitosa</option>
                            <option value="casi-venta" style={{ color: '#fff' }}>⏳ Gestión Avanzada (Casi Venta)</option>
                            <option value="no-venta" style={{ color: '#ffff' }}>❌ Sin Conversión (No Venta)</option>
                        </select>
                    </div>

                    {/* 4. Score de Calidad (Dinámico) */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>** Score de Calidad **</label>
                        <div style={{ backgroundColor: quality.bg, color: 'white', padding: '10px 20px', borderRadius: '25px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
                            {score}/100 {quality.text}
                        </div>
                    </div>

                    {/* 5. Cuadro de Métricas (Gris) */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>** Métricas **</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                            <p style={{ margin: 0 }}><b>Asesor:</b> Angie Daniela Lancheros</p>
                            <p style={{ margin: 0 }}><b>Cliente:</b> No Identificado</p>
                            <p style={{ margin: 0 }}><b> Llamadas a este número:</b> 1 en filtro (1 con trans.)</p>
                            <p style={{ margin: 0 }}><b> 6 total (1 con trans.)</b></p>
                            <p style={{ margin: 0 }}><b> Contactado: 1</b></p>
                            
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: BURBUJAS DE TEXTO */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ backgroundColor: '#5483c3', color: 'white', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                        <b>[Cliente]:</b> Hola, Daniela, ¿cómo estás? Bien, sí, señora.
                    </div>
                    <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
                        <b>[Asesor]:</b> Me estoy comunicando con usted con respecto a una orientación médica telefónica brindada el día de ayer.
                    </div>
                    <div style={{ backgroundColor: '#5483c3', color: 'white', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                        <b>[Cliente]:</b> Queríamos verificar cómo continuaba, si ha podido seguir las recomendaciones. Sí, sí, señora. Todo muy bien.
                    </div>
                    <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
                        <b>[Asesor]:</b> Igualmente queríamos recordarles que la línea queda habilitada 24/7.
                    </div>
                </div>
            </div>

            {/* SECCIÓN INFERIOR: REJILLA DE RESULTADOS */}
            <div style={{ marginTop: '50px', borderTop: '2px solid #f1f5f9', paddingTop: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px 60px' }}>
                    {[
                        { label: 'Resultado', val: 'Contactado' },
                        { label: 'Duración', val: 'Media' },
                        { label: 'Plan', val: 'No Identificado' },
                        
                        { label: 'Turnos', val: '4' },
                        { label: 'Saludo', val: 'Parcial' },
                        { label: 'WhatsApp', val: 'No' }
                    ].map((item, index) => (
                        <div key={index}>
                            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{item.val}</p>
                        </div>
                    ))}
                </div>

                {/* BOTÓN DE ACCIÓN FINAL */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button style={{
                        backgroundColor: '#e91e63',
                        color: 'white',
                        border: 'none',
                        padding: '14px 45px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        boxShadow: '0 4px 6px -1px rgba(233, 30, 99, 0.2)'
                    }}>
                        Analizar llamada con IA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Transcripciones;