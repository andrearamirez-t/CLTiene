from fastapi import APIRouter, Depends
from api.ia.analisis_automatico import analisis_automatico

import dotenv

dotenv.load_dotenv()

router = APIRouter()


@router.get("/api/test")
def api_test():
    return "Hello World!"

@router.get("/ia/analisis_automatico")
def api_analisis_automatico(
    tipo_analisis: str
):
    return analisis_automatico(tipo_analisis)