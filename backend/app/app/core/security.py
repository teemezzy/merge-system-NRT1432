from datetime import datetime, timedelta
from typing import Any, List, Union
# from cryptography.fernet import Fernet
from jose import jwt
from passlib.context import CryptContext
import pickle

from app.core.config import settings

# fernet = Fernet(bytes(settings.ENCODING_KEY, 'UTF-8'))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def encrypt_encodings(encodings: List[Any]) -> bytes:
    pickled_encodings = pickle.dumps(encodings)
    # TODO: Encrypt the encodings 
    return pickled_encodings

def decrypt_encodings(encodings: bytes) -> Any:
    unpickled_encodings = pickle.loads(encodings)
    # TODO: Decrypt the encodings
    return unpickled_encodings
