import os
from google.cloud import bigquery

client = bigquery.Client(project=os.getenv("CLOUD_PROJECT"))


def result(query: str, query_parameters: list = []):
    job = bigquery.QueryJobConfig(
        query_parameters=query_parameters
    )

    print(f"Query-result: {query}")

    job = client.query(query, job)

    df = job.to_dataframe()

    if df.empty:
        return {}

    return df.to_dict(orient="records")


def option(query: str, column_id: str, column_name: str | None = None):
    column_name = column_name if column_name else column_id

    o_query = f"""
    -- Solo valido que el ID no este vacio y agrupo los nombres para que no se repitan
    with result as (
        {query}
    ) select {column_id} id, {column_name} name from result where {column_id} is not null
    -- group by {column_name}
    """

    print(o_query)

    job = client.query(o_query)
    df = job.to_dataframe()

    if df.empty:
        return {}

    return df.to_dict(orient="records")


def calculo_fecha() -> str:
    return """
    DATETIME (
		PARSE_TIMESTAMP (
			'%Y-%m-%d %H:%M:%S',
			CASE
			    -- formato: 2026-01-28 09:40:17 (creo que es ISO o el formato estandar año/mes/dia hora-minuto-segundo)
				WHEN REGEXP_CONTAINS (fecha, r'^\\d{{4}}-\\d{{2}}-\\d{{2}}') THEN REGEXP_EXTRACT (fecha, r'(\\d{{4}}-\\d{{2}}-\\d{{2}} \\d{{2}}:\\d{{2}}:\\d{{2}})')

				-- formato: 1/11/2025 2:42:44 p. m. (Formato en español dia-mes-año hora-minuto-segundo)
				ELSE FORMAT_TIMESTAMP (
					'%Y-%m-%d %H:%M:%S',
					PARSE_TIMESTAMP (
						'%d/%m/%Y %H:%M:%S',
						CONCAT (
							REGEXP_EXTRACT (fecha, r'(\\d{{1,2}}/\\d{{1,2}}/\\d{{4}})'),
							' ',
							REGEXP_EXTRACT (fecha, r'(\\d{{1,2}}:\\d{{2}}:\\d{{2}})')
						)
					) + IF (
						REGEXP_CONTAINS (fecha, r'(?i)p'),
						INTERVAL 12 HOUR,
						INTERVAL 0 HOUR
					)
				)
			END
		)
	)
    """
