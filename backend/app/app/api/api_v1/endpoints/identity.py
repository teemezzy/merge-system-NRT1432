import tempfile
from typing import Any
import uuid

from fastapi import APIRouter, UploadFile, Depends
from fastapi.responses import JSONResponse
from app.face_id import face_encoder, face_verification
from app import schemas, services, models
from app.api import deps

router = APIRouter()

@router.post("/register/face-id", response_model=schemas.GenericResponse)
async def register_face_id(
    file: UploadFile,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Registration endpoint
    """
    # check if the file is a valid video file
    if not file.content_type.startswith("video"):
        return JSONResponse(
            status_code=400,
            content={"message": "Please upload a valid video file"},
        )
    
    face_encoder.encode_video(file, current_user)
    return JSONResponse(content={"message": "SUCCESS"}, status_code=200)



@router.post("/verify/face-id", response_model=schemas.GenericResponse)
async def verify(
    file: UploadFile,
) -> Any:
    """
    Verification endpoint
    """
    if not file.content_type.startswith("video"):
        return JSONResponse(
            status_code=400,
            content={"message": "Please upload a valid video file"},
        )

    return face_verification.verify_user(file)
