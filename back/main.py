from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
)

if not os.path.exists ("static"):
    os.makedirs("static")

app.mount("/static", StaticFiles(directory="static")) # (name="static"??)

@app.post("/upload")
async def upload_image (request: Request, file: UploadFile):
    if file.content_type != "image/jpeg" and file.content_type != "image/png":
       # or
       raise HTTPException(status_code=400, detail="Разрешенный формат файлов JPEG or PNG")
    data = await file.read() 
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="файл больше 5МБ!")
    img = Image.open(io.BytesIO(data))
    img.thumbnail((1000, 1000))

    ext = file.filename.split(".")[-1]
    file_id = str(uuid.uuid4())
    filename = f"{file_id}.{ext}"

    img.convert("RGB").save(f"static/{filename}")

    return {"thumbnail_url": f"{request.base_url}static/{filename}"}

    
