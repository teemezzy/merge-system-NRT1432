from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

class UserBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None
    face_encodings: Optional[bytes] = None

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    verify_password: str

class UserUpdate(BaseModel):
    pass

class UserUpdateFaceEncodings(BaseModel):
    face_encodings: bytes


class LoggedInUser(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    is_active: bool
    is_superuser: bool
    is_verified: bool
    has_face_encodings: bool
