"""Verificación de tokens de Firebase para el backend.

El frontend ya autentica con Firebase Auth (Google / correo+contraseña,
restringido a @cltiene.com / @cun.edu.co). Este módulo cierra el hueco del
backend: verifica el ID token que manda el navegador en cada request, para que
la API no quede abierta a cualquiera con la URL de Cloud Run.

Sin dependencias nuevas: usa `google.auth.jwt` (ya instalado vía google-auth)
para validar la firma del token contra las llaves públicas de Firebase, igual
que hace `google.oauth2.id_token.verify_firebase_token`, pero cacheando los
certificados (evita una llamada de red por cada request).

Rollback instantáneo: `AUTH_ENABLED=0` en el entorno desapaga la verificación
sin re-desplegar (útil para local o si algo se rompe en prod).
"""
import os
import time

import requests
from fastapi import Header, HTTPException
from google.auth import jwt

PROJECT_ID = os.getenv("CLOUD_PROJECT") or "desarrollo-investigaciones"

# Certificados públicos x509 de Firebase (los mismos que usa
# google.oauth2.id_token.verify_firebase_token internamente).
_CERTS_URL = (
    "https://www.googleapis.com/robot/v1/metadata/x509/"
    "securetoken@system.gserviceaccount.com"
)
_ISSUER = f"https://securetoken.google.com/{PROJECT_ID}"
_DOMINIOS_PERMITIDOS = ("@cltiene.com", "@cun.edu.co")

# Se puede apagar la verificación por entorno (rollback sin re-deploy / local).
AUTH_ENABLED = os.getenv("AUTH_ENABLED", "1") != "0"

# Cache de certificados en memoria (Firebase rota las llaves ~cada día; el
# header Cache-Control suele dar varias horas — usamos 1h como tope prudente).
_certs = {"data": None, "exp": 0.0}
_CERTS_TTL = 3600  # segundos


def _get_certs():
    now = time.time()
    if _certs["data"] is None or now >= _certs["exp"]:
        resp = requests.get(_CERTS_URL, timeout=5)
        resp.raise_for_status()
        _certs["data"] = resp.json()
        _certs["exp"] = now + _CERTS_TTL
    return _certs["data"]


def _verificar_token(token: str) -> dict:
    """Valida el ID token de Firebase y devuelve sus claims. Lanza ValueError si
    es inválido (firma, expiración, audiencia, emisor o sujeto)."""
    # jwt.decode verifica firma + expiración (exp/iat) + audiencia.
    claims = jwt.decode(token, certs=_get_certs(), audience=PROJECT_ID)
    # Chequeos extra que exige Firebase (verify_firebase_token los asume):
    if claims.get("iss") != _ISSUER:
        raise ValueError("emisor inválido")
    if not claims.get("sub"):
        raise ValueError("sujeto vacío")
    return claims


async def verificar_token(authorization: str = Header(default="")) -> dict:
    """Dependencia FastAPI: exige un `Authorization: Bearer <idToken>` válido de
    Firebase, con correo de un dominio permitido. Devuelve los claims (incluye
    `email`, `uid`) para que los endpoints puedan usarlos más adelante (scoping
    por asesor). Con AUTH_ENABLED=0 no verifica nada (devuelve claims vacíos)."""
    if not AUTH_ENABLED:
        return {}

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta el token de autenticación")

    token = authorization[7:].strip()
    try:
        claims = _verificar_token(token)
    except Exception:
        # No filtramos el detalle del error de verificación al cliente.
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    email = (claims.get("email") or "").lower()
    if not email.endswith(_DOMINIOS_PERMITIDOS):
        raise HTTPException(status_code=403, detail="Correo sin permisos")

    return claims
