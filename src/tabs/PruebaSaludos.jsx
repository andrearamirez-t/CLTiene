import React, { useMemo } from 'react';
import { jsPDF } from 'jspdf';

/*
 * Prueba de Saludos Iniciales — análisis de la prueba A/B de saludos comerciales
 * que CL Tiene corrió sobre la base "No Contactados" (clientes que dejaron datos
 * hace meses y nunca tuvieron contacto efectivo). Reporte enviado por Steven Aldana
 * (Supervisor Contact Center, CL Tiene) el 27-jul-2026.
 *
 * DATOS PUNTUALES (no vienen del pipeline). Para actualizar: editar RESULTADOS.
 */
const RESULTADOS = [
    { fecha: '23/07 13:16', asesor: 'Paula Naranjo', celular: '3137035153', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 13:21', asesor: 'Paula Naranjo', celular: '3206378775', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 13:26', asesor: 'Rosselin Ibarra', celular: '3112111744', saludo: 5, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '23/07 13:41', asesor: 'Andres Barrera', celular: '3142153969', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 13:49', asesor: 'Andres Barrera', celular: '3177043258', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 14:02', asesor: 'Andres Barrera', celular: '3243483069', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 14:06', asesor: 'Jimmy Rusinque', celular: '3207865392', saludo: 1, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '23/07 14:10', asesor: 'Andres Barrera', celular: '3124366642', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 14:26', asesor: 'Jimmy Rusinque', celular: '3004092794', saludo: 1, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '23/07 14:53', asesor: 'Andres Barrera', celular: '3112104685', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 16:01', asesor: 'Paula Naranjo', celular: '3124130783', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 16:08', asesor: 'Paula Naranjo', celular: '573002239508', saludo: 5, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '23/07 16:15', asesor: 'Paula Naranjo', celular: '573116012342', saludo: 5, siguio: 'NO', interesado: 'NO' },
    { fecha: '23/07 16:21', asesor: 'Rosselin Ibarra', celular: '3213061766', saludo: 4, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 16:21', asesor: 'Paula Naranjo', celular: '573213149958', saludo: 5, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '23/07 16:30', asesor: 'Paula Naranjo', celular: '573135358593', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 16:35', asesor: 'Rosselin Ibarra', celular: '573148101093', saludo: 4, siguio: 'NO', interesado: 'NO' },
    { fecha: '23/07 16:58', asesor: 'Paula Naranjo', celular: '573135358593', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '23/07 17:30', asesor: 'Paula Naranjo', celular: '573127097196', saludo: 5, siguio: 'NO', interesado: 'NO' },
    { fecha: '23/07 17:38', asesor: 'Paula Naranjo', celular: '573170592469', saludo: 5, siguio: 'COLGARON', interesado: 'NO' },
    { fecha: '24/07 09:31', asesor: 'Paula Naranjo', celular: '573102294517', saludo: 5, siguio: 'NO', interesado: 'NO' },
    { fecha: '24/07 10:37', asesor: 'Paula Naranjo', celular: '573144803414', saludo: 5, siguio: 'SI', interesado: 'NO' },
    { fecha: '24/07 10:59', asesor: 'Rosselin Ibarra', celular: '573003940495', saludo: 3, siguio: 'SI', interesado: 'SI' },
    { fecha: '24/07 11:08', asesor: 'Paula Naranjo', celular: '573112808771', saludo: 5, siguio: 'NO', interesado: 'NO' },
    { fecha: '25/07 08:34', asesor: 'Andres Barrera', celular: '3148196537', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '25/07 08:47', asesor: 'Andres Barrera', celular: '3150461177', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '25/07 09:18', asesor: 'Rosselin Ibarra', celular: '573177038754', saludo: 1, siguio: 'SI', interesado: 'NO' },
    { fecha: '25/07 09:20', asesor: 'Rosselin Ibarra', celular: '573105436501', saludo: 1, siguio: 'NO', interesado: 'NO' },
    { fecha: '25/07 09:22', asesor: 'Rosselin Ibarra', celular: '573003940495', saludo: 1, siguio: 'NO', interesado: 'NO' },
];

// Transcripciones de las 7 llamadas de la prueba enviadas con audio (transcritas con NotebookLM).
// Empresa real "CL Tiene Soluciones" (NotebookLM la anonimizó como "Seleien"). turns: ['A'=asesor,'C'=cliente]
const TRANSCRIPCIONES = [
    {
        celular: '3124366642', asesor: 'Andrés Barrera', saludo: 1, siguio: 'SI', interesado: 'NO',
        analisis: 'Saludo cordial, pero pide recordar y el cliente no recuerda; además ya resolvió su tema de salud por otro lado. El agente cerró sin intentar re-enganchar con un beneficio concreto.',
        turns: [
            ['A', 'Buenas tardes. Le habla Andrés de CL Tiene Soluciones. ¿Cómo se encuentra el día de hoy?'],
            ['C', 'Bien, señor. Cuénteme en qué les puedo servir.'],
            ['A', 'Le prometo que seré muy breve. Hace tiempo dejó sus datos porque le interesó uno de nuestros planes asistenciales. ¿Recuerda cuál fue el que le llamó la atención?'],
            ['C', 'No, la verdad no recuerdo.'],
            ['A', 'No hay problema. Contamos con planes de salud, hogar, movilidad o mascotas.'],
            ['C', 'Ah, creo que fue algo de salud, pero de momento ya solucioné.'],
            ['A', '¿Ya adquirió un plan asistencial aparte?'],
            ['C', 'Sí, ya estoy como en otro tema.'],
            ['A', 'Perfecto, señor. Le agradezco por la información.'],
            ['C', 'Listo. Buena tarde.'],
        ],
    },
    {
        celular: '3137035153', asesor: 'Paula Naranjo', saludo: 5, siguio: 'SI', interesado: 'NO',
        analisis: 'El "me matas si le digo que es una llamada de ventas" marca la venta de entrada y el cliente busca salir. Además hay barrera real: carro dañado y sin recursos. Paula ofreció el beneficio pero el opener ya predispuso.',
        turns: [
            ['A', '¿Me comunico con el señor Carlos? Soy Paula de CL Tiene Soluciones. ¿Cómo está?'],
            ['C', 'Bien.'],
            ['A', 'Señor Carlos, me matas si le digo que esto es una llamada de ventas. Hace poco nos dejó sus datos para recibir información sobre el plan asistencial para su vehículo. ¿Lo recuerda?'],
            ['C', 'No, señora. Es que tengo el carro varado. Gracias.'],
            ['A', 'El plan le cubre su vehículo si se queda varado, un reinicio de batería, etc. ¿En qué ciudad se encuentra?'],
            ['C', 'Estaba casi todo por armar en el Chocó. Estoy jodido, no puedo comprar.'],
            ['A', 'Ah, ¿su carro está dañado?'],
            ['C', 'Sí, sí.'],
            ['A', 'De acuerdo, señor Carlos. Es usted muy amable. Que esté muy bien. Hasta luego.'],
        ],
    },
    {
        celular: '3142153969', asesor: 'Andrés Barrera', saludo: 1, siguio: 'SI', interesado: 'NO',
        analisis: 'El cliente no ubica la empresa ("¿de dónde me llama?") y el "seré breve... ¿recuerda?" no genera confianza → corta rápido.',
        turns: [
            ['C', 'Aló.'],
            ['A', '¿Hablo con Yuli? Mucho gusto, Andrés de CL Tiene Soluciones. ¿Cómo se encuentra?'],
            ['C', '¿Qué? Perdón.'],
            ['A', 'Soy Andrés de CL Tiene Soluciones. Hace un tiempo nos dejó sus datos porque le interesó uno de nuestros servicios. ¿Todavía recuerda qué le llamó la atención?'],
            ['C', '¿Y de dónde me dice que llama?'],
            ['A', 'De CL Tiene Soluciones. Contamos con planes de salud, hogar, mascotas y movilidad. ¿En cuál estaba interesada?'],
            ['C', 'Ah, no, señor. Muchas gracias.'],
            ['A', 'Vale, dejo la observación. Que esté bien.'],
        ],
    },
    {
        celular: '3177043258', asesor: 'Andrés Barrera', saludo: 1, siguio: 'SI', interesado: 'NO',
        analisis: 'Patrón clásico del Saludo 1: pide recordar, "no me acuerdo mi amor", y sin un gancho concreto se cae. El agente insistió pero sin nombrar un beneficio.',
        turns: [
            ['A', 'Muy buenas tardes, ¿con María Estela? Habla Andrés de CL Tiene Soluciones. ¿Cómo está?'],
            ['C', 'Bien, gracias a Dios, acabando de llegar a la casa.'],
            ['A', 'Seré muy breve. Hace un tiempo dejó sus datos porque le interesó uno de nuestros planes. ¿Recuerda cuál fue el que le llamó la atención?'],
            ['C', 'Uy, no me acuerdo, mi amor.'],
            ['A', 'Contamos con movilidad, mascotas, salud y hogar. ¿En cuál estaba interesada?'],
            ['C', 'No, mi amor, la verdad no recuerdo.'],
            ['A', '¿Pero ninguno le llama la atención?'],
            ['C', 'No, mi amor, por el momento no.'],
            ['A', 'Vale, dejo la observación. Que tenga excelente tarde.'],
        ],
    },
    {
        celular: '3206378775', asesor: 'Paula Naranjo', saludo: 5, siguio: 'SI', interesado: 'NO',
        analisis: 'El peor caso: saludo que marca venta + problemas de audio ("¿ahora sí me escucha?") + cliente que no recuerda haber dejado datos. Se cae en cuanto se pregunta el motivo.',
        turns: [
            ['A', '¿Me comunico con la señora Viviana? Soy Paula de CL Tiene Soluciones. ¿Cómo está?'],
            ['C', 'Bien, gracias a Dios.'],
            ['A', 'Me matas si le digo que esto es una llamada de ventas. Hace tiempo nos dejó sus datos para recibir información sobre nuestros planes. ¿Recuerda?'],
            ['C', 'No, no sé de qué me habla.'],
            ['A', 'Nos dejó sus datos solicitando información. Vendemos para mascotas, salud, hogar y vehículos. ¿Cuál es de su interés?'],
            ['C', 'No... ¿cuál? No entiendo.'],
            ['A', 'Somos una empresa privada... ¿Ahora sí me escucha? Tal vez ingresó por Facebook a una publicación nuestra y pidió información. Por eso la contacto hoy.'],
            ['C', 'Ah, no, pero ya no. Muchas gracias.'],
            ['A', '¿Cuál sería el motivo?'],
        ],
    },
    {
        celular: '3213061766', asesor: 'Rosselin Ibarra', saludo: 4, siguio: 'SI', interesado: 'NO',
        analisis: '★ El mejor de los 7. Nombra el plan (salud) y lo enmarca como seguimiento/servicio; explica el beneficio concreto (médico a domicilio). El cliente se engancha ("¿qué hay que hacer?", cobertura, pago) pero no cierra por tener Nueva EPS. Modelo a replicar.',
        turns: [
            ['A', 'Muy buenas tardes. Mi nombre es Rosselin, de CL Tiene Soluciones, no le voy a quitar mucho tiempo. Vimos que estaba interesado en el plan de salud. ¿Le dieron la información? ¿Le quedó clara?'],
            ['C', '¿De qué está hablando? ¿Del teléfono o de qué?'],
            ['A', 'Somos una asistencia en salud que le envía un médico a su domicilio para que no tenga que salir de casa.'],
            ['C', 'Ah, bueno. Sí, señor. ¿Qué hay que hacer?'],
            ['A', '¿En qué ciudad se encuentra?'],
            ['C', 'Moniquirá, Vereda Tapia y San Antonio.'],
            ['A', 'Permítame, valido si tenemos cobertura y le indico cómo entregamos el servicio (el médico va a casa).'],
            ['C', '¿Uno debe pagar alguna mensualidad?'],
            ['A', 'Sí, señor. Somos una asistencia privada, genera un pago mensual.'],
            ['C', 'Le comento, tengo la Nueva EPS, esperar ahorita... no todavía, un poquito.'],
            ['A', 'Vale, señor. Entonces nos comunicamos nuevamente.'],
            ['C', 'Que tenga un excelente día.'],
        ],
    },
    {
        celular: '3243483069', asesor: 'Andrés Barrera', saludo: 1, siguio: 'SI', interesado: 'NO',
        analisis: 'Lead que dejó datos en muchos lados y ya resolvió; el "seré breve... ¿se acuerda?" no ancla nada. El agente explicó al pedirlo, pero el lead ya convirtió con otro.',
        turns: [
            ['A', '¿Con Yuli? Habla Andrés de CL Tiene Soluciones. ¿Cómo se encuentra?'],
            ['C', 'Bien, gracias a Dios. ¿Con quién hablo?'],
            ['A', 'Le prometo que seré muy breve. Hace un tiempo dejó sus datos porque le interesó uno de nuestros planes. ¿Se acuerda cuál le llamó la atención?'],
            ['C', 'Espérate. No entiendo, como he mandado tantas cosas. Explíqueme de qué se trata.'],
            ['A', 'Somos una empresa privada de planes asistenciales: movilidad, salud, hogar y mascotas. Usted indicó interés en uno. ¿Cuál le llamó la atención?'],
            ['C', 'No, pues ya no, por ahora ninguno.'],
            ['A', '¿Ya accedió al que necesitaba?'],
            ['C', 'Sí, ya. Gracias.'],
            ['A', 'Vale, le agradezco su amabilidad. Dejo la observación. Que tenga excelente día.'],
        ],
    },
];

const ACCENT = '#be123c';

const colorSiguio = (v) => v === 'SI' ? { bg: '#dcfce7', fg: '#15803d' }
    : v === 'NO' ? { bg: '#fef3c7', fg: '#b45309' }
        : { bg: '#fee2e2', fg: '#b91c1c' }; // COLGARON

function PruebaSaludos() {
    // Resumen por saludo
    const porSaludo = useMemo(() => {
        const m = {};
        for (let s = 1; s <= 5; s++) m[s] = { saludo: s, n: 0, si: 0, no: 0, colgaron: 0, interesados: 0 };
        RESULTADOS.forEach(r => {
            const b = m[r.saludo];
            b.n++;
            if (r.siguio === 'SI') b.si++;
            else if (r.siguio === 'NO') b.no++;
            else b.colgaron++;
            if (r.interesado === 'SI') b.interesados++;
        });
        return Object.values(m);
    }, []);

    const total = RESULTADOS.length;
    const interesados = RESULTADOS.filter(r => r.interesado === 'SI').length;
    const siguieron = RESULTADOS.filter(r => r.siguio === 'SI').length;
    const colgaron = RESULTADOS.filter(r => r.siguio === 'COLGARON').length;

    const pct = (x, n) => n ? Math.round((x / n) * 100) : 0;

    // Celulares que llegaron con transcripción (audio enviado)
    const TRANSCRITAS = useMemo(() => new Set(TRANSCRIPCIONES.map(t => t.celular)), []);

    // Resumen por asesor (para separar "¿es el saludo o la persona?")
    const porAsesor = useMemo(() => {
        const m = {};
        RESULTADOS.forEach(r => {
            const b = m[r.asesor] || (m[r.asesor] = { asesor: r.asesor, n: 0, si: 0, colgaron: 0, interesados: 0, saludos: new Set() });
            b.n++; b.saludos.add(r.saludo);
            if (r.siguio === 'SI') b.si++; else if (r.siguio === 'COLGARON') b.colgaron++;
            if (r.interesado === 'SI') b.interesados++;
        });
        return Object.values(m).sort((a, b) => b.n - a.n);
    }, []);

    // Motivos de no-conversión (categorizados de las 7 transcripciones con audio)
    const MOTIVOS = [
        { motivo: 'No recuerda / no ubica la empresa', n: 3 },
        { motivo: 'Ya resolvió por otro lado', n: 2 },
        { motivo: 'Barrera económica o de situación', n: 2 },
    ];

    const generarPDF = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        const maxW = 515;
        const PINK = [252, 50, 118];
        let y = margin;

        const GRAY = [71, 85, 105];
        // Sanitiza caracteres que la fuente estándar del PDF (Helvetica/WinAnsi) no soporta
        // y que causaban texto cortado (→, ★, comillas y guiones tipográficos).
        const clean = (s) => String(s)
            .replace(/→/g, '->').replace(/★/g, '*')
            .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
            .replace(/[–—]/g, '-').replace(/…/g, '...');

        const salto = (h = 13) => { y += h; if (y > 780) { doc.addPage(); y = margin; } };
        const ensure = (h) => { if (y + h > 790) { doc.addPage(); y = margin; } };
        const seccion = (txt) => {
            salto(12); ensure(32);
            doc.setFont(undefined, 'bold'); doc.setFontSize(12.5); doc.setTextColor(...PINK);
            doc.text(clean(txt), margin, y); salto(7);
            doc.setDrawColor(244, 194, 210); doc.setLineWidth(0.8); doc.line(margin, y, 555, y); salto(15);
            doc.setFont(undefined, 'normal'); doc.setTextColor(...GRAY);
        };
        const parrafo = (txt, size = 10, color = GRAY, bold = false) => {
            doc.setFontSize(size); doc.setTextColor(...color); doc.setFont(undefined, bold ? 'bold' : 'normal');
            doc.splitTextToSize(clean(txt), maxW).forEach((line) => { ensure(size + 3); doc.text(line, margin, y); salto(size + 3); });
            doc.setFont(undefined, 'normal');
        };
        const tabla = (header, widths, filas) => {
            let x = margin;
            ensure(20);
            doc.setFillColor(15, 23, 42); doc.rect(margin, y - 10, 515, 17, 'F');
            doc.setFontSize(9); doc.setFont(undefined, 'bold'); doc.setTextColor(255, 255, 255);
            header.forEach((l, i) => { doc.text(clean(l), x + 4, y + 1); x += widths[i]; }); salto(17);
            doc.setFont(undefined, 'normal'); doc.setTextColor(...GRAY);
            filas.forEach((row, ri) => {
                ensure(15);
                if (ri % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(margin, y - 10, 515, 15, 'F'); }
                x = margin;
                doc.setFontSize(9); row.forEach((v, i) => { doc.text(clean(v), x + 4, y); x += widths[i]; }); salto(15);
            });
        };

        // Banda de encabezado (página 1)
        doc.setFillColor(...PINK); doc.rect(0, 0, 595, 76, 'F');
        doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold'); doc.setFontSize(17);
        doc.text('Informe: Prueba de Saludos Iniciales', margin, 38);
        doc.setFont(undefined, 'normal'); doc.setFontSize(10);
        doc.text('Analisis de la prueba A/B de saludos comerciales - Base "No Contactados"', margin, 58);
        y = 98;
        doc.setTextColor(120, 120, 120); doc.setFontSize(9);
        doc.text('Preparado por DivergencyAI SAS   |   Fuente: CL Tiene Soluciones (Steven Aldana)   |   Datos 23-25 jul 2026', margin, y);
        salto(16);

        // 1. Resumen ejecutivo
        seccion('1. Resumen ejecutivo');
        parrafo(`Se probaron 5 saludos comerciales sobre la base de "No Contactados" (clientes que dejaron sus datos hace meses y nunca tuvieron contacto efectivo), con 29 llamadas entre el 23 y 25 de julio de 2026. De ellas, ${siguieron} siguieron la conversacion, ${colgaron} colgaron al terminar de saludar y solo ${interesados} mostro interes.`);
        salto(4);
        tabla(['Indicador', 'Valor'], [300, 120],
            [['Total de llamadas', total], ['Siguieron la conversacion', siguieron], ['Colgaron al saludar', colgaron], ['Interesados', interesados], ['Con transcripcion (audio enviado)', TRANSCRIPCIONES.length]]);

        // 2. Resultados por saludo (con %)
        seccion('2. Resultados por saludo');
        tabla(['Saludo', 'Llamadas', 'Siguieron', '% Sig.', 'Colgaron', '% Col.', 'Interes.'], [72, 70, 70, 55, 65, 55, 78],
            porSaludo.map((b) => [`Saludo ${b.saludo}`, b.n, b.si, b.n ? pct(b.si, b.n) + '%' : '-', b.colgaron, b.n ? pct(b.colgaron, b.n) + '%' : '-', b.interesados]));
        salto(4);
        parrafo('Nota: muestra pequena y desbalanceada (Saludo 5 y 1 concentran casi todo; el Saludo 2 no se probo; el Saludo 3 solo una vez). Los % ayudan a comparar, pero aun no es concluyente.', 9, [148, 163, 184]);

        // 3. Resultados por asesor
        seccion('3. Resultados por asesor');
        parrafo('Separa si el resultado es por el saludo o por la persona. Rosselin fue la unica que probo varios saludos, y su unico interes fue con Saludo 3.', 9, [148, 163, 184]);
        salto(2);
        tabla(['Asesor', 'Saludos', 'Llamadas', 'Siguieron', 'Colgaron', 'Interes.'], [105, 90, 70, 80, 75, 80],
            porAsesor.map((a) => [a.asesor, [...a.saludos].sort().map((s) => `S${s}`).join(' '), a.n, `${a.si} (${pct(a.si, a.n)}%)`, a.colgaron, a.interesados]));

        // 4. Motivos de no-conversion
        seccion('4. Motivos de no-conversion (de las 7 con audio)');
        parrafo('Categorizado de las transcripciones: muchas caen por la base fria (leads viejos), no por el saludo.', 9, [148, 163, 184]);
        salto(2);
        tabla(['Motivo', 'Llamadas'], [380, 80], MOTIVOS.map((m) => [m.motivo, m.n]));

        // 5. El patrón que engancha
        seccion('5. El patron que engancha');
        parrafo('El saludo que genera conexion (1) le dice al cliente el plan especifico que registro, sin pedirle que lo recuerde, y (2) se enmarca como "seguimiento", no como venta. Los que fracasan piden al cliente que "recuerde cual plan le intereso" (nunca recuerda) o admiten de entrada que es "una llamada de ventas", lo que dispara el rechazo.');

        // 6. Análisis de las transcripciones
        seccion('6. Analisis de las transcripciones');
        parrafo('Lo que funciona (Saludo 4/3):', 10, [21, 128, 61], true);
        parrafo('Nombra el plan especifico y lo enmarca como seguimiento. Fue la conversacion mas profunda: el cliente pregunto "que hay que hacer?" y hablo de cobertura, ciudad y pago. El unico interesado fue con Saludo 3.');
        parrafo('Lo que falla (Saludo 1/5):', 10, [185, 28, 28], true);
        parrafo('Saludo 1 pide "recuerda cual le llamo la atencion?" y el cliente nunca recuerda. Saludo 5 admite "me matas si le digo que esto es una llamada de ventas", lo que dispara evasion y confusion.');

        // 7. Recomendaciones
        seccion('7. Recomendaciones');
        [
            'Estandarizar el estilo del Saludo 4/3 para todos los asesores: nombrar el plan registrado y enmarcar la llamada como seguimiento.',
            'Eliminar el "recuerda cual plan?" y el "me matas, es una llamada de ventas".',
            'Para validar la prueba: mismo numero de llamadas por saludo, rotar los 5 saludos entre todos los asesores, incluir el Saludo 2 y usar una muestra mayor.',
            'Tener presente que la base es fria (leads viejos): varios clientes ya resolvieron por otro lado o tienen barreras, por lo que aun con el mejor saludo la conversion sera baja.'
        ].forEach((r) => parrafo('-  ' + r));

        // 8. Conclusion y proximos pasos
        seccion('8. Conclusion y proximos pasos');
        parrafo('El estilo consultivo (Saludo 4/3) es el que genera conversacion real, y el unico interes se dio con Saludo 3. Los saludos 1 y 5 se caen por pedir "recuerde" o por marcar "venta". Pero el techo lo pone la base fria: la mayoria de las 7 llamadas con audio no convirtio por razones ajenas al saludo.');
        parrafo('Proximos pasos: pedir a CL Tiene (1) el texto de los 5 saludos, (2) el audio del unico interesado (Saludo 3), y (3) correr una prueba balanceada (mismo numero por saludo, rotando entre todos los asesores).');

        // 9. Transcripciones
        seccion(`9. Transcripciones (${TRANSCRIPCIONES.length}) y analisis individual`);
        parrafo(`De las ${total} llamadas, CL Tiene envio ${TRANSCRIPCIONES.length} con audio (transcritas con NotebookLM). Las demas no tienen transcripcion disponible.`, 9, [148, 163, 184]);
        salto(6);
        TRANSCRIPCIONES.forEach((t) => {
            ensure(60);
            parrafo(`Saludo ${t.saludo}   |   ${t.asesor}   |   Cel. ${t.celular}   |   Siguio: ${t.siguio}   |   Interesado: ${t.interesado}`, 10, [...PINK], true);
            t.turns.forEach(([q, txt]) => parrafo(`${q === 'A' ? 'Asesor' : 'Cliente'}:  ${txt}`, 9, q === 'A' ? [71, 85, 105] : [194, 65, 12]));
            parrafo(`Analisis:  ${t.analisis}`, 9, [180, 83, 9]);
            salto(9);
        });

        // 10. Detalle de las llamadas (con marca de transcripción)
        seccion('10. Detalle de las 29 llamadas');
        tabla(['Fecha', 'Asesor', 'Celular', 'Saludo', 'Siguio', 'Interesado', 'Transc.'], [66, 100, 95, 48, 78, 70, 55],
            RESULTADOS.map((r) => [r.fecha, r.asesor, r.celular, `S${r.saludo}`, r.siguio, r.interesado, TRANSCRITAS.has(r.celular) ? 'Si' : '-']));

        // Pie de página con numeración en todas las páginas
        const totalPaginas = doc.getNumberOfPages();
        for (let p = 1; p <= totalPaginas; p++) {
            doc.setPage(p);
            doc.setDrawColor(228, 228, 228); doc.setLineWidth(0.5); doc.line(margin, 816, 555, 816);
            doc.setFontSize(8); doc.setTextColor(150, 150, 150); doc.setFont(undefined, 'normal');
            doc.text('CL Tiene Soluciones - DivergencyAI SAS   |   Confidencial', margin, 830);
            doc.text(`Pagina ${p} de ${totalPaginas}`, 500, 830);
        }

        doc.save(`Informe_PruebaSaludos_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const cardBox = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' };
    const th = { color: 'white', fontWeight: 600, padding: '9px 12px', textAlign: 'left', fontSize: '11px' };
    const td = { padding: '8px 12px', color: '#334155', borderBottom: '1px solid #f1f5f9', fontSize: '12px' };

    return (
        <div>
            {/* Header contexto */}
            <div style={{
                background: 'linear-gradient(90deg, #be123c 0%, #7e22ce 100%)',
                borderRadius: '12px', padding: '20px 24px', color: 'white', marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>🗣️ Prueba de Saludos Iniciales</h2>
                        <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '13px', lineHeight: 1.6 }}>
                            Prueba A/B de <strong>5 saludos comerciales</strong> sobre la base de <strong>"No Contactados"</strong>
                            (clientes que dejaron sus datos hace meses y nunca tuvieron contacto efectivo). 29 llamadas · 23–25 jul 2026.
                            <br />Fuente: reporte de Steven Aldana (Supervisor Contact Center, CL Tiene).
                        </p>
                    </div>
                    <button
                        onClick={generarPDF}
                        style={{
                            background: '#FC3276',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Descargar PDF
                    </button>
                </div>
            </div>

            {/* Cards resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <div style={cardBox}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total llamadas</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>{total}</div>
                </div>
                <div style={cardBox}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Siguieron conversación</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#15803d' }}>{siguieron}</div>
                </div>
                <div style={cardBox}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Colgaron al saludar</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#b91c1c' }}>{colgaron}</div>
                </div>
                <div style={cardBox}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interesados</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: ACCENT }}>{interesados}</div>
                </div>
                <div style={cardBox}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Con transcripción</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#7e22ce' }}>{TRANSCRIPCIONES.length}</div>
                </div>
            </div>

            {/* Resumen por saludo */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>Resultados por saludo</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <thead><tr style={{ background: '#0f172a' }}>
                    <th style={th}>Saludo</th><th style={th}>Llamadas</th><th style={th}>Siguieron</th>
                    <th style={th}>% Siguió</th><th style={th}>Colgaron</th><th style={th}>% Colgó</th><th style={th}>Interesados</th>
                </tr></thead>
                <tbody>
                    {porSaludo.map((b, i) => (
                        <tr key={b.saludo} style={{ background: b.interesados > 0 ? '#f0fdf4' : (b.n === 0 ? '#fafafa' : (i % 2 ? '#f8fafc' : '#fff')) }}>
                            <td style={{ ...td, fontWeight: 700 }}>Saludo {b.saludo}{b.interesados > 0 ? ' 🏆' : ''}{b.n === 0 ? ' (no probado)' : ''}</td>
                            <td style={td}>{b.n}</td>
                            <td style={td}>{b.si}</td>
                            <td style={{ ...td, fontWeight: 700, color: '#15803d' }}>{b.n ? pct(b.si, b.n) + '%' : '—'}</td>
                            <td style={td}>{b.colgaron}</td>
                            <td style={{ ...td, color: '#b91c1c' }}>{b.n ? pct(b.colgaron, b.n) + '%' : '—'}</td>
                            <td style={{ ...td, fontWeight: b.interesados > 0 ? 700 : 400, color: b.interesados > 0 ? '#15803d' : '#334155' }}>{b.interesados}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, marginBottom: '20px' }}>
                ⚠️ Muestra pequeña y desbalanceada (Saludo 5 y 1 concentran casi todo; Saludo 2 no se probó; Saludo 3 solo 1 vez).
                Además el saludo está mezclado con el asesor → los % ayudan a comparar, pero aún no es concluyente.
            </p>

            {/* Resultados por asesor */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>Resultados por asesor</h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, marginBottom: '10px' }}>
                Separa si el resultado es por el saludo o por la persona. <strong>Rosselin</strong> fue la única que probó varios saludos — y su único interés fue con Saludo 3.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead><tr style={{ background: '#0f172a' }}>
                    <th style={th}>Asesor</th><th style={th}>Saludos usados</th><th style={th}>Llamadas</th>
                    <th style={th}>Siguieron</th><th style={th}>Colgaron</th><th style={th}>Interesados</th>
                </tr></thead>
                <tbody>
                    {porAsesor.map((a, i) => (
                        <tr key={a.asesor} style={{ background: a.interesados > 0 ? '#f0fdf4' : (i % 2 ? '#f8fafc' : '#fff') }}>
                            <td style={{ ...td, fontWeight: 600 }}>{a.asesor}</td>
                            <td style={td}>{[...a.saludos].sort().map(s => `S${s}`).join(', ')}</td>
                            <td style={td}>{a.n}</td>
                            <td style={td}>{a.si} ({pct(a.si, a.n)}%)</td>
                            <td style={td}>{a.colgaron}</td>
                            <td style={{ ...td, fontWeight: a.interesados > 0 ? 700 : 400, color: a.interesados > 0 ? '#15803d' : '#334155' }}>{a.interesados}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Motivos de no-conversión */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>Motivos de no-conversión (de las {TRANSCRIPCIONES.length} con audio)</h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, marginBottom: '10px' }}>
                Categorizado de las transcripciones → muchas caen por la <strong>base fría</strong> (leads viejos), no por el saludo.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead><tr style={{ background: '#0f172a' }}>
                    <th style={th}>Motivo</th><th style={th}>Llamadas</th>
                </tr></thead>
                <tbody>
                    {MOTIVOS.map((m, i) => (
                        <tr key={m.motivo} style={{ background: i % 2 ? '#f8fafc' : '#fff' }}>
                            <td style={td}>{m.motivo}</td>
                            <td style={td}>{m.n}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Insight destacado */}
            <div style={{
                borderLeft: `5px solid ${ACCENT}`, background: 'linear-gradient(90deg, #fff5f7 0%, transparent 85%)',
                borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: '24px'
            }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: ACCENT, marginBottom: '6px' }}>💡 El patrón que engancha</div>
                <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                    El saludo que genera conexión <strong>(1) le dice al cliente el plan específico</strong> que registró (no le pide
                    que lo recuerde) y <strong>(2) se enmarca como "seguimiento"</strong>, no como venta. Los que fracasan piden al
                    cliente que <em>"recuerde cuál plan le interesó"</em> (nunca recuerda → punto muerto) o admiten de entrada que es
                    <em>"una llamada de ventas"</em> (dispara el rechazo).
                </p>
            </div>

            {/* Análisis de transcripciones */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>Análisis de las transcripciones</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {/* Ganador */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '13px', marginBottom: '8px' }}>🟢 Lo que funciona — Saludo 4 / 3</div>
                    <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 8px' }}>
                        "…no le voy a quitar mucho tiempo. Queremos validar si pudo recibir la información. <strong>Vimos que estaba
                        interesado en el plan de salud</strong>. ¿Le dieron la información? ¿Le quedó clara?"
                    </p>
                    <p style={{ fontSize: '12px', color: '#15803d', lineHeight: 1.6, margin: 0 }}>
                        → Fue la conversación más profunda: el cliente preguntó <strong>"¿qué hay que hacer?"</strong> y habló de
                        cobertura, ciudad y pago. El único "interesado" fue con Saludo 3 (mismo estilo consultivo).
                    </p>
                </div>
                {/* Falla */}
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '13px', marginBottom: '8px' }}>🔴 Lo que falla — Saludo 1 / 5</div>
                    <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 6px' }}>
                        Saludo 1: "¿<strong>Recuerda</strong> cuál fue el que le llamó la atención?" → cliente: <em>"No, la verdad no recuerdo."</em>
                    </p>
                    <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                        Saludo 5: "<strong>Me matas si le digo que esto es una llamada de ventas</strong>." → dispara evasión y confusión.
                    </p>
                </div>
            </div>

            {/* Transcripciones + análisis por llamada */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>Transcripciones de las llamadas con audio ({TRANSCRIPCIONES.length}) — análisis individual</h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, marginBottom: '14px' }}>
                De las {total} llamadas, CL Tiene envió {TRANSCRIPCIONES.length} con audio (transcritas con NotebookLM). Las otras {total - TRANSCRIPCIONES.length} no tienen transcripción disponible.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {TRANSCRIPCIONES.map((t, i) => {
                    const c = colorSiguio(t.siguio);
                    const esGanador = t.saludo === 4 || t.saludo === 3;
                    return (
                        <div key={i} style={{ border: `1px solid ${esGanador ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '10px', overflow: 'hidden' }}>
                            {/* header llamada */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', padding: '10px 14px', background: esGanador ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>Saludo {t.saludo}{esGanador ? ' 🏆' : ''}</span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>· {t.asesor}</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>· {t.celular}</span>
                                <span style={{ marginLeft: 'auto', background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 600 }}>{t.siguio === 'COLGARON' ? 'COLGÓ' : t.siguio}</span>
                                <span style={{ background: t.interesado === 'SI' ? '#dcfce7' : '#f1f5f9', color: t.interesado === 'SI' ? '#15803d' : '#94a3b8', padding: '2px 8px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 600 }}>{t.interesado === 'SI' ? 'INTERESADO' : 'no interesado'}</span>
                            </div>
                            {/* chat */}
                            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {t.turns.map((turn, j) => {
                                    const esAgente = turn[0] === 'A';
                                    return (
                                        <div key={j} style={{ display: 'flex', justifyContent: esAgente ? 'flex-end' : 'flex-start' }}>
                                            <div style={{ maxWidth: '82%', background: esAgente ? '#eef2f7' : '#fff1e6', color: '#334155', padding: '7px 12px', borderRadius: '10px', fontSize: '12px', lineHeight: 1.5 }}>
                                                <span style={{ fontWeight: 700, color: esAgente ? '#475569' : '#c2410c', fontSize: '9.5px', display: 'block', marginBottom: '2px', letterSpacing: '0.4px' }}>{esAgente ? 'ASESOR' : 'CLIENTE'}</span>
                                                {turn[1]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* analisis */}
                            <div style={{ padding: '10px 14px', background: '#fffbeb', borderTop: '1px solid #fef3c7', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                                <strong style={{ color: '#b45309' }}>Análisis:</strong> {t.analisis}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recomendación */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '13px', marginBottom: '6px' }}>✅ Recomendación</div>
                <ul style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.7, margin: 0, paddingLeft: '18px' }}>
                    <li>Estandarizar el estilo <strong>Saludo 4/3</strong> para todos los asesores: nombrar el plan que dejó registrado + framing de seguimiento.</li>
                    <li>Eliminar el <em>"¿recuerda cuál plan?"</em> y el <em>"me matas, es una llamada de ventas"</em>.</li>
                    <li>Para que la prueba sea válida: mismo nº de llamadas por saludo, rotar los 5 saludos entre todos los asesores, incluir el Saludo 2 y una muestra mayor.</li>
                    <li>Ojo: la base es fría (leads viejos); varios ya resolvieron por otro lado o tienen barreras → aun con el saludo perfecto convierte poco.</li>
                </ul>
            </div>

            {/* Conclusión y próximos pasos */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: `5px solid ${ACCENT}`, borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: ACCENT, marginBottom: '6px' }}>🎯 Conclusión y próximos pasos</div>
                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.7, margin: '0 0 8px' }}>
                    El estilo <strong>consultivo (Saludo 4/3)</strong> — nombrar el plan y enmarcar la llamada como seguimiento — es el que genera conversación real, y el único interés se dio con Saludo 3. Los saludos <strong>1 y 5</strong> se caen por pedir "recuerde" o por marcar "venta" de entrada. Pero el techo lo pone la <strong>base fría</strong>: de las {TRANSCRIPCIONES.length} con audio, la mayoría no convirtió por razones ajenas al saludo (ya resolvió, barrera económica, no recuerda).
                </p>
                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                    <strong>Próximos pasos:</strong> pedir a CL Tiene (1) el <strong>texto de los 5 saludos</strong>, (2) el <strong>audio del único interesado</strong> (Saludo 3), y (3) correr una <strong>prueba balanceada</strong> (mismo nº por saludo, rotando entre todos los asesores).
                </p>
            </div>

            {/* Tabla detallada */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>Registro de llamadas ({total})</h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, marginBottom: '12px' }}>
                📄 = llegó con transcripción (audio enviado). <strong>{TRANSCRIPCIONES.length} de {total}</strong>: 4 de Saludo 1, 2 de Saludo 5, 1 de Saludo 4 (no hay audio del Saludo 3 interesado ni del Saludo 2).
            </p>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#0f172a' }}>
                        <th style={th}>Fecha</th><th style={th}>Asesor</th><th style={th}>Celular</th>
                        <th style={th}>Saludo</th><th style={th}>¿Siguió?</th><th style={th}>Interesado</th><th style={th}>Transcrip.</th>
                    </tr></thead>
                    <tbody>
                        {RESULTADOS.map((r, i) => {
                            const c = colorSiguio(r.siguio);
                            const tiene = TRANSCRITAS.has(r.celular);
                            return (
                                <tr key={i} style={{ background: r.interesado === 'SI' ? '#f0fdf4' : (i % 2 ? '#f8fafc' : '#fff') }}>
                                    <td style={td}>{r.fecha}</td>
                                    <td style={td}>{r.asesor}</td>
                                    <td style={{ ...td, fontFamily: 'monospace', fontSize: '11px' }}>{r.celular}</td>
                                    <td style={{ ...td, fontWeight: 600 }}>Saludo {r.saludo}</td>
                                    <td style={td}>
                                        <span style={{ background: c.bg, color: c.fg, padding: '2px 8px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 600 }}>
                                            {r.siguio === 'COLGARON' ? 'COLGÓ AL SALUDAR' : r.siguio}
                                        </span>
                                    </td>
                                    <td style={{ ...td, fontWeight: r.interesado === 'SI' ? 700 : 400, color: r.interesado === 'SI' ? '#15803d' : '#334155' }}>{r.interesado}</td>
                                    <td style={{ ...td, textAlign: 'center' }}>{tiene ? '📄' : '—'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PruebaSaludos;
