"""
TerraBond AI Service
FastAPI application providing AI-powered features:
- Face Recognition
- Matching Algorithm
- Recommendations
- Risk Analysis
- Conversational AI
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.face_recognition import router as face_router
from api.matching import router as matching_router
from api.recommendations import router as recommendations_router
from api.risk_analysis import router as risk_router
from api.chatbot import router as chatbot_router
from core.config import settings
from core.database import engine, Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    logger.info("Starting TerraBond AI Service...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("AI Service started successfully!")
    yield
    
    # Shutdown
    logger.info("Shutting down AI Service...")
    await engine.dispose()


# Create FastAPI application
app = FastAPI(
    title="TerraBond AI Service",
    description="AI-powered microservice for TerraBond platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(face_router, prefix="/api/face", tags=["Face Recognition"])
app.include_router(matching_router, prefix="/api/matching", tags=["Matching"])
app.include_router(recommendations_router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(risk_router, prefix="/api/risk", tags=["Risk Analysis"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "TerraBond AI Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "face_recognition": "/api/face",
            "matching": "/api/matching",
            "recommendations": "/api/recommendations",
            "risk_analysis": "/api/risk",
            "chatbot": "/api/chatbot"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-service"
    }


@app.get("/api/agents")
async def list_agents():
    """List all available AI agents"""
    return {
        "agents": [
            {
                "id": "matching_agent",
                "name": "Matching Agent",
                "description": "Calculates compatibility scores between users based on personality, interests, and preferences",
                "status": "active"
            },
            {
                "id": "recommendation_agent",
                "name": "Recommendation Agent",
                "description": "Provides personalized recommendations for users, travel destinations, and connections",
                "status": "active"
            },
            {
                "id": "risk_analysis_agent",
                "name": "Risk Analysis Agent",
                "description": "Detects fraudulent activities and analyzes user behavior for security",
                "status": "active"
            },
            {
                "id": "conversational_agent",
                "name": "Conversational Agent",
                "description": "AI-powered chatbot for user assistance and support",
                "status": "active"
            },
            {
                "id": "face_recognition_agent",
                "name": "Face Recognition Agent",
                "description": "Handles face verification and anti-spoofing detection",
                "status": "active"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
