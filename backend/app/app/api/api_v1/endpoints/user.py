from typing import Any
from app import schemas, services, models
from app.api import deps

from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse


router = APIRouter()

@router.post("/register", response_model=schemas.GenericResponse)
async def register(
    register_in: schemas.UserCreate,
) -> Any:
    """
    User registration endpoint
    """
    
    services.user_service.create(register_in)
    return JSONResponse(content={"message": "SUCCESS"}, status_code=200)


@router.get("/me", response_model=schemas.LoggedInUser)
async def get_current_user(
    *,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    
    userToReturn = schemas.LoggedInUser(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        is_active=current_user.is_active,
        is_superuser=current_user.is_superuser,
        is_verified=current_user.is_verified,
        has_face_encodings=current_user.face_encoding is not None,
    )
    
    return userToReturn




@router.get("/logout", response_model=schemas.GenericResponse)
def logout(
    response: Response,
) -> Any:
    """
    Log out - removes JWT cookie
    """
    response.delete_cookie("token")
    return JSONResponse(content={"message": "LOGOUT SUCCESSFUL"}, status_code=200)
