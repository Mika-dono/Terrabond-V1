"""
Matching Algorithm API Endpoints
"""

import logging
from typing import List, Optional

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


class UserProfile(BaseModel):
    """User profile for matching"""
    id: int
    personality_type: Optional[str] = None
    personality_traits: Optional[dict] = None
    interests: List[str] = []
    travel_styles: List[str] = []
    languages: List[str] = []
    dream_countries: List[str] = []
    location: Optional[str] = None
    age: Optional[int] = None


class CompatibilityRequest(BaseModel):
    """Compatibility calculation request"""
    user1: UserProfile
    user2: UserProfile


class CompatibilityResponse(BaseModel):
    """Compatibility calculation response"""
    compatibility_score: float
    personality_compatibility: float
    interests_compatibility: float
    travel_compatibility: float
    location_compatibility: float
    match_reasons: List[str]
    common_interests: List[str]
    common_destinations: List[str]


class MatchingPreferences(BaseModel):
    """User matching preferences"""
    min_age: Optional[int] = 18
    max_age: Optional[int] = 100
    gender_preference: Optional[List[str]] = None
    travel_styles: List[str] = []
    preferred_destinations: List[str] = []
    languages: List[str] = []
    looking_for: str = "ALL"  # FRIENDSHIP, DATING, PROFESSIONAL, TRAVEL_COMPANION, ALL


def calculate_personality_compatibility(user1: UserProfile, user2: UserProfile) -> float:
    """
    Calculate personality compatibility using MBTI and Big Five traits
    """
    score = 0.5  # Base score
    
    # MBTI compatibility
    if user1.personality_type and user2.personality_type:
        mbti1 = user1.personality_type
        mbti2 = user2.personality_type
        
        # Complementary types score higher
        complementary_pairs = [
            ('INTJ', 'ENFP'), ('INTJ', 'ENTP'),
            ('INTP', 'ENFJ'), ('INTP', 'ENTJ'),
            ('ENTJ', 'INFP'), ('ENTJ', 'INTP'),
            ('ENTP', 'INFJ'), ('ENTP', 'INTJ'),
            ('INFJ', 'ENFP'), ('INFJ', 'ENTP'),
            ('INFP', 'ENFJ'), ('INFP', 'ENTJ'),
            ('ENFJ', 'INFP'), ('ENFJ', 'ISFP'),
            ('ENFP', 'INFJ'), ('ENFP', 'INTJ'),
            ('ISTJ', 'ESFP'), ('ISTJ', 'ESTP'),
            ('ISFJ', 'ESFP'), ('ISFJ', 'ESTP'),
            ('ESTJ', 'ISFP'), ('ESTJ', 'ISTP'),
            ('ESFJ', 'ISFP'), ('ESFJ', 'ISTP'),
            ('ISTP', 'ESFJ'), ('ISTP', 'ESTJ'),
            ('ISFP', 'ESFJ'), ('ISFP', 'ESTJ'),
            ('ESTP', 'ISFJ'), ('ESTP', 'ISTJ'),
            ('ESFP', 'ISFJ'), ('ESFP', 'ISTJ')
        ]
        
        if (mbti1, mbti2) in complementary_pairs or (mbti2, mbti1) in complementary_pairs:
            score += 0.3
        elif mbti1 == mbti2:
            score += 0.2
        else:
            score += 0.1
    
    # Big Five traits compatibility
    if user1.personality_traits and user2.personality_traits:
        traits1 = user1.personality_traits
        traits2 = user2.personality_traits
        
        # Calculate similarity for each trait
        trait_diffs = []
        for trait in ['openness', 'conscientiousness', 'extraversion', 'agreeableness']:
            if trait in traits1 and trait in traits2:
                trait_diffs.append(abs(traits1[trait] - traits2[trait]))
        
        if trait_diffs:
            avg_diff = sum(trait_diffs) / len(trait_diffs)
            score += (1 - avg_diff) * 0.2
    
    return min(1.0, score)


def calculate_interests_compatibility(user1: UserProfile, user2: UserProfile) -> tuple:
    """
    Calculate interests compatibility and return common interests
    """
    interests1 = set(user1.interests)
    interests2 = set(user2.interests)
    
    if not interests1 or not interests2:
        return 0.3, []
    
    common = interests1.intersection(interests2)
    union = interests1.union(interests2)
    
    jaccard_score = len(common) / len(union) if union else 0
    
    return jaccard_score, list(common)


def calculate_travel_compatibility(user1: UserProfile, user2: UserProfile) -> tuple:
    """
    Calculate travel compatibility and return common destinations
    """
    score = 0.0
    reasons = []
    
    # Travel styles compatibility
    styles1 = set(user1.travel_styles)
    styles2 = set(user2.travel_styles)
    
    if styles1 and styles2:
        common_styles = styles1.intersection(styles2)
        if common_styles:
            score += len(common_styles) / max(len(styles1), len(styles2)) * 0.4
            reasons.append(f"{len(common_styles)} styles de voyage communs")
    
    # Languages compatibility
    languages1 = set(user1.languages)
    languages2 = set(user2.languages)
    
    if languages1 and languages2:
        common_languages = languages1.intersection(languages2)
        if common_languages:
            score += len(common_languages) / max(len(languages1), len(languages2)) * 0.3
            reasons.append(f"{len(common_languages)} langues communes")
    
    # Dream destinations compatibility
    destinations1 = set(user1.dream_countries)
    destinations2 = set(user2.dream_countries)
    
    common_destinations = []
    if destinations1 and destinations2:
        common_destinations = list(destinations1.intersection(destinations2))
        if common_destinations:
            score += len(common_destinations) / max(len(destinations1), len(destinations2)) * 0.3
            reasons.append(f"{len(common_destinations)} destinations de rêve communes")
    
    return min(1.0, score), reasons, common_destinations


def calculate_location_compatibility(user1: UserProfile, user2: UserProfile) -> float:
    """
    Calculate location compatibility
    """
    if not user1.location or not user2.location:
        return 0.5
    
    if user1.location == user2.location:
        return 1.0
    
    # Same country check (simplified)
    if user1.location.split(',')[-1].strip() == user2.location.split(',')[-1].strip():
        return 0.7
    
    return 0.3


@router.post("/compatibility", response_model=CompatibilityResponse)
async def calculate_compatibility(request: CompatibilityRequest):
    """
    Calculate compatibility score between two users
    """
    try:
        # Calculate individual compatibility scores
        personality_score = calculate_personality_compatibility(request.user1, request.user2)
        interests_score, common_interests = calculate_interests_compatibility(request.user1, request.user2)
        travel_score, travel_reasons, common_destinations = calculate_travel_compatibility(
            request.user1, request.user2
        )
        location_score = calculate_location_compatibility(request.user1, request.user2)
        
        # Calculate weighted overall score
        overall_score = (
            personality_score * settings.MATCHING_WEIGHT_PERSONALITY +
            interests_score * settings.MATCHING_WEIGHT_INTERESTS +
            travel_score * settings.MATCHING_WEIGHT_TRAVEL +
            location_score * settings.MATCHING_WEIGHT_LOCATION
        )
        
        # Generate match reasons
        match_reasons = travel_reasons.copy()
        
        if personality_score > 0.7:
            match_reasons.append("Personnalités complémentaires")
        
        if interests_score > 0.5:
            match_reasons.append(f"{len(common_interests)} intérêts communs")
        
        if location_score > 0.5:
            match_reasons.append("Proximité géographique")
        
        return CompatibilityResponse(
            compatibility_score=round(overall_score * 100, 2),
            personality_compatibility=round(personality_score * 100, 2),
            interests_compatibility=round(interests_score * 100, 2),
            travel_compatibility=round(travel_score * 100, 2),
            location_compatibility=round(location_score * 100, 2),
            match_reasons=match_reasons,
            common_interests=common_interests,
            common_destinations=common_destinations
        )
        
    except Exception as e:
        logger.error(f"Compatibility calculation error: {e}")
        raise HTTPException(status_code=500, detail="Compatibility calculation failed")


@router.post("/find-matches")
async def find_matches(user: UserProfile, candidates: List[UserProfile], limit: int = 10):
    """
    Find best matches for a user from a list of candidates
    """
    try:
        matches = []
        
        for candidate in candidates:
            if candidate.id == user.id:
                continue
            
            request = CompatibilityRequest(user1=user, user2=candidate)
            compatibility = await calculate_compatibility(request)
            
            matches.append({
                "user_id": candidate.id,
                "compatibility": compatibility
            })
        
        # Sort by compatibility score
        matches.sort(key=lambda x: x["compatibility"].compatibility_score, reverse=True)
        
        return {
            "matches": matches[:limit],
            "total_candidates": len(candidates)
        }
        
    except Exception as e:
        logger.error(f"Find matches error: {e}")
        raise HTTPException(status_code=500, detail="Find matches failed")


@router.get("/criteria")
async def get_matching_criteria():
    """
    Get the criteria used for matching
    """
    return {
        "criteria": [
            {
                "name": "Personnalité",
                "weight": settings.MATCHING_WEIGHT_PERSONALITY,
                "description": "Compatibilité basée sur le type MBTI et les traits Big Five"
            },
            {
                "name": "Intérêts",
                "weight": settings.MATCHING_WEIGHT_INTERESTS,
                "description": "Intérêts et passions communs"
            },
            {
                "name": "Voyage",
                "weight": settings.MATCHING_WEIGHT_TRAVEL,
                "description": "Styles de voyage, langues et destinations préférées"
            },
            {
                "name": "Localisation",
                "weight": settings.MATCHING_WEIGHT_LOCATION,
                "description": "Proximité géographique"
            }
        ],
        "total_criteria": 4
    }
