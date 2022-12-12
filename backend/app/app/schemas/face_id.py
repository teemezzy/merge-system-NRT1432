from pydantic import BaseModel
from typing import Optional, Dict

class FaceId(BaseModel):
    user_id: str
    face_encoding: bytes
