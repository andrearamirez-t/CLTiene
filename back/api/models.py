from fastapi import Query
from pydantic import BaseModel
from typing import Optional
from helpers.utils import filters


class FilterModel(BaseModel):
    fecha_desde: Optional[str] = Query(None)
    fecha_hasta: Optional[str] = Query(None)
    resultado_llamada: Optional[str] = Query(None)
    plan_mencionado: Optional[str] = Query(None)
    duracion_llamada: Optional[str] = Query(None)
    saludo_asesor: Optional[str] = Query(None)
    nombre_asesor: Optional[str] = Query(None)
    modulo_atencion: Optional[str] = Query(None)
    clasificacion_sentimiento: Optional[str] = Query(None)
    tipo_llamada: Optional[str] = Query(None)
    transcripcion: Optional[str] = Query(None)

    def get_query(self) -> str:
        return filters(self.model_dump())["filter_string"]
