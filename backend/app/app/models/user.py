from app.db.base_class import Base

from sqlalchemy import Boolean, Column, String, LargeBinary

class User(Base):
    first_name: str = Column(String, nullable=False)
    last_name: str = Column(String, nullable=False)
    face_encoding: bytes = Column(LargeBinary, nullable=True)
    email: str = Column(String, nullable=False, unique=True)
    hashed_password: str = Column(String, nullable=False)
    is_active: bool = Column(Boolean, default=True)
    is_superuser: bool = Column(Boolean, default=False)
    is_verified: bool = Column(Boolean, default=False)
