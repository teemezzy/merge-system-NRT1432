import tempfile
import uuid
import cv2
import face_recognition
from fastapi import UploadFile
from app import services, repositories, schemas, models
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


class FaceVerification():
    def __init__(self):
        face_encoding_info = services.face_id_service.get_all_face_encoding_info()
        self.known_face_encodings = face_encoding_info.get("face_encodings")
        self.known_face_ids = face_encoding_info.get("user_ids")

    def verify_user(self, file: UploadFile):
        identified_ids = []
        with tempfile.NamedTemporaryFile(prefix=f"{uuid.uuid4()}", suffix=".mp4") as temp_video:
            temp_video.write(file.file.read())

            num_of_frames = 0
            cap = cv2.VideoCapture(temp_video.name)

            while cap.isOpened():
                # TODO: This is a temporary fix to only process 1 frame
                # We need to process more than one frame and average the results
                if num_of_frames == 4:
                    break

                ret, frame = cap.read()
                if ret == False:
                    break

                rgb_frame = frame[:, :, ::-1]
                # rotate the frame 180 degrees to match the orientation of the video
                # This is to correct videos captured from the front camera as the metadata is not used
                # See https://stackoverflow.com/questions/44380432/opencv-video-looks-good-but-frames-are-rotated-90-degrees
                # rgb_frame = cv2.rotate(rgb_frame, cv2.ROTATE_180)
                cv2.imwrite("ver-frame.jpg", rgb_frame)
                boxes = face_recognition.face_locations(rgb_frame)
                encodings = face_recognition.face_encodings(rgb_frame, boxes)

                for encoding in encodings:
                    matches = face_recognition.compare_faces(
                        self.known_face_encodings, encoding, tolerance=0.95)
                    user_id = "Unknown"
                    if True in matches:
                        first_match_index = matches.index(True)
                        user_id = self.known_face_ids[first_match_index]
                        identified_ids.append(user_id)

                num_of_frames += 1

            cap.release()

            if len(set(identified_ids)) == 1:
                authenticated_user = repositories.user_repository.get(
                    identified_ids[0])
                
                userToReturn = schemas.LoggedInUser(
                    id=authenticated_user.id,
                    first_name=authenticated_user.first_name,
                    last_name=authenticated_user.last_name,
                    email=authenticated_user.email,
                    is_active=authenticated_user.is_active,
                    is_superuser=authenticated_user.is_superuser,
                    is_verified=authenticated_user.is_verified,
                    has_face_encodings=authenticated_user.face_encoding is not None,
                )
                return JSONResponse(content={"message": "SUCCESS", "user": jsonable_encoder(userToReturn)}, status_code=200)
            else:
                return JSONResponse(content={"message": "FAILED", "user": None}, status_code=406)


face_verification = FaceVerification()
