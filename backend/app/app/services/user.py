from app import schemas, models, repositories
from app.core.security import get_password_hash
from fastapi import HTTPException


class UserService:
    
    def create(self, user: schemas.UserCreate) -> schemas.UserBase:
        if user.password != user.verify_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        if repositories.user_repository.get_by_email(user.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        db_user = models.User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            hashed_password=get_password_hash(user.password),
            is_active=True,
            is_superuser=False,
            is_verified=False,
        )

        return repositories.user_repository.create(db_user)
    
    
    
user_service = UserService()
