import React, { useState } from 'react';
import HerramientaCard from '../components/HerramientaCard';
import Chat from '../components/Chat';
import SendMessage from '../components/SendMessage';
import AnalisisAu from '../components/AnalisisAu';

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

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInputValue('');

        setTimeout(() => {
            let aiResponse = "";
            if (text.includes("Como mejorar contactabilidad")) {
                aiResponse = "Para mejorar la contactabilidad en el call center, puedes considerar las siguientes estrategias: Optimizar horarios, validar bases de datos y usar multicanalidad.";
            } else if (text.includes("Motivos de rechazo")) {
                aiResponse = "Los motivos de rechazo principales son: falta de presupuesto, ya cuentan con el servicio o no hay interés en el producto actual.";
            } else if (text.includes("Mejor asesor")) {
                aiResponse = "El mejor asesor es Melany Camila Ramirez. Realizó 421 llamadas y logró 21 ventas (4.99% de éxito).";
            } else {
                aiResponse = "Estoy analizando los datos solicitados basándome en el historial del call center...";
            }
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        }, 1000);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <h3 style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>Agente IA PRO - Herramienta:</h3>

            {/* SECCIÓN DE TARJETAS */}
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

            {/* CONTENIDO DINÁMICO */}
            <div style={{ marginTop: '20px' }}>
                {/* Caso 1: Chat Inteligente */}
                {tabActiva === 'Chat Inteligente' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Chat messages={messages} />
                        <SendMessage
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            onSend={handleSend}
                            onClear={() => setMessages([])}
                        />
                        {/* Sugerencias */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                            {[
                                '¿Resumen del rendimiento?...',
                                '¿Mejor asesor y por qué?...',
                                '¿Motivos de rechazo?...',
                                '¿Patrones de ventas exitosas?...',
                                '¿Plan de acción semanal?...',
                                '¿Como mejorar contactabilidad?...'
                            ].map((sug, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSend(sug)}
                                    style={{ padding: '12px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '10px', fontSize: '11px', cursor: 'pointer' }}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Caso 2: Análisis Automáticos */}
                {tabActiva === 'Análisis Automáticos' && (
                    <AnalisisAu />
                )}

                {/* Caso 3: Otras pestañas en desarrollo */}
                {tabActiva !== 'Chat Inteligente' && tabActiva !== 'Análisis Automáticos' && (
                    <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #cbd5e1', borderRadius: '15px', color: '#64748b' }}>
                        <h3>Módulo de {tabActiva}</h3>
                        <p>Contenido en desarrollo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Agente;