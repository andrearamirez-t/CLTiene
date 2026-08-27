from fastapi import FastAPI
from api.routes import router
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
if _upload_ok and router_upload:
    app.include_router(router_upload)