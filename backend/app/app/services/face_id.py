from app import repositories, models, schemas
from typing import List, Optional
from app.core.security import decrypt_encodings


class FaceID:
    
    def get_all_face_encoding_info(self) -> Optional[List[schemas.FaceId]]:
        face_encoding_info = repositories.face_id_repository.get_all_face_encoding_info()
        face_encodings = []
        user_ids = []
        
        for face_encoding, user_id  in face_encoding_info:
            face_encodings.append(decrypt_encodings(face_encoding))
            user_ids.append(user_id)
            
        return {"face_encodings": face_encodings, "user_ids": user_ids}


face_id_service = FaceID()
