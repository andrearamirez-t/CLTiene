from fastapi import FastAPI, Depends
from api.routes import router
from api.auth import verificar_token
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

try:
    from api.upload.routes import router as router_upload
    _upload_ok = True
except Exception:
    router_upload = None
    _upload_ok = False

load_dotenv()

app = FastAPI(title="Dashboard API")

# Orígenes permitidos: el frontend de producción (Firebase Hosting sirve tanto
# .web.app como .firebaseapp.com) y el dev local de Vite. Ya NO es "*" (que
# además es inválido junto con allow_credentials).
ORIGINS = [
    "https://cltiene-dashboard.web.app",
    "https://cltiene-dashboard.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:3000",
]
# Escotilla: permite añadir orígenes por entorno sin re-desplegar código.
_extra = os.getenv("CORS_EXTRA_ORIGINS", "")
if _extra:
    ORIGINS += [o.strip() for o in _extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Toda la API exige un ID token de Firebase válido (ver api/auth.py). Se aplica
# en los routers (no a nivel app) para dejar /docs y /openapi.json abiertos.
app.include_router(router, dependencies=[Depends(verificar_token)])
if _upload_ok and router_upload:
    app.include_router(router_upload, dependencies=[Depends(verificar_token)])