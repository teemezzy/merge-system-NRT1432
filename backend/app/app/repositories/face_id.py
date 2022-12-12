from typing import List, Optional
from app import models, schemas
from sqlalchemy.orm import Session
from app.db.session import get_db_session


class FaceID:
    def __init__(self) -> None:
        self.db: Session = next(get_db_session())
    
    def get_all_face_encoding_info(self) -> Optional[List[schemas.FaceId]]:
        return (
            self.db.query(models.User.face_encoding, models.User.id)
            .filter(models.User.face_encoding != b'')
            .all()
        )
        


face_id_repository = FaceID()
