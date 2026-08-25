"""Fuente ÚNICA de constantes/fragmentos SQL compartidos.

Evita que la lógica de negocio (nombre de tabla, partición de "Contacto
Efectivo") se duplique y diverja entre archivos — que fue justo el bug del
embudo (mostraba un "Contactado" distinto al del chart). Cambiar la partición
aquí se refleja en el chart, el embudo y el reporte a la vez.
"""

# Tabla principal en BigQuery (con backticks para usar directo en f-strings).
TABLE = "`desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`"

# Partición de "Contacto Efectivo": se habló con la persona (CONTACTADO) vs no
# (SIN_CONTACTO). Son EXCLUYENTES y juntas cubren todos los Resultado_Llamada.
CONTACTADO = ("Contactado", "Rechazado", "Venta")
SIN_CONTACTO = (
    "No Disponible", "Buzón de Voz", "Número Equivocado",
    "Sin Contacto", "Sin Clasificar",
)


def sql_in(column: str, values) -> str:
    """Construye el fragmento SQL `column IN ('a', 'b', ...)` desde una tupla,
    para que el SQL y el Python usen la MISMA fuente (CONTACTADO / SIN_CONTACTO)."""
    lista = ", ".join("'" + str(v).replace("'", "\\'") + "'" for v in values)
    return f"{column} IN ({lista})"


# Fragmentos SQL precomputados (la partición sobre Resultado_Llamada).
CONTACTADO_SQL = sql_in("Resultado_Llamada", CONTACTADO)
SIN_CONTACTO_SQL = sql_in("Resultado_Llamada", SIN_CONTACTO)
