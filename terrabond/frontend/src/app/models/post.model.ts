import { User } from './user.model';

export enum PostType {
  POST = 'POST',
  STORY = 'STORY',
  TRAVEL_LOG = 'TRAVEL_LOG',
  EVENT = 'EVENT'
}

export enum Privacy {
  PUBLIC = 'PUBLIC',
  CONNECTIONS_ONLY = 'CONNECTIONS_ONLY',
  PRIVATE = 'PRIVATE'
}

export enum StoryType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  BOOMERANG = 'BOOMERANG',
  TRAVEL = 'TRAVEL',
  POLL = 'POLL',
  QUIZ = 'QUIZ',
  COUNTDOWN = 'COUNTDOWN',
  LOCATION = 'LOCATION'
}

export interface Post {
  id: number;
  content: string;
  type: PostType;
  mediaUrls: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  privacy: Privacy;
  hashtags: string[];
  viewCount: number;
  shareCount: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt?: Date;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  taggedUsers: User[];
}

export interface Story {
  id: number;
  type: StoryType;
  mediaUrl: string;
  thumbnailUrl?: string;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  location?: string;
  duration: number;
  expiresAt: Date;
  isHighlight: boolean;
  viewCount: number;
  createdAt: Date;
  author: User;
  viewers: User[];
  mentions: User[];
  isViewed: boolean;
}

export interface Comment {
  id: number;
  content: string;
  likeCount: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt?: Date;
  author: User;
  post: Post;
  isLiked: boolean;
}

export interface CreatePostRequest {
  content: string;
  type: PostType;
  mediaUrls?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  privacy: Privacy;
  hashtags?: string[];
  taggedUserIds?: number[];
}

export interface CreateStoryRequest {
  type: StoryType;
  mediaUrl: string;
  thumbnailUrl?: string;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  location?: string;
  duration?: number;
  mentionIds?: number[];
}
