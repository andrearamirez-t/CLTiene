from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE, CONTACTADO_SQL


def distribucion_resultado(filters: FilterModel):
    # Partición de Contacto Efectivo (misma del reporte, suma al total):
    # Contactado = se habló con la persona (Contactado + Rechazado + Venta);
    # Sin Contacto = no se habló (buzón/no disp/num eq/sin contacto/sin clasificar).
    # La partición viene de helpers/sql.py (fuente única, no divergir).
    return result(f"""
    WITH
        estado_llamadas as (
            SELECT
                CASE
                    WHEN {CONTACTADO_SQL}
                    THEN 'Contactado'
                    ELSE 'Sin Contacto'
                END nombre,
                COUNT(*) valor
            FROM
                {TABLE}
            WHERE
                {filters.get_query()}
            GROUP BY
                nombre
        )
    SELECT
        nombre,
        concat(valor, " (", ROUND(valor * 100.0 / SUM(valor) OVER (), 2) ,"%)") valor,
        concat (ROUND(valor * 100.0 / SUM(valor) OVER (), 2), "%") ancho
    FROM
        estado_llamadas
    """)
