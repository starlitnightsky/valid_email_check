from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import requests
import uvicorn

from pydantic import BaseModel
from datetime import datetime as dt


class EmailSchema(BaseModel):
    email: str


class BulkEmailSchema(BaseModel):
    emails: list


app = FastAPI()

API_URL = "https://api.zerobounce.net/v2/validate"
BULK_API_URL = "https://bulkapi.zerobounce.net/v2/validatebatch"
API_KEY = "0554ef534db44abc8fe2f6b2c5b7aefc"
API_KEY_FREE_M = "cfe2e4038d5f440fb373bcf1fef157ba"
API_KEY_FREE_S = "21ed7d2e6ce1465ea7cba8459413ef61"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/verify")
async def verify_email(payload: EmailSchema):
    res = requests.get(
        API_URL, params={"api_key": API_KEY_FREE_S, "email": payload.email}
    )
    return res.json()


@app.post("/bulk-verify")
async def bulk_verify_email(payload: BulkEmailSchema):
    res = requests.post(
        BULK_API_URL, json={"api_key": API_KEY_FREE_S, "email_batch": payload.emails}
    )
    return res.json()
