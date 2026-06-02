from api.database import result
from api.models import FilterModel


def distribucion_resultado(filters: FilterModel):
    return result(f"""
    WITH
        estado_llamadas as (
            SELECT
                CASE
                    WHEN Resultado_Llamada IN ('No Disponible', 'Buzón de Voz', 'Número Equivocado', 'Sin Contacto')
                    THEN 'Sin Contacto'
                    ELSE Resultado_Llamada
                END nombre,
                COUNT(*) valor
            FROM
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE
                {filters.get_query()}
                AND Resultado_Llamada != 'Sin Clasificar'
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
