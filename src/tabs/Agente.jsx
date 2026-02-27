import React, { useState } from 'react';
import HerramientaCard from '../components/HerramientaCard';
import Chat from '../components/Chat';
import SendMessage from '../components/SendMessage';

const Agente = () => {
    const [tabActiva, setTabActiva] = useState('Chat Inteligente');
    const [messages, setMessages] = useState([
        { role: 'ai', content: '¡Hola! Soy el Agente IA de CL Tiene. Pregúntame sobre datos, rendimiento, recomendaciones o análisis.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const herramientas = [
        { title: 'Chat Inteligente', description: "Conversa sobre datos, pide análisis, genera reportes." },
        { title: "Análisis Automáticos", description: "8 tipos de análisis profundos disponibles." },
        { title: "Búsqueda Inteligente", description: "Localiza momentos clave en miles de transcripciones." },
        { title: "Resumir Llamadas", description: "Síntesis automáticas de compromisos y próximos pasos." },
        { title: "Ranking IA", description: "Evaluación de asesores por calidad y éxito en ventas." },
        { title: "Reporte Completo", description: "Consolidado integral de métricas listo para descargar." }
    ];

    const handleSend = (textOverride) => {
        const text = textOverride || inputValue;
        if (!text.trim()) return;
        setMessages([...messages, { role: 'user', content: text }]);
        setInputValue('');
        // Simulación de respuesta
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: 'Analizando información...' }]);
        }, 1000);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <h3 style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>Agente IA PRO - Herramienta:</h3>

            {/* 1. SECCIÓN DE TARJETAS (Grid 3x2) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                {herramientas.map((h) => (
                    <HerramientaCard
                        key={h.title}
                        title={h.title}
                        description={h.description}
                        isActive={tabActiva === h.title}
                        onClick={() => setTabActiva(h.title)}
                    />
                ))}
            </div>

            {/* 2. CHAT Y BOTONES */}
            {tabActiva === 'Chat Inteligente' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Historial de Chat */}
                    <Chat messages={messages} />

                    {/* Input y Botones de Enviar/Limpiar */}
                    <SendMessage 
                        inputValue={inputValue} 
                        setInputValue={setInputValue} 
                        onSend={handleSend} 
                        onClear={() => setMessages([])} 
                    />

                    {/* Sección de Sugerencias */}
                    <div style={{ marginTop: '10px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '15px' }}>** Sugerencias:**</p>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '15px' 
                        }}>
                            {[
                                '¿Resumen del rendimiento?...', 
                                '¿Mejor asesor y por qué?...', 
                                '¿Motivos de rechazo?...',
                                '¿Patrones de ventas exitosas?...',
                                '¿Plan de acción semanal?...',
                                '¿Cómo mejorar contactabilidad?...'
                            ].map((sug, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSend(sug)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: '#e91e63',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #cbd5e1', borderRadius: '15px', color: '#64748b' }}>
                    <h3>Módulo de {tabActiva}</h3>
                    <p>Contenido en desarrollo.</p>
                </div>
            )}
        </div>
    );
};

export default Agente;