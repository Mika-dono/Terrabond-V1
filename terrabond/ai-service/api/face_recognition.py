"""
Face Recognition API Endpoints
"""

import base64
import io
import logging
from typing import Optional

import face_recognition
import numpy as np
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from PIL import Image

from core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


class FaceVerificationRequest(BaseModel):
    """Face verification request"""
    stored_face: str  # Base64 encoded face encoding
    provided_face: str  # Base64 encoded face encoding


class FaceVerificationResponse(BaseModel):
    """Face verification response"""
    match: bool
    confidence: float
    distance: float


class FaceQualityRequest(BaseModel):
    """Face quality check request"""
    face_data: str  # Base64 encoded image


class FaceQualityResponse(BaseModel):
    """Face quality check response"""
    valid: bool
    quality_score: float
    issues: list[str]


class FaceEncodingRequest(BaseModel):
    """Face encoding request"""
    image_base64: str


class FaceEncodingResponse(BaseModel):
    """Face encoding response"""
    encoding: str
    face_detected: bool
    face_count: int


def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode base64 string to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    except Exception as e:
        logger.error(f"Error decoding base64 image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image data")


def encode_face_encoding(encoding: np.ndarray) -> str:
    """Encode face encoding to base64 string"""
    encoding_bytes = encoding.tobytes()
    return base64.b64encode(encoding_bytes).decode('utf-8')


def decode_face_encoding(encoding_string: str) -> np.ndarray:
    """Decode base64 string to face encoding"""
    try:
        encoding_bytes = base64.b64decode(encoding_string)
        return np.frombuffer(encoding_bytes, dtype=np.float64)
    except Exception as e:
        logger.error(f"Error decoding face encoding: {e}")
        raise HTTPException(status_code=400, detail="Invalid face encoding")


@router.post("/verify", response_model=FaceVerificationResponse)
async def verify_face(request: FaceVerificationRequest):
    """
    Verify if two face encodings match
    """
    try:
        # Decode face encodings
        stored_encoding = decode_face_encoding(request.stored_face)
        provided_encoding = decode_face_encoding(request.provided_face)
        
        # Calculate face distance
        distance = face_recognition.face_distance([stored_encoding], [provided_encoding])[0]
        
        # Check if faces match
        match = distance <= settings.FACE_RECOGNITION_TOLERANCE
        
        # Calculate confidence (inverse of distance)
        confidence = max(0, 1 - distance)
        
        logger.info(f"Face verification: match={match}, distance={distance:.4f}")
        
        return FaceVerificationResponse(
            match=bool(match),
            confidence=float(confidence),
            distance=float(distance)
        )
        
    except Exception as e:
        logger.error(f"Face verification error: {e}")
        raise HTTPException(status_code=500, detail="Face verification failed")


@router.post("/encode", response_model=FaceEncodingResponse)
async def encode_face(request: FaceEncodingRequest):
    """
    Extract face encoding from image
    """
    try:
        # Decode image
        image = decode_base64_image(request.image_base64)
        
        # Detect faces
        face_locations = face_recognition.face_locations(
            image, 
            model=settings.FACE_DETECTION_MODEL
        )
        
        if not face_locations:
            return FaceEncodingResponse(
                encoding="",
                face_detected=False,
                face_count=0
            )
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not face_encodings:
            return FaceEncodingResponse(
                encoding="",
                face_detected=False,
                face_count=len(face_locations)
            )
        
        # Encode the first face
        encoding = encode_face_encoding(face_encodings[0])
        
        return FaceEncodingResponse(
            encoding=encoding,
            face_detected=True,
            face_count=len(face_locations)
        )
        
    except Exception as e:
        logger.error(f"Face encoding error: {e}")
        raise HTTPException(status_code=500, detail="Face encoding failed")


@router.post("/quality", response_model=FaceQualityResponse)
async def check_face_quality(request: FaceQualityRequest):
    """
    Check face image quality
    """
    try:
        # Decode image
        image = decode_base64_image(request.face_data)
        
        issues = []
        quality_score = 1.0
        
        # Check image size
        height, width = image.shape[:2]
        if width < 200 or height < 200:
            issues.append("Image resolution too low")
            quality_score -= 0.3
        
        # Detect faces
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            issues.append("No face detected")
            quality_score = 0
        elif len(face_locations) > 1:
            issues.append("Multiple faces detected")
            quality_score -= 0.2
        
        # Check face size
        if face_locations:
            top, right, bottom, left = face_locations[0]
            face_width = right - left
            face_height = bottom - top
            
            if face_width < 100 or face_height < 100:
                issues.append("Face too small in image")
                quality_score -= 0.2
        
        valid = quality_score >= 0.5
        
        return FaceQualityResponse(
            valid=valid,
            quality_score=max(0, quality_score),
            issues=issues
        )
        
    except Exception as e:
        logger.error(f"Face quality check error: {e}")
        raise HTTPException(status_code=500, detail="Face quality check failed")


@router.post("/detect-spoofing")
async def detect_spoofing(image_base64: str = Form(...)):
    """
    Detect if image is a spoofing attempt (photo of photo, screen, etc.)
    """
    try:
        # Decode image
        image = decode_base64_image(image_base64)
        
        # Simple spoofing detection based on image analysis
        # In production, use a dedicated anti-spoofing model
        
        # Check for screen artifacts (simplified)
        gray = np.mean(image, axis=2)
        edges = np.abs(np.diff(gray, axis=0)).mean() + np.abs(np.diff(gray, axis=1)).mean()
        
        # High edge density might indicate a screen
        is_spoof = edges > 50  # Threshold
        
        return {
            "is_spoof": bool(is_spoof),
            "confidence": 0.7 if is_spoof else 0.9,
            "edge_density": float(edges)
        }
        
    except Exception as e:
        logger.error(f"Spoofing detection error: {e}")
        raise HTTPException(status_code=500, detail="Spoofing detection failed")
