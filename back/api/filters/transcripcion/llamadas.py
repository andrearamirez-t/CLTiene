from api.database import option
from api.models import FilterModel



def llamadas(filters: FilterModel):

    concat_fields = ', " | ", '.join(['"#"', 'id', 'Resultado_Llamada', 'cuenta'])

    return option(
        f"""
        WITH id_provicional AS (
            SELECT ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            Resultado_Llamada,
            cuenta
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            ORDER BY fecha DESC
        ) 
        SELECT id, concat({concat_fields}) text 
        FROM id_provicional
        """,
        "id",
        "text",
    )