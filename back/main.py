from fastapi import FastAPI
from api.routes import router
from fastapi.middleware.cors import CORSMiddleware

# import os
import dotenv

dotenv.load_dotenv()

app = FastAPI(title="Dashboard API")

# origins = [
#     os.getenv("ORIGINS_BACK"),
#     os.getenv("ORIGINS_FRONT")
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
