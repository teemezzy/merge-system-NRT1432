import datetime
from typing import Optional, Any
from uuid import UUID
from app import models
from app.db.session import get_db_session
from app.core.security import verify_password
from sqlalchemy.orm import Session


class User:
    def __init__(self) -> None:
        self.db: Session = next(get_db_session())
        
    def get(self, id: Any) -> Optional[models.User]:
        return self.db.query(models.User).get(id)
        
    def create(self, user: models.User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_face_encodings(self, user_id: UUID, encrypted_encodings: bytes):
        user_in_db = self.db.query(models.User).filter(models.User.id == user_id).first()
        user_in_db.face_encoding = encrypted_encodings
        user_in_db.updated_at = datetime.datetime.now()
        self.db.commit()
        self.db.refresh(user_in_db)
        return 
        
    
    def get_by_email(self, email: str):
        return self.db.query(models.User).filter(models.User.email == email).first()
    
    def authenticate(self, email: str, password: str):
        user = self.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def is_active(self, user: models.User):
        return user.is_active

        
    
    

user_repository = User()
