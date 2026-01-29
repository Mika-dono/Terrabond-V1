"""
Configuration settings for AI Service
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "TerraBond AI Service"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://terrabond:terrabond2026@localhost:5432/terrabond_ai"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "terrabond-ai-secret-key-2026"
    
    # Face Recognition
    FACE_RECOGNITION_TOLERANCE: float = 0.6
    FACE_DETECTION_MODEL: str = "hog"  # or "cnn"
    
    # Matching Algorithm
    MATCHING_WEIGHT_PERSONALITY: float = 0.3
    MATCHING_WEIGHT_INTERESTS: float = 0.25
    MATCHING_WEIGHT_TRAVEL: float = 0.25
    MATCHING_WEIGHT_LOCATION: float = 0.2
    
    # Groq LLM
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    
    # Risk Analysis
    RISK_THRESHOLD_LOW: float = 0.3
    RISK_THRESHOLD_MEDIUM: float = 0.6
    RISK_THRESHOLD_HIGH: float = 0.8
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
