"""
Script autónomo: extrae datos del SQL Server de la CUN, procesa y sube a BigQuery.
Ejecutar desde un PC con sesión activa de la CUN (usa Windows Auth automáticamente).
"""

import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
import pandas as pd
import re
from google.cloud import bigquery

# ─── Configuración ───────────────────────────────────────────────────────────────

SQL_HOST     = "172.16.1.33"
SQL_PORT     = "1433"
SQL_DATABASE = "CUN_REPOSITORIO"

BQ_PROJECT = "desarrollo-investigaciones"
BQ_DATASET = "call_center"
BQ_TABLA   = "cltiene_llamadas_procesadas"

LOG_FILE = os.path.join(os.path.dirname(__file__), "subir_datos.log")


# ─── Logger ──────────────────────────────────────────────────────────────────────

def log(msg):
    linea = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(linea)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(linea + "\n")


# ─── SQL Server con Windows Auth ─────────────────────────────────────────────────

def cargar_desde_sql():
    url = (
        f"mssql+pyodbc://@{SQL_HOST}:{SQL_PORT}/{SQL_DATABASE}"
        f"?trusted_connection=yes&driver=SQL+Server"
    )
    engine = create_engine(url)

    sql = text("""
        WITH registros_unicos AS (
            SELECT cuenta,
                   TRY_CONVERT(datetime, fecha, 120) AS fecha,
                   COUNT(*) AS cant
            FROM CUN_REPOSITORIO.coe.CLTIENE_LLAMADAS
            WHERE TRY_CONVERT(datetime, fecha, 120) IS NOT NULL
            GROUP BY cuenta, TRY_CONVERT(datetime, fecha, 120)
        )
        SELECT
            TRY_CONVERT(datetime, b.Fecha, 120)          AS Fecha,
            b.[Contacto (Identificacion - Nombre],
            b.[Telefono], b.[Agente], b.[Cuenta],
            b.[Modulo], b.[Nombre del Modulo], b.[Motivo],
            b.[Estado de la LLamada],
            b.[Tiempo  de Llamada],
            b.[Tiempo  de Conversacion],
            b.[Estado de Registro], b.[Estado de Gestion],
            b.[Calificacion de la Llamada],
            b.[Direccion grabacion#1], b.[Direccion grabacion#2],
            b.[Direccion grabacion#3], b.[Direccion grabacion#4],
            b.[Direccion grabacion#5], b.[Direccion grabacion#6],
            b.[Direccion grabacion#7],
            b.[Comentario], b.[archivo],
            b.[saludo_inicial], b.[identificacion_cliente],
            b.[comprension_problema], b.[ofrecimiento_solucion],
            b.[manejo_inquietudes], b.[cierre_servicio], b.[proximo_paso],
            b.[efectiva], b.[polarity], b.[subjectivity],
            b.[clasificacion], b.[confianza], b.[palabras],
            b.[IDENTIFICACION], b.[fecha_carga], b.[transcripcion],
            b.[Tipo_Llamada],
            CASE WHEN a.cant > 1 THEN 'mixto' ELSE b.tipo END AS tipo
        FROM CUN_REPOSITORIO.coe.CLTIENE_LLAMADAS b
        INNER JOIN registros_unicos a
            ON a.cuenta = b.cuenta
           AND a.fecha  = TRY_CONVERT(datetime, b.fecha, 120)
    """)

    with engine.connect() as conn:
        df = pd.read_sql_query(sql, conn)

    return df


# ─── Patrones V4 ─────────────────────────────────────────────────────────────────

P_ASESOR = [
    r'tengo\s+(?:el\s+gusto|la\s+oportunidad|la\s+opción)\s+de\s+(?:comunicarme|contactarme|contactar)',
    r'(?:me\s+)?(?:estoy|estamos)\s+comunic(?:ando|o)',
    r'nos\s+(?:estamos\s+)?comunic(?:ando|amos)',
    r'habl[aá][rs]?\s+(?:con|nuevamente)',
    r'(?:sele?|cl|ese\s*le|cle)\s*tiene',
    r'(?:soy|mi\s+nombre\s+es)\s+[A-ZÁ-Úa-zá-ú]+\s+(?:[A-ZÁ-Ú]|de\s+)',
    r'mucho\s+gusto\.?\s+(?:soy|mi\s+nombre)',
    r'nuestro[as]?\s+(?:plan|servicio|parámetro|asistencia|línea)',
    r'el\s+motivo\s+de\s+(?:mi|la)\s+llamada',
    r'registro\s+(?:que\s+)?(?:hiciste|realizaste|hizo|realizó)',
    r'solicitud\s+que\s+(?:hiciste|realizaste|hizo)',
    r'te\s+(?:contacto|llamo|comunico)\s+(?:ya\s+)?(?:con|para|porque|por)',
    r'queremos\s+validar', r'quisi[eé]ramos\s+validar',
    r'te\s+(?:explico|comento|indico)',
    r'lo\s+que\s+(?:nosotros|te)\s+(?:hacemos|ofrecemos|brindamos)',
    r'me\s+confirmas?\s+(?:por\s+favor\s+)?(?:tu|el|la|los|su)',
    r'permíteme', r'vamos\s+a\s+validar',
    r'(?:con\s+gusto)\s+(?:que\s+)?tengas?\s+(?:un\s+)?(?:buen|excelente)\s+día',
    r'feliz\s+(?:día|tarde|noche)',
    r'te\s+(?:voy\s+a\s+)?(?:generar|enviar|compartir|escribir)',
    r'estaré\s+contactando',
    r'(?:señora?|señorita)\s+[A-ZÁ-Ú][a-zá-ú]+,?\s+(?:mucho\s+gusto|necesito|quería)',
    r'de\s+pronto\s+(?:algún|alguna)',
    r'el\s+día\s+de\s+ayer\s+realizaste',
    r'^(?:te|le)\s+(?:entiendo|comprendo)',
    r'(?:ya\s+)?te\s+(?:escribí|envié|mandé|compartí)',
    r'(?:entonces\s+)?(?:ya\s+)?te\s+(?:escribo|envío|mando|comparto)',
    r'te\s+(?:voy\s+a\s+)?(?:dejar|enviar|mandar|compartir|escribir)\s+(?:un\s+)?(?:mensaj|whatsapp|link|enlace)',
    r'^se\s+(?:le|te)\s+agradece',
    r'^nosotros\s+(?:manejamos|ofrecemos|brindamos|somos|tenemos)',
    r'(?:no\s+)?somos\s+un\s+servicio',
    r'(?:manejamos|ofrecemos|brindamos)\s+(?:cobertura|servicio|asistencia|plan)',
    r'(?:algún|alg[uú]n)\s+motivo\s+(?:por\s+(?:el\s+)?cual|de\s+pronto)',
    r'^(?:ah[,\s]+)?listo[,\s]+perfecto[,\s]+(?:sí\s+)?(?:señor|señora|don)',
    r'(?:ya\s+)?(?:dejo|queda)\s+(?:la\s+)?(?:constancia|registro|nota|anotación)',
    r'^(?:disculp[ea]me|perdón|perdona)\s+(?:por|la\s+molestia)',
    r'^qué\s+pena\b',
]

P_ASESOR_FUERTE = [
    r'habl[aá][rs]?\s+con', r'tiene\s*soluciones', r'me\s+estoy\s+comunic',
    r'tengo\s+(?:el\s+gusto|la\s+opción)', r'nuestro[as]?\s+(?:plan|servicio|asistencia)',
    r'queremos\s+validar', r'realizaste\s+(?:un\s+)?registro',
    r'(?:no\s+)?somos\s+un\s+servicio',
    r'^nosotros\s+(?:manejamos|ofrecemos|brindamos|somos|tenemos)',
    r'(?:algún|alg[uú]n)\s+motivo\s+(?:por\s+(?:el\s+)?cual|de\s+pronto)',
]

P_CLIENTE = [
    r'^aló\b', r'^hola\b(?!\s*[,.]?\s*(?:muy\s+)?(?:buenos?|buenas?))',
    r'^no[\s,]+no\b', r'^sí[\s,]+señora?\b(?!\s*\.?\s*(?:mira|habla|estoy|me\s+estoy|soy|de))',
    r'^no[\s,]+señora?\b',
    r'^¿(?:de\s+parte\s+de\s+quién|quién\s+(?:habla|llama|lo\s+llama))',
    r'^¿(?:y\s+eso|eso)\s+(?:de\s+)?qué\s+(?:se\s+trata|es)',
    r'^(?:con\s+ella?\s+(?:habla|hablo))',
    r'^soy\s+yo\b', r'^no\s+(?:gracias|me\s+interesa|estoy\s+interesad)',
    r'^yo\s+no\s+(?:hice|realicé|pedí|registré)',
    r'^¿cuánto\s+(?:es|cuesta|vale)', r'^¿cómo\s+(?:sería|es|hago|funciona)',
    r'(?:está|numero)\s+equivocad', r'no\s+(?:lo|la)\s+conozco', r'no\s+vive\s+(?:aquí|acá)',
]

P_RESPUESTA_CLIENTE = [
    r'^sí[\s,\.]+', r'^no[\s,\.]+', r'^ah[\s,]+no', r'^bueno[\s,\.]*$',
    r'^bueno[\s,]+gracias', r'^es\s+que\s+', r'^pues\s+',
    r'^¿de\s+', r'^¿y\s+', r'^ya[\s,\.]*$', r'^listo[\s,\.]*$',
    r'^dale[\s,\.]*$', r'^ok[\s,\.]*$', r'^claro[\s,\.]*', r'^ajá[\s,\.]*',
    r'^a\s+mí\s+no\s+me', r'^yo\s+no\s+', r'^están\s+equivocad',
    r'no\s+(?:era|es)\s+eso',
]

P_RESPUESTA_INFORMATIVA = [
    r'^(?:eh[,\s]+)?no\s+se\s+encuentra',
    r'^(?:eh[,\s]+)?(?:ella?|él)\s+no\s+(?:se\s+encuentra|está)',
    r'^(?:no\s+)?está\s+(?:ocupad[oa]|trabaj|fuera|enferm)',
    r'^(?:por\s+ahí|como|más\s+o\s+menos|aproximadamente)\s+(?:en|a\s+las?|de|después)',
    r'^(?:en|como\s+en)\s+(?:unas?\s+)?(?:\d+|dos|tres|cuatro|cinco)\s+horas?',
    r'^más\s+(?:tarde|tardesito|temprano)',
    r'^(?:a\s+las?\s+)?\d+\s*(?:de\s+la\s+(?:mañana|tarde|noche))',
    r'^se\s+llama\s+',
    r'^(?:ella?|él)\s+(?:tiene|es|vive|trabaja|llega|sale)',
    r'^(?:yo\s+)?(?:vivo|estoy|trabajo|soy)\s+',
    r'^yo\s+(?:me\s+)?(?:vine|fui|vengo|voy|necesit|quer[ií]a|estaba|estoy|tengo)',
    r'no\s+tengo\s+(?:animal|mascot|perr|gat)',
    r'no\s+tengo\s+(?:carro|moto|vehículo)',
    r'^para\s+(?:el\s+)?(?:perrit|gatit|perr[oa]\b|gat[oa]\b|carro|moto|hogar)',
    r'(?:env[ií][ae]|mand[ae]).*(?:whatsapp|mensaje|correo)',
]

P_DESPEDIDA_CLIENTE = [
    r'(?:que\s+)?(?:te|le|les)\s+vaya\s+(?:bien|muy\s+bien)',
    r'(?:que\s+)?tengas?\s+(?:un\s+)?(?:buen|bonito|lindo|excelente)\s+(?:día|tarde|noche)',
    r'^hasta\s+(?:luego|pronto|la\s+(?:próxima|vista)|mañana)',
    r'^chao\b', r'^chau\b', r'^adiós\b',
    r'^(?:muchas?\s+)?gracias(?:\s+(?:igualmente|también|a\s+(?:ti|usted|ustedes)))?\s*[\.!]?$',
    r'^igualmente\s*[\.!]?$',
    r'^(?:muy\s+)?amable(?:\s+gracias)?\s*[\.!]?$',
    r'^bueno[\s,]+(?:muchas?\s+)?gracias',
]

P_DESPEDIDA_ASESOR = [
    r'con\s+gusto\s+(?:que\s+)?tengas?\s+(?:un\s+)?(?:buen|excelente)\s+día',
    r'feliz\s+(?:día|tarde|noche|resto)\s+(?:de\s+)?(?:día|tarde)',
    r'estaré\s+(?:contactando|llamando|pendiente)',
    r'(?:fue|ha\s+sido)\s+un\s+(?:gusto|placer)',
    r'quedamos?\s+(?:atentos?|pendientes?)',
    r'feliz\s+(?:día|tarde|noche)\s*[\.!]?$',
]

P_AGRADECIMIENTO_ASESOR = [
    r'^(?:no[\s,]+)?s[ií][\s,]+(?:dale|claro|señora?)',
    r'^dale[\s,]+(?:much[ao]s?\s+)?gracias',
    r'^(?:listo|bueno|dale)[\s,]+(?:te\s+)?agradez',
    r'^(?:muchas?\s+)?gracias[\s,]+(?:te|le)\s+(?:agradezco|agradecemos)',
    r'(?:te|le)\s+agradezco',
]


# ─── Catálogo de asistencias ──────────────────────────────────────────────────────

CATALOGO_ASISTENCIAS = [
    ('Grúa para carro',                    r'gr[uú]a\s+(?:para\s+)?(?:el\s+)?carro|servicio\s+de\s+gr[uú]a(?!\s+(?:para\s+)?moto)'),
    ('Grúa para moto',                     r'gr[uú]a\s+(?:para\s+)?(?:la\s+)?moto'),
    ('Cambio de llanta',                   r'cambio\s+de\s+llanta'),
    ('Reinicio de batería',                r'reinicio\s+de\s+bater[ií]a|paso\s+de\s+corriente'),
    ('Conductor elegido',                  r'conductor\s+elegido'),
    ('Cerrajería vial',                    r'cerrajer[ií]a\s+vial'),
    ('Cerrajería por urgencia',            r'cerrajer[ií]a\s+(?:por\s+)?urgencia|cerrajero\s+(?:urgente|de\s+urgencia)'),
    ('Plomería por urgencia',              r'plomer[ií]a\s+(?:por\s+)?urgencia|plomero\s+(?:urgente|de\s+urgencia)'),
    ('Electricista por urgencia',          r'electricist[ao]\s+(?:por\s+)?urgencia'),
    ('Armado de muebles a domicilio',      r'armado\s+de\s+muebles'),
    ('Handyman o todero',                  r'handyman|todero'),
    ('Instalación de duchas',              r'instalaci[oó]n\s+de\s+duchas'),
    ('Instalación de electrodomésticos',   r'instalaci[oó]n\s+de\s+electrodom[eé]sticos'),
    ('Mantenimiento de calentador',        r'mantenimiento\s+de\s+calentador'),
    ('Mantenimiento de estufas',           r'mantenimiento\s+de\s+estufas?'),
    ('Mantenimiento de lavadoras',         r'mantenimiento\s+de\s+lavadoras?'),
    ('Mantenimiento de nevera',            r'mantenimiento\s+de\s+nevera'),
    ('Mantenimiento de bicicletas',        r'mantenimiento\s+de\s+bicicletas?'),
    ('Veterinario en casa o en clínica',   r'veterinario\s+(?:en\s+casa|a\s+domicilio|en\s+cl[ií]nica)'),
    ('Atención veterinaria telefónica',    r'atenci[oó]n\s+veterinaria\s+telef[oó]nica'),
    ('Desparasitación',                    r'desparasita'),
    ('Refuerzo de vacunas',                r'refuerzo\s+de\s+vacunas|vacunaci[oó]n'),
    ('Chip de identificación',             r'chip\s+de\s+identificaci[oó]n'),
    ('Limpieza dental',                    r'limpieza\s+dental'),
    ('Valoración por urgencia dental',     r'valoraci[oó]n\s+(?:por\s+)?urgencia\s+dental|urgencia\s+dental'),
    ('Médico a domicilio',                 r'm[eé]dico\s+a\s+domicilio'),
    ('Pediatra a domicilio',               r'pediatra\s+a\s+domicilio'),
    ('Psicólogo a domicilio',              r'psic[oó]logo\s+a\s+domicilio'),
    ('Videollamada con médico general',    r'videollamada\s+con\s+m[eé]dico\s+general|videollamada\s+m[eé]dic'),
    ('Videollamada con médico pediatra',   r'videollamada\s+con\s+(?:m[eé]dico\s+)?pediatra'),
    ('Orientación médica telefónica',      r'orientaci[oó]n\s+m[eé]dica\s+telef[oó]nica'),
    ('Orientación nutricional telefónica', r'orientaci[oó]n\s+nutricional'),
    ('Orientación psicológica telefónica', r'orientaci[oó]n\s+psicol[oó]gica'),
    ('Acompañante a citas médicas',        r'acompa[nñ]ante\s+(?:a\s+)?citas\s+m[eé]dicas?'),
    ('Declaración de renta',               r'declaraci[oó]n\s+de\s+renta'),
]


# ─── Funciones de estructuración V4 ──────────────────────────────────────────────

def detectar_hablante(oracion, hablante_prev, prev_pregunta_asesor, es_final=False,
                      prev_agradecimiento_asesor=False, prev_despedida_cliente=False):
    o_lower = oracion.lower().strip()
    longitud = len(oracion.strip())

    es_asesor = any(re.search(p, o_lower, re.IGNORECASE) for p in P_ASESOR)
    es_cliente = any(re.search(p, o_lower) for p in P_CLIENTE)

    if es_asesor and not es_cliente: return 'Asesor'
    if es_cliente and not es_asesor: return 'Cliente'
    if es_asesor and es_cliente:
        return 'Asesor' if any(re.search(p, o_lower, re.IGNORECASE) for p in P_ASESOR_FUERTE) else 'Cliente'

    if any(re.search(p, o_lower) for p in P_AGRADECIMIENTO_ASESOR):
        return 'Asesor'

    if es_final or hablante_prev == 'Asesor':
        es_despedida_cliente = any(re.search(p, o_lower) for p in P_DESPEDIDA_CLIENTE)
        es_despedida_asesor = any(re.search(p, o_lower) for p in P_DESPEDIDA_ASESOR)
        if es_despedida_cliente and not es_despedida_asesor:
            return 'Cliente'
        if es_despedida_asesor and not es_despedida_cliente:
            return 'Asesor'

    if longitud <= 60:
        if any(re.search(p, o_lower) for p in P_RESPUESTA_CLIENTE):
            return 'Cliente'
        if any(re.search(p, o_lower) for p in P_RESPUESTA_INFORMATIVA):
            return 'Cliente'
        if prev_pregunta_asesor and longitud < 45:
            return 'Cliente'

    if prev_pregunta_asesor and longitud < 80:
        if any(re.search(p, o_lower) for p in P_RESPUESTA_INFORMATIVA):
            return 'Cliente'

    if longitud < 100:
        if any(re.search(p, o_lower) for p in P_RESPUESTA_INFORMATIVA):
            if not any(re.search(p, o_lower, re.IGNORECASE) for p in P_ASESOR):
                return 'Cliente'

    if hablante_prev == 'Cliente' and longitud > 60:
        if not any(re.search(p, o_lower) for p in P_DESPEDIDA_CLIENTE):
            return 'Asesor'

    return None


def split_oraciones_v4(texto):
    oraciones = re.split(r'(?<=[.!?])\s+', texto)
    resultado = []
    resp_patterns = [
        r'^(?:eh[,\s]+)?(?:no\s+se\s+encuentra|no\s+está|está\s+ocupad)',
        r'^(?:por\s+ahí|como|más\s+o\s+menos)',
        r'^(?:sí|no|bueno|claro|dale|ok|ajá|listo)[\s,\.]',
        r'^(?:ella?|él)\s+(?:no\s+)?(?:se\s+encuentra|está|salió|tiene)',
    ]
    for oracion in oraciones:
        oracion = oracion.strip()
        if not oracion:
            continue
        match = re.search(r'\?\s+(.+)$', oracion)
        if match:
            respuesta = match.group(1).strip()
            if len(respuesta) < 60 and any(re.search(p, respuesta.lower()) for p in resp_patterns):
                pregunta = oracion[:match.start() + 1]
                if pregunta.strip():
                    resultado.append(pregunta.strip())
                    resultado.append(respuesta)
                    continue
        resultado.append(oracion)
    return resultado


def estructurar_dialogo(texto):
    if pd.isna(texto) or not texto:
        return None
    texto = str(texto).strip()
    if len(texto) < 10:
        return None

    oraciones = split_oraciones_v4(texto)
    total_oraciones = len(oraciones)
    asignaciones = []
    hablante_prev = None
    prev_pregunta = False
    prev_agradecimiento = False
    prev_despedida_cli = False

    for i, oracion in enumerate(oraciones):
        oracion = oracion.strip()
        if not oracion:
            continue

        es_final = (i >= total_oraciones - 3)
        hablante = detectar_hablante(oracion, hablante_prev, prev_pregunta, es_final,
                                     prev_agradecimiento, prev_despedida_cli)

        if i == 0 and hablante is None:
            fl = oracion.lower()
            if re.match(r'^(?:muy\s+)?(?:buenos?|buenas?)\s+(?:días|tardes|noches)', fl):
                hablante = 'Asesor'
            elif re.match(r'^aló', fl):
                hablante = 'Cliente'
            else:
                hablante = 'Asesor'

        if hablante:
            hablante_prev = hablante
        else:
            hablante = hablante_prev

        o_lower_check = oracion.lower().strip()
        es_pregunta = '?' in oracion or bool(re.search(
            r'(?:validar|confirmar|saber|verificar)\s+si\s+', o_lower_check))

        if hablante == 'Asesor' and es_pregunta:
            prev_pregunta = True
        else:
            prev_pregunta = False

        prev_agradecimiento = (hablante == 'Asesor' and
            any(re.search(p, o_lower_check) for p in P_AGRADECIMIENTO_ASESOR))
        prev_despedida_cli = (hablante == 'Cliente' and
            any(re.search(p, o_lower_check) for p in P_DESPEDIDA_CLIENTE))
        asignaciones.append({'texto': oracion, 'hablante': hablante})

    if not asignaciones:
        return None
    if asignaciones[0]['hablante'] is None:
        asignaciones[0]['hablante'] = 'Asesor'
    for i in range(1, len(asignaciones)):
        if asignaciones[i]['hablante'] is None:
            asignaciones[i]['hablante'] = asignaciones[i-1]['hablante']

    bloques = []
    bloque = {'hablante': asignaciones[0]['hablante'], 'textos': [asignaciones[0]['texto']]}
    for i in range(1, len(asignaciones)):
        if asignaciones[i]['hablante'] == bloque['hablante']:
            bloque['textos'].append(asignaciones[i]['texto'])
        else:
            bloques.append(bloque)
            bloque = {'hablante': asignaciones[i]['hablante'], 'textos': [asignaciones[i]['texto']]}
    bloques.append(bloque)

    return '\n'.join(f"[{b['hablante']}]: {' '.join(b['textos'])}" for b in bloques)


# ─── Funciones de detección ───────────────────────────────────────────────────────

def detectar_duracion_estimada(tiempo_str):
    if pd.isna(tiempo_str) or not tiempo_str:
        return "Sin Datos"
    try:
        partes = str(tiempo_str).strip().split(':')
        if len(partes) == 3:
            segundos = int(partes[0]) * 3600 + int(partes[1]) * 60 + int(partes[2])
        elif len(partes) == 2:
            segundos = int(partes[0]) * 60 + int(partes[1])
        else:
            return "Sin Datos"
    except Exception:
        return "Sin Datos"
    if segundos <= 30:  return "Buzón"
    if segundos <= 60:  return "Muy Corta"
    if segundos <= 120: return "Corta"
    if segundos <= 300: return "Media"
    return "Larga"


def detectar_plan(texto):
    if pd.isna(texto) or not texto:
        return 'Sin transcripción'
    tl = str(texto).lower()
    planes = []
    if re.search(r'(?:plan\s+)?manad[aá]|plan\s+maná', tl):
        planes.append('Plan Manada')
    if re.search(r'(?:plan\s+)?premium', tl):
        planes.append('Plan Premium')
    if re.search(r'(?:plan\s+(?:de\s+)?)?mascota|asistencia\s+(?:de\s+)?mascota'
                 r'|(?:perrit[oa]|gatit[oa]|perro|gato)\b'
                 r'|veterinari[oa]|desparasita|chip\s+de\s+identificaci[oó]n'
                 r'|refuerzo\s+de\s+vacunas|cremaci[oó]n'
                 r'|atenci[oó]n\s+veterinaria|limpieza\s+dental', tl):
        planes.append('Plan Mascotas')
    if re.search(r'(?:plan\s+(?:de\s+)?)?salud|m[eé]dico\s+a\s+domicilio|pediatra\s+a\s+domicilio'
                 r'|videollamada\s+con\s+m[eé]dico|orientaci[oó]n\s+m[eé]dica'
                 r'|orientaci[oó]n\s+(?:nutricional|psicol[oó]gica)'
                 r'|psic[oó]logo\s+a\s+domicilio|acompa[nñ]ante\s+a\s+citas'
                 r'|urgencia\s+dental|valoraci[oó]n\s+dental', tl):
        planes.append('Plan Salud')
    if re.search(r'(?:plan\s+(?:de\s+)?)?movilidad|gr[uú]a|veh[ií]cul|\bcarro\b|\bmoto\b'
                 r'|cambio\s+de\s+llanta|reinicio\s+de\s+bater[ií]a'
                 r'|conductor\s+elegido|cerrajer[ií]a\s+vial|paso\s+de\s+corriente', tl):
        planes.append('Plan Movilidad')
    if not planes:
        return 'No identificado'
    for esp in ['Plan Manada', 'Plan Premium']:
        if esp in planes:
            return esp
    return planes[0]


def detectar_asistencia(texto, plan_mencionado):
    if pd.isna(texto) or not texto:
        return 'No identificado'
    tl = str(texto).lower()
    detectadas = [nombre for nombre, patron in CATALOGO_ASISTENCIAS if re.search(patron, tl)]
    return ', '.join(detectadas) if detectadas else 'No identificado'


def detectar_resultado_llamada(texto, transcripcion_v4):
    if pd.isna(texto) or not texto:
        return "Sin Contacto"
    tl = str(texto).lower()
    if len(tl.strip()) < 50:
        return "Sin Contacto"
    if re.search(r'buz[oó]n\s+de\s+voz|correo\s+de\s+voz|deje\s+su\s+mensaje', tl):
        return "Buzón de Voz"
    turnos_cliente = transcripcion_v4.count('[Cliente]') if transcripcion_v4 else 0
    if turnos_cliente == 0 and len(tl.strip()) < 200:
        return "Buzón de Voz"
    if re.search(r'n[uú]mero\s+equivocado|no\s+(?:es\s+)?aqu[ií]|no\s+(?:lo\s+)?conozco|no\s+vive\s+aqu[ií]', tl):
        return "Número Equivocado"
    if re.search(r'no\s+se\s+encuentra|est[aá]\s+ocupad|llame\s+m[aá]s\s+tarde|no\s+puede\s+atender', tl):
        return "No Disponible"
    if re.search(r'procedemos|te\s+confirmo|queda\s+activ|listo[\s,]+(?:entonces\s+)?(?:queda|procedemos)', tl):
        return "Venta"
    if re.search(r'no\s+(?:me\s+)?interesa|no[\s,]+(?:no[\s,]+)?gracias|no\s+estoy\s+interesad'
                 r'|no\s+(?:quiero|necesito)', tl):
        return "Rechazado"
    if turnos_cliente >= 2:
        return "Contactado"
    return "Sin Clasificar"


def detectar_motivo_rechazo(texto, resultado_llamada):
    if resultado_llamada != "Rechazado":
        return "N/A"
    if pd.isna(texto) or not texto:
        return "Sin Motivo"
    tl = str(texto).lower()
    if re.search(r'ya\s+tengo|ya\s+cuento\s+con|ya\s+(?:estoy|tenemos)\s+(?:con|afiliado)', tl):
        return "Ya Tiene Servicio"
    if re.search(r'muy\s+caro|costoso|no\s+tengo\s+(?:plata|dinero)|no\s+(?:me\s+)?alcanza', tl):
        return "Precio"
    if re.search(r'yo\s+no\s+(?:hice|registr[eé])|no\s+(?:hice|realic[eé])\s+(?:ning[uú]n\s+)?registro', tl):
        return "No Recuerda Registro"
    if re.search(r'pens[eé]\s+que\s+era|cre[ií]\s+que|no\s+era\s+(?:eso|lo\s+que)', tl):
        return "Confusión"
    if re.search(r'no\s+tengo\s+(?:mascota|perro|gato|carro|moto|veh[ií]culo)', tl):
        return "No Aplica Servicio"
    return "No Interesa"


def detectar_tipo_mascota(texto, plan_mencionado):
    if plan_mencionado not in ["Plan Mascotas", "Plan Manada"]:
        return "N/A"
    if pd.isna(texto) or not texto:
        return "No especificado"
    tl = str(texto).lower()
    tiene_perro = bool(re.search(r'\bperr(?:o|ito|a|ita)s?\b|\bcachorro\b', tl))
    tiene_gato = bool(re.search(r'\bgat(?:o|ito|a|ita)s?\b|\bfelino\b', tl))
    if tiene_perro and tiene_gato: return "Ambos"
    if tiene_perro: return "Perro"
    if tiene_gato: return "Gato"
    return "No especificado"


def detectar_tipo_vehiculo(texto, plan_mencionado):
    if plan_mencionado != "Plan Movilidad":
        return "N/A"
    if pd.isna(texto) or not texto:
        return "No especificado"
    tl = str(texto).lower()
    es_moto = bool(re.search(r'\bmoto(?:cicleta|s)?\b|yamaha|bajaj|pulsar|\bakt\b', tl))
    es_carro = bool(re.search(r'\bcarro\b|\bcoche\b|\bveh[ií]culo\b|\bcamioneta\b'
                              r'|toyota|chevrolet|renault|mazda|hyundai|\bkia\b|nissan', tl))
    if es_moto and es_carro: return "Ambos"
    if es_moto: return "Moto"
    if es_carro: return "Carro"
    return "No especificado"


def detectar_saludo_completo(texto):
    if pd.isna(texto) or not texto:
        return "No"
    tl = str(texto).lower()
    n = sum([
        bool(re.search(r'tengo\s+el\s+gusto', tl)),
        bool(re.search(r'habl[aá]s?\s+con|me\s+llamo|soy\s+\w+\s+(?:de|desde)', tl)),
        bool(re.search(r'(?:cl[e ])?tiene\s*soluciones', tl)),
        bool(re.search(r'registro\s+que\s+(?:hiciste|realizaste|hizo)|me\s+(?:estoy\s+)?comunic', tl)),
    ])
    return "Sí" if n >= 3 else ("Parcial" if n >= 1 else "No")


def detectar_explico_beneficios(texto):
    if pd.isna(texto) or not texto:
        return "No"
    tl = str(texto).lower()
    beneficios = [
        r'beneficios?\b', r'servicio\s+de\s+gr[uú]a', r'videollamada',
        r'conductor\s+elegido', r'cambio\s+de\s+llanta', r'reinicio\s+de\s+bater[ií]a',
        r'asistencia\s+(?:24|las\s+24)', r'veterinari[oa]', r'cremaci[oó]n',
        r'cobertura\s+(?:a\s+nivel\s+)?nacional',
    ]
    matches = sum(1 for b in beneficios if re.search(b, tl))
    if matches >= 3: return "Sí"
    if matches >= 1: return "Parcial"
    return "No"


def detectar_ofrecio_whatsapp(texto):
    if pd.isna(texto) or not texto:
        return "No"
    tl = str(texto).lower()
    if re.search(r'(?:te\s+)?(?:env[ií]o|mando|dejo)\s+(?:un\s+)?(?:mensaje|informaci[oó]n)?\s*(?:por\s+)?whatsapp', tl):
        return "Sí"
    if re.search(r'whatsapp.*(?:env[ií]o|mando|escribo|informaci[oó]n)', tl):
        return "Sí"
    return "No"


def detectar_despedida_correcta(transcripcion_v4):
    if pd.isna(transcripcion_v4) or not transcripcion_v4:
        return "No"
    lineas = str(transcripcion_v4).strip().split('\n')
    ultimas = '\n'.join(lineas[-3:]).lower()
    for patron in [
        r'\[asesor\].*(?:que\s+)?(?:tenga|tengas)\s+(?:un\s+)?(?:buen|excelente)\s+(?:d[ií]a|tarde|noche)',
        r'\[asesor\].*feliz\s+(?:d[ií]a|tarde|noche)',
        r'\[asesor\].*hasta\s+(?:luego|pronto)',
        r'\[asesor\].*quedamos?\s+(?:atent[oa]s?|pendientes?)',
    ]:
        if re.search(patron, ultimas):
            return "Sí"
    return "No"


def contar_objeciones(texto):
    if pd.isna(texto) or not texto:
        return 0
    tl = str(texto).lower()
    patrones = [
        r'no\s+(?:me\s+)?interesa', r'no[\s,]+gracias',
        r'no\s+tengo\s+(?:tiempo|dinero|plata)', r'ya\s+tengo',
        r'muy\s+caro', r'no\s+puedo', r'no\s+(?:quiero|necesito)',
        r'ahora\s+no',
    ]
    return sum(len(re.findall(p, tl)) for p in patrones)


# ─── Procesamiento ────────────────────────────────────────────────────────────────

def procesar(df):
    df['Tipo_Llamada'] = df['Tipo_Llamada'].str.strip().replace({'Salientes': 'Saliente'})

    log("  Estructurando transcripciones V4...")
    df['Transcripcion_V4']  = df['transcripcion'].apply(estructurar_dialogo)
    df['Num_Turnos_V4']     = df['Transcripcion_V4'].apply(
        lambda x: x.count('[Asesor]') + x.count('[Cliente]') if pd.notna(x) else 0)
    df['Turnos_Asesor_V4']  = df['Transcripcion_V4'].apply(
        lambda x: x.count('[Asesor]') if pd.notna(x) else 0)
    df['Turnos_Cliente_V4'] = df['Transcripcion_V4'].apply(
        lambda x: x.count('[Cliente]') if pd.notna(x) else 0)

    log("  Detectando planes y asistencias...")
    df['Plan_Mencionado'] = df['transcripcion'].apply(detectar_plan)
    df['Asistencia']      = df.apply(
        lambda r: detectar_asistencia(r['transcripcion'], r['Plan_Mencionado']), axis=1)

    log("  Analizando resultados y calidad...")
    df['Resultado_Llamada'] = df.apply(
        lambda r: detectar_resultado_llamada(r['transcripcion'], r['Transcripcion_V4']), axis=1)
    df['Motivo_Rechazo']    = df.apply(
        lambda r: detectar_motivo_rechazo(r['transcripcion'], r['Resultado_Llamada']), axis=1)
    df['Tipo_Mascota']      = df.apply(
        lambda r: detectar_tipo_mascota(r['transcripcion'], r['Plan_Mencionado']), axis=1)
    df['Tipo_Vehiculo']     = df.apply(
        lambda r: detectar_tipo_vehiculo(r['transcripcion'], r['Plan_Mencionado']), axis=1)

    df['Duracion_Estimada']   = df['Tiempo  de Conversacion'].apply(detectar_duracion_estimada)
    df['Saludo_Completo']     = df['transcripcion'].apply(detectar_saludo_completo)
    df['Explico_Beneficios']  = df['transcripcion'].apply(detectar_explico_beneficios)
    df['Ofrecio_WhatsApp']    = df['transcripcion'].apply(detectar_ofrecio_whatsapp)
    df['Despedida_Correcta']  = df['Transcripcion_V4'].apply(detectar_despedida_correcta)
    df['Num_Objeciones']      = df['transcripcion'].apply(contar_objeciones)

    return df


# ─── Subida a BigQuery ────────────────────────────────────────────────────────────

def sanitizar_columnas(df):
    df = df.copy()
    df.columns = [re.sub(r'[^\w]', '_', c).strip('_') for c in df.columns]
    return df


def subir_bigquery(df):
    client = bigquery.Client(project=BQ_PROJECT)
    tabla  = f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLA}"
    df = sanitizar_columnas(df)
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        autodetect=True,
    )
    job = client.load_table_from_dataframe(df, tabla, job_config=job_config)
    job.result()
    return len(df)


# ─── Pipeline ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    log("=" * 60)
    log("INICIO DE CARGA AUTOMÁTICA")
    log("=" * 60)

    try:
        log("Conectando a SQL Server con cuenta CUN (Windows Auth)...")
        df = cargar_desde_sql()
        log(f"Filas cargadas: {len(df):,}")

        log("Procesando transcripciones...")
        df = procesar(df)

        log("Subiendo a BigQuery...")
        n = subir_bigquery(df)
        log(f"COMPLETADO: {n:,} filas subidas a {BQ_TABLA}")

    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)

    log("=" * 60)
