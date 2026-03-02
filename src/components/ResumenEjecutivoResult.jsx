import React from 'react';

const ResumenEjecutivoResult = () => {
    return (
        <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
            fontSize: '14px',
            lineHeight: '1.6',
            maxHeight: '400px', 
            overflowY: 'auto'
        }}>
            <h4 style={{ color: '#e91e63', marginBottom: '15px' }}>**Resumen Ejecutivo Profesional Call Center CL Tiene Soluciones**</h4>

            <p style={{ fontWeight: 'bold', marginTop: '15px' }}>KPIs Clave:</p>
            <ul style={{ margin: '0 0 15px 20px', padding: 0 }}>
                <li>**Total de llamadas:** 2,556</li>
                <li>**Porcentaje de ventas sobre llamadas totales:** 2.15%</li>
                <li>**Promedio de turnos por asesor:** 4.6</li>
            </ul>

            <p style={{ fontWeight: 'bold' }}>Tendencias:</p>
            <ul style={{ margin: '0 0 15px 20px', padding: 0 }}>
                <li>**Bajo Tasa de Conversión:** Solo 55 ventas de 2,556 llamadas, indicando oportunidades de mejora en el discurso y el manejo de objeciones.</li>
                <li>**Escasa identificación del Plan:** En el 80% de las llamadas no se identifica el plan mencionado, lo que puede revelar falta de capacitación o eficiencia en la recolección de datos.</li>
                <li>**Duración de llamadas predominantemente media:** La mayoría de las llamadas están en la categoría "Media" con 820 registros, lo cual puede incidir en la eficiencia del manejo de tiempo.</li>
            </ul>

            <p style={{ fontWeight: 'bold' }}>Fortalezas:</p>
            <ul style={{ margin: '0 0 15px 20px', padding: 0 }}>
                <li>**Alta Frecuencia de Despedida Eficaz:** 230 registros positivos, lo que indica un cierre de llamada generalmente satisfactorio y profesional.</li>
                <li>**Comunicación vía WhatsApp:** 230 interacciones, sugiriendo un enfoque proactivo y multicanal en la comunicación con el cliente.</li>
            </ul>

            <p style={{ fontWeight: 'bold' }}>Debilidades:</p>
            <ul style={{ margin: '0 0 15px 20px', padding: 0 }}>
                <li>**Bajo Tasa de Contacto Inicial:** El 60% de las 2,556 llamadas iniciales fueron contactadas exitosamente.</li>
                <li>**Calidad en Beneficios y Saludo:** Solo 122 menciones de saludo y beneficios, indicando espacio para mejorar en la presentación inicial y argumentación de ventajas.</li>
            </ul>

            <p style={{ fontWeight: 'bold', marginTop: '15px', color: '#e91e63' }}>5 Recomendaciones Prioritarias:</p>
            <ol style={{ margin: '0 0 15px 20px', padding: 0 }}>
                <li>**Mejorar la Estrategia de Contactabilidad:** Implementar análisis de horarios óptimos y revisar bases de datos para aumentar el contacto inicial.</li>
                <li>**Formación Orientada a la Identificación de Necesidades:** Capacitar a los asesores en técnicas de identificación y articulación de ofertas a medida, utilizando los planes que en el momento son suministrados.</li>
                <li>**Optimizar el Discurso de Ventas:** Revisar y mejorar el guion de ventas para garantizar que las características y beneficios se comuniquen claramente al cliente potencial.</li>
                <li>**Reforzar el Manejo de Objeciones:** Realizar sesiones de role-play enfocadas en las objeciones más frecuentes identificadas (p.ej., falta de interés, precio) para mejorar la tasa de conversión.</li>
                <li>**Uso Eficiente de Recursos en Duración y Personal:** Analizar y ajustar la distribución de duración de llamadas para asegurar que cada llamada sea lo más efectiva posible dentro de su estructura de tiempo. Evaluar y redistribuir las llamadas entre asesores según eficacia y especialización.</li>
            </ol>

            <p style={{ marginTop: '15px', fontStyle: 'italic', fontSize: '13px' }}>Con la aplicación de estas medidas, se espera mejorar el rendimiento general del call center, tanto en la tasa de contacto inicial como en la conversión de ventas, optimizando los recursos humanos y tecnológicos disponibles.</p>
        </div>
    );
};

export default ResumenEjecutivoResult;