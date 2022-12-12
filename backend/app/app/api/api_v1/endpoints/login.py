from datetime import timedelta
import datetime
from typing import Any
from app import schemas, repositories, models
from app.core.config import settings
from app.api import deps

from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token


router = APIRouter()


@router.post("/access-token", response_model=schemas.Token)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 token login, get an access token for future requests
    """
    user = repositories.user_repository.authenticate(
        email=form_data.username.lower(), password=form_data.password
    )
    
    if not user or not user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not repositories.user_repository.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.datetime.today() + access_token_expires
    
    token = create_access_token(user.id, expires_delta=access_token_expires)

    response.set_cookie(
        key="token",
        value=token,
        expires=expires_at.strftime("%a, %d %b %Y %H:%M:%S GMT"),
        httponly=True,
        secure=False if settings.ENVIRONMENT == "local" else True,
        domain=get_domain(),
    )
    
    for idx, header in enumerate(response.raw_headers):
        if header[0].decode("utf-8") == "set-cookie":
            cookie = header[1].decode("utf-8")
            if "SameSite=None" not in cookie:
                cookie = cookie + "; SameSite=None"
                response.raw_headers[idx] = (header[0], cookie.encode())
                
    return {
        "access_token": token,
        "token_type": "bearer",
    }

def get_domain():
    if settings.ENVIRONMENT == "local":
        return "localhost"
    if settings.ENVIRONMENT == "staging":
        return "api.staging.egatorfinance.com"
    if settings.ENVIRONMENT == "production":
        return "api.egatorfinance.com"
