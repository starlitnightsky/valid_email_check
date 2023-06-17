from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import requests
import uvicorn

from pydantic import BaseModel
from datetime import datetime as dt


class EmailSchema(BaseModel):
    email: str


class InfoSchema(BaseModel):
    firstName: str
    lastName: str
    birthday: str
    color: str
    countryCode: str


app = FastAPI()

API_URL = "https://api.zerobounce.net/v2/validate"
API_KEY = "0554ef534db44abc8fe2f6b2c5b7aefc"

origins = ["http://localhost", "http://localhost:8080", "http://localhost:5173", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "POST", "PUT"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/verify")
async def verify_email(payload: EmailSchema):
    res = requests.get(API_URL, params={"api_key": API_KEY, "email": payload.email})
    return res.json()
