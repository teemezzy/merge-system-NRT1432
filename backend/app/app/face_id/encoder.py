## Face Encoder file
from typing import Optional
import cv2
import face_recognition
from fastapi import UploadFile
import tempfile
import os
import uuid
from app import repositories, models
from app.core.security import encrypt_encodings 

class FaceEncoder():
    
    def encode_video(self, video: UploadFile, current_user: Optional[models.User] = None):
        """
        Encode video 
        """
        # encodings = []
        final_encoding = None
        
        with tempfile.NamedTemporaryFile(prefix=f"{uuid.uuid4()}", suffix=".mp4") as temp_video:
            temp_video.write(video.file.read())
            
            num_of_frames = 0
            cap = cv2.VideoCapture(temp_video.name)
            
            while(cap.isOpened()):
                # TODO: This is a temporary fix to only process 1 frame
                # We need to process more than one frame and average the results
                if num_of_frames == 5:
                    break
                
                ret, frame = cap.read()
                if ret == False:
                    break

                rgb_frame = frame[:, :, ::-1]
                # rotate the frame 180 degrees to match the orientation of the video
                # This is to correct videos captured from the front camera as the metadata is not used
                # See https://stackoverflow.com/questions/44380432/opencv-video-looks-good-but-frames-are-rotated-90-degrees
                # rgb_frame = cv2.rotate(rgb_frame, cv2.ROTATE_180)
                # cv2.imwrite("frame.jpg", rgb_frame)

                boxes = face_recognition.face_locations(rgb_frame)
                # encodings.append(face_recognition.face_encodings(rgb_frame, boxes)[0])
                encoding = face_recognition.face_encodings(rgb_frame, boxes)
                if encoding:
                    final_encoding = encoding[0]
                    break
                    
                num_of_frames += 1
                
            cap.release()
        
        # encrypted_encodings = encrypt_encodings(encodings)
        encrypted_encodings = encrypt_encodings(final_encoding)
        repositories.user_repository.update_face_encodings(current_user.id, encrypted_encodings)
            

face_encoder = FaceEncoder()
