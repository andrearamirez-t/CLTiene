from api.database import option
from api.models import FilterModel
from api.database import client


def resultado_llamada(filters):

    where = filters.get_query() or "1=1"

    print("QUERY WHERE:", where)

    query = f"""
    SELECT
        Resultado_Llamada name,
        COUNT(*) value
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY Resultado_Llamada
    """

    print(query)

    job = client.query(query)
    df = job.to_dataframe()

    return df.to_dict(orient="records")