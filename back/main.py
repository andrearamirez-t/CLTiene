from fastapi import FastAPI
from api.routes import router
from api.routes_new import router as routes_ia
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


load_dotenv()

print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(routes_ia, prefix="/api")


