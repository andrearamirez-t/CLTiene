import os
from google.cloud import bigquery

client = bigquery.Client(project=os.getenv("CLOUD_PROJECT"))


def result(query: str, query_parameters: list = []):
    job = bigquery.QueryJobConfig(
        query_parameters=query_parameters
    )

    job = client.query(query, job)

    df = job.to_dataframe()

    if df.empty:
        return {}

    return df.to_dict(orient="records")


def option(query: str, column_id: str, column_name: str | None = None):
    column_name = column_name if column_name else column_id

    job = client.query(f"""
    -- Solo valido que el ID no este vacio y agrupo los nombres para que no se repitan
    with result as (
        {query}
    ) select {column_id} id, {column_name} name from result where {column_id} is not null group by {column_name}
    """)
    df = job.to_dataframe()

    if df.empty:
        return {}

    return df.to_dict(orient="records")