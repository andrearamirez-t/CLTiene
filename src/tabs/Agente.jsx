import React, { useState } from 'react';


import HerramientaCard from '../components/HerramientaCard';
import Chat from '../components/Chat';
import SendMessage from '../components/ui/SendMessage';
import AnalisisAu from '../components/AnalisisAu';
import BusquedaInteligente from '../components/ui/BusquedaInteligente';
import ResumirLlamadas from '../components/ResumirLlamadas';
import RankingIA from '../components/RankingIA';
import ReporteCompleto from '../components/ReporteCompleto';
import BotonAnalisis from '../components/ui/BotonAnalisis';

const PROMPT_CHAT_INTELIGENTE = "Eres analista experto de call centers en Colombia. Genera 5 insights accionables. Español, emojis, datos específicos.";

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
        { title: "Reporte Completo", description: "Consolidado integral de métricas listo para descargar." },
    ];

    const AGENTE_IA_PRO = {
        RESUMEN_EJECUTIVO: "Resumen ejecutivo profesional: KPIs, tendencias, fortalezas...",
        COACH_ASESOR: "Eres coach de call center. Genera: 1.DIAGNÓSTICO 2.FORTALEZAS...",
        DIRECTOR_OPERACIONES: "Eres director de operaciones. Analiza: 1.MEJORES HORARIOS..."
    };


    //  handleSend
    const handleSend = async (textOverride) => {
        const text = textOverride || inputValue;
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInputValue('');

        try {

            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_message: text,
                    system_prompt: "Eres un analista experto de call centers."
                })
            });

            if (response.status === 404) {
                throw new Error("La ruta /chat no existe en el backend. Revisa api/routes.py");
            }

            const data = await response.json();


            setMessages(prev => [...prev, {
                role: 'ai',
                content: data.respuesta || data.response || "Análisis recibido con éxito."
            }]);

        } catch (error) {
            console.error("Error detallado:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `❌ Error: ${error.message}`
            }]);
        }
    };

    const ejecutarAnalisisRapido = (textoAnalisis) => {

        handleSend(`Realiza un: ${textoAnalisis}`);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <h3 style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>Agente IA PRO - Herramienta:</h3>

            {/* SECCIÓN DE TARJETAS SUPERIORES */}
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

            {/* CONTENIDO DINAMICO */}
            <div style={{ marginTop: '20px' }}>
                {tabActiva === 'Chat Inteligente' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Chat messages={messages} />
                        <SendMessage
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            onSend={() => handleSend()}
                            onClear={() => setMessages([])}
                        />
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
                            <strong>Sugerencias:</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
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
                                    onClick={() => ejecutarAnalisisRapido(sug)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: '#999999',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {tabActiva === 'Análisis Automáticos' && <AnalisisAu />}

                {tabActiva === 'Búsqueda Inteligente' && (
                    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <BusquedaInteligente />
                    </div>
                )}

                {tabActiva === 'Resumir Llamadas' && (
                    <>
                        <ResumirLlamadas />
                        <div style={{ padding: "20px" }}>
                            <BotonAnalisis onAnalizar={() => alert('Analizando...')} />
                        </div>
                    </>
                )}

                {tabActiva === 'Ranking IA' && <RankingIA />}

                {tabActiva === 'Reporte Completo' && (
                    <div style={{ marginTop: '20px' }}>
                        <ReporteCompleto />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Agente;