from api.database import option
from api.models import FilterModel
from api.database import client


def resultado_llamada(filters):

    where = filters.get_query() or "1=1"

    print("QUERY WHERE:", where)

    query = f"""
    SELECT
        CASE
            WHEN Resultado_Llamada IN ('No Disponible', 'Buzón de Voz', 'Número Equivocado', 'Sin Contacto')
            THEN 'Sin Contacto'
            ELSE Resultado_Llamada
        END name,
        COUNT(*) value
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
        AND Resultado_Llamada != 'Sin Clasificar'
    GROUP BY name
    """

    print(query)

    job = client.query(query)
    df = job.to_dataframe()

    display_map = {"Venta": "Venta Cerrada"}
    df["id"] = df["name"]
    df["name"] = df["name"].map(lambda x: display_map.get(x, x))

    return df[["id", "name"]].to_dict(orient="records")