import React, { useState } from 'react';

const Agente = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { role: 'user', content: 'hola' },
        { role: 'ai', content: '¡Hola! ¿En qué puedo ayudarte hoy con la información del call center?' },
        { role: 'user', content: 'necesito saber algo' },
        { role: 'ai', content: 'Claro, dime qué necesitas saber y con gusto te ayudaré.' }
    ]);

    const handleSend = (text) => {
        const msg = text || inputValue;
        if (!msg) return;

        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInputValue('');

        setTimeout(() => { 
            let aiResponse = "";

            // 1. RESUMEN DEL RENDIMIENTO
            if (msg.includes('Resumen del rendimiento')) {
                aiResponse = `
Claro, aquí tienes un resumen del rendimiento del call center:
* Total de llamadas: 3,299
* Contactadas: 3,298 (100%)
* Ventas: 62 (1.88%)

Duración de Llamadas:

* Media: 1017 segundos
* Buzón: 753 llamadas
* Corta: 733 llamadas
* Muy Corta: 490 llamadas
* Larga: 306 llamadas
 
Planes Mencionados:

* Mayoría no identificados: 2118
* Plan Mascotas: 720
* Plan Salud: 185

Calidad de Llamadas:

* Saludo: 221
* Beneficios: 42
* WhatsApp: 361
* Despedida: 368

Desempeño de Asesores:

* Mejor tasa de éxito: Melany Camila Ramirez (4.99% de éxito)
* Peor tasa de éxito: Jimmy Alexander Rusinque (0.61% de éxito)

Motivos de Rechazo:

* No Interesa: 103
* Sin Motivo: 44
* Precio: 5`;
            }

            // 2. PATRONES DE VENTAS
            else if (msg.includes('Patrones de ventas exitosas')) {
                aiResponse = `Basado en los datos proporcionados, aquí tienes algunos patrones observados en las ventas exitosas del call center:

1. Tasa de Éxito por Asesor:

Melany Camila Ramirez muestra el mayor porcentaje de éxito con un 4.99%, lo que sugiere que tiene técnicas o un enfoque efectivo para cerrar ventas.

2. Planes Populares:

El "Plan Mascotas" fue mencionado 720 veces, lo que indica un posible interés o enfoque en este tipo de oferta, aunque las ventas no se especifican por plan, es probable que este tenga buena acogida.

3. Duración de Llamadas:

La media de las llamadas es de 1017 segundos. No es seguro si las llamadas más largas resultan en más ventas, pero una conexión significativa podría estar aquí.

4.Contactados vs. Ventas:

Se realizaron 3,298 contactos y de estos, 62 resultaron en ventas, es decir, el 1.88%. Esto podría indicar que, aunque muchos contactos no garantizan ventas, la persistencia es clave.

5.Motivo de Rechazo:

"No Interesa" es la razón principal de rechazo, por lo que mejorar la segmentación de clientes antes de contactar podría aumentar las ventas.

En resumen, enfocarse en el perfeccionamiento de las habilidades de los asesores más exitosos, como Melany, y aumentar la identificación de clientes interesados en planes populares como el Plan Mascotas, podría mejorar las ventas. Ajustar estrategias según la respuesta del cliente también es crucial.`;
            }

            // 3. MEJOR ASESOR Y POR QUÉ 
            else if (msg.includes('Mejor asesor y por qué')) {
                aiResponse = `El mejor asesor es Melany Camila Ramirez. Realizó 421 llamadas y logró 21 ventas, obteniendo un porcentaje de éxito del 4.99%, el más alto entre todos los asesores. Esto indica que tiene una mayor efectividad para convertir contactos en ventas.`;
            }

            //PLAN DE ACCION SEMANAL

            else if (msg.includes('Plan de acción semanal')) {
                aiResponse = `Claro, aquí tienes un plan de acción basado en los datos del call center:

                1. Capacitación y Mejora del Desempeño:

* Implementar sesiones de capacitación para aumentar la efectividad de las ventas, enfocándose en técnicas de cierre y manejo de objeciones. Especial atención a los asesores con menores tasas de éxito como Jimmy y Nicolas.

2. Optimización de Llamadas:

* Analizar y reducir la cantidad de llamadas clasificadas como "Sin Clasificar" para ahorrar tiempo.
* Mejorar las tasas de contacto mediante el uso de diferentes franjas horarias y canales de contacto.

3. Promoción de Planes:

* Fomentar el conocimiento y promoción de planes menos mencionados entre los asesores, como "Plan Hogar" y "Plan Complementario".

4. Gestión de Calidad:

* Aumentar el enfoque en las áreas de calidad como el Saludo y Despedida basándose en las métricas de calidad actuales.

5. Revisión de Rechazos:

* Desarrollar estrategias para manejar las objeciones más comunes, como "No Interesa" y "Sin Motivo".

6. Uso de Nuevas Tecnologías:

* Explorar el uso de WhatsApp y otros canales digitales para incrementar la tasa de contacto y retención de clientes.

7. Monitoreo Continuo:

* Seguimiento semanal del rendimiento de las acciones implementadas y ajustar estrategias según sea necesario.

Implementando estas estrategias, es probable que el call center mejore su efectividad en ventas y satisfacción del cliente.`
            }

            //MOTIVOS DE RECHAZO

            else if (msg.includes('Motivos de rechazo')) {
                aiResponse = `Los motivos de rechazo son:

1. No Interesa: 103
2. Sin Motivo: 44
3. No Aplica Servicio: 11
4. Precio: 5
5. Ya Tiene Servicio: 3
6. Confusión: 1
7. No Recuerda Registro: 1`
            }

            //COMO MEJORAR CONCTACTABILIDAD

            else if (msg.includes('Cómo mejorar contactabilidad')) {
                aiResponse = `Para mejorar la contactabilidad en el call center, considera lo siguiente:

1. Actualización de Bases de Datos: Asegúrate de que las bases de datos estén actualizadas para evitar números equivocados o inválidos.

2. Optimización de Horarios: Llama en horarios donde es más probable que las personas estén disponibles, como por la tarde o después del trabajo.

3. Experimenta con Diferentes Canales: Usa distintos medios para contactar, como WhatsApp o correos electrónicos, para captar la atención de los clientes.

4. Reentrenamiento en Teknikas de Llamada: Capacita a los asesores para mejorar la forma en que abordan las llamadas y cómo mantener al cliente al teléfono.

5. Automatización: Utiliza sistemas de marcación automática para aumentar la eficiencia y reducir el tiempo entre llamadas.

6. Personalización de Mensajes: Adapta los scripts para que sean más personalizados y relevantes para el cliente potencial.

Implementando estas estrategias, podrías aumentar la tasa de contacto y, eventualmente, las ventas.`
            }

            // 4. RESPUESTA POR DEFECTO
            else {
                aiResponse = `Estoy analizando los datos sobre "${msg}"...`;
            }

            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        }, 1000);
    };
    return (
        <div style={{ padding: '30px', backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>

            <h3 style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>Agente IA PRO - Herramienta:</h3>

            {/* TARJETAS SUPERIORES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                {['Chat Inteligente', 'Análisis Automáticos', 'Búsqueda + Ranking', 'Búsqueda Inteligente', 'Resumir Llamadas', 'Ranking IA', 'Reporte Completo'].map((title, i) => (
                    <div key={i} style={{ padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{title}</h4>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Descripción breve de la herramienta de inteligencia.</p>
                    </div>
                ))}
            </div>

            {/* ÁREA DE CHAT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '25px 30px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.8',
                            textAlign: 'left',
                            background: msg.role === 'user'
                                ? 'linear-gradient(90deg, #E8347E 0%, #634394 100%)'
                                : '#f8fafc',
                            color: msg.role === 'user' ? 'white' : '#1e293b',
                            border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                            boxShadow: msg.role === 'ai' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* INPUT Y BOTONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Tu pregunta:</p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ej: ¿Qué asesor rinde mejor?"
                        style={{
                            width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #e91e63',
                            backgroundColor: '#1e293b', color: 'white', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => handleSend()} style={{ flex: 1, padding: '12px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Enviar
                    </button>
                    <button onClick={() => setMessages([])} style={{ flex: 1, padding: '12px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Limpiar
                    </button>
                </div>
            </div>

            {/* SUGERENCIAS EN 3 COLUMNAS */}
            <div style={{ marginTop: '30px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '15px' }}>** Sugerencias **</p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px'
                }}>
                    {[
                        '¿Resumen del rendimiento?...', '¿Mejor asesor y por qué?...', '¿Motivos de rechazo?...',
                        '¿Patrones de ventas exitosas?...', '¿Plan de acción semanal?...', '¿Cómo mejorar contactabilidad?...'
                    ].map((texto, index) => (
                        <button
                            key={index}
                            onClick={() => handleSend(texto)}
                            style={{
                                padding: '12px', backgroundColor: '#e91e63', color: 'white', border: 'none',
                                borderRadius: '8px', fontSize: '11px', cursor: 'pointer', textAlign: 'left',
                                fontWeight: '500'
                            }}
                        >
                            {texto}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Agente;