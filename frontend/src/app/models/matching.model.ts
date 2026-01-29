import { User } from './user.model';

export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
  UNFOLLOWED = 'UNFOLLOWED'
}

export interface Connection {
  id: number;
  status: ConnectionStatus;
  message?: string;
  matchReason?: string;
  compatibilityScore: number;
  aiSuggested: boolean;
  commonInterests: string[];
  commonDestinations: string[];
  acceptedAt?: Date;
  blockedAt?: Date;
  interactionCount: number;
  requester: User;
  receiver: User;
}

export interface Match {
  id: number;
  compatibilityScore: number;
  matchReasons: string[];
  commonInterests: string[];
  commonDestinations: string[];
  user1Viewed: boolean;
  user2Viewed: boolean;
  isActive: boolean;
  createdAt: Date;
  user1: User;
  user2: User;
}

export interface PersonalityTest {
  id: number;
  answers: Record<string, number>;
  personalityType: string;
  traits: string[];
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  completedAt: Date;
}

export interface MatchingPreferences {
  minAge?: number;
  maxAge?: number;
  genderPreference?: string[];
  travelStyles: string[];
  preferredDestinations: string[];
  languages: string[];
  professionalInterests: string[];
  lookingFor: 'FRIENDSHIP' | 'DATING' | 'PROFESSIONAL' | 'TRAVEL_COMPANION' | 'ALL';
}

export interface CompatibilityResult {
  user: User;
  compatibilityScore: number;
  matchReasons: string[];
  commonInterests: string[];
  commonDestinations: string[];
  personalityCompatibility: number;
}
