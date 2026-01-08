# api.py
from fastapi import FastAPI
from pydantic import BaseModel
from journal_models import JournalNLPService

app = FastAPI(title="Journal NLP API", version="1.0")

service = JournalNLPService()  # loads models once at startup


class JournalRequest(BaseModel):
    text: str


@app.post("/predict")
def predict(req: JournalRequest):
    return service.predict(req.text)
