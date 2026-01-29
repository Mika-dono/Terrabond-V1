export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  city?: string;
  country?: string;
  bio?: string;
  profession?: string;
  profilePicture?: string;
  coverPicture?: string;
  faceVerified: boolean;
  roles: Role[];
  isVerified: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  travelStyles: string[];
  languages: string[];
  interests: string[];
  personalityType?: string;
  personalityTraits?: string;
  dreamCountries?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  useFaceRecognition?: boolean;
  faceData?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: Date;
  gender: Gender;
  faceEncodingData?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  faceVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface UserProfile {
  user: User;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
  isFollowing: boolean;
  isConnected: boolean;
}
