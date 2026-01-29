import { User } from './user.model';

export enum TravelType {
  ADVENTURE = 'ADVENTURE',
  CULTURAL = 'CULTURAL',
  RELAXATION = 'RELAXATION',
  BUSINESS = 'BUSINESS',
  ECO_TOURISM = 'ECO_TOURISM',
  GROUP_TOUR = 'GROUP_TOUR',
  SOLO = 'SOLO'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING',
  EXPERT = 'EXPERT'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED'
}

export interface TravelOffer {
  id: number;
  title: string;
  description: string;
  destination: string;
  departureCity?: string;
  country: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  price: number;
  currency: string;
  maxParticipants: number;
  currentParticipants: number;
  images: string[];
  activities: string[];
  type: TravelType;
  difficulty: DifficultyLevel;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  organizer?: Organization;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  type: 'TRAVEL_AGENCY' | 'HOTEL' | 'TOUR_OPERATOR' | 'AIRLINE';
  isVerified: boolean;
  isActive: boolean;
}

export interface Booking {
  id: number;
  numberOfParticipants: number;
  totalPrice: number;
  status: BookingStatus;
  bookingDate: Date;
  specialRequests?: string;
  user: User;
  travelOffer: TravelOffer;
}

export interface TravelLog {
  id: number;
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  images: string[];
  highlights: string[];
  tips: string[];
  rating: number;
  createdAt: Date;
  author: User;
  likesCount: number;
  commentsCount: number;
}

export interface TravelCompanion {
  id: number;
  user: User;
  destination: string;
  travelDates: {
    start: Date;
    end: Date;
  };
  travelStyle: string;
  budget: string;
  description: string;
  isLookingFor: boolean;
  createdAt: Date;
}
