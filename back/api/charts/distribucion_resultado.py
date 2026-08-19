from api.database import result
from api.models import FilterModel


def distribucion_resultado(filters: FilterModel):
    # Partición de Contacto Efectivo (misma del reporte, suma al total):
    # Contactado = se habló con la persona (Contactado + Rechazado + Venta);
    # Sin Contacto = no se habló (buzón/no disp/num eq/sin contacto/sin clasificar).
    return result(f"""
    WITH
        estado_llamadas as (
            SELECT
                CASE
                    WHEN Resultado_Llamada IN ('Contactado', 'Rechazado', 'Venta')
                    THEN 'Contactado'
                    ELSE 'Sin Contacto'
                END nombre,
                COUNT(*) valor
            FROM
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
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
