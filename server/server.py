import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from main import generate_separation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

SEPARATED_AUDIO_DIR = "separated_audio"

class ConvertRequest(BaseModel):
    url: str

@app.post("/convert")
async def convert(request: ConvertRequest):
    """
    Convert YouTube audio and return the list of available audio file URLs.
    """
    url = request.url

    generate_separation(url)

    files = [
        {"filename": file, "url": f"http://localhost:8000/audio/{file}"}
        for file in os.listdir(SEPARATED_AUDIO_DIR) if file.endswith(".wav")
    ]

    return {"files": files}

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """
    Stream audio file instead of encoding to base64.
    """
    file_path = os.path.join(SEPARATED_AUDIO_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/wav", filename=filename)
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
