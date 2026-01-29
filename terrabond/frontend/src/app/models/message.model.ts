import { User } from './user.model';
import { Story } from './post.model';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  LOCATION = 'LOCATION',
  TRAVEL_SHARE = 'TRAVEL_SHARE',
  STORY_REPLY = 'STORY_REPLY'
}

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP'
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  latitude?: number;
  longitude?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  sender: User;
  conversation: Conversation;
  replyToStory?: Story;
  readBy: User[];
}

export interface Conversation {
  id: number;
  type: ConversationType;
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  lastMessageAt?: Date;
  isActive: boolean;
  participants: User[];
  unreadCount: number;
  createdAt: Date;
}

export interface CreateMessageRequest {
  content: string;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  latitude?: number;
  longitude?: number;
  replyToStoryId?: number;
}

export interface CreateConversationRequest {
  type: ConversationType;
  name?: string;
  participantIds: number[];
}

export interface TypingEvent {
  conversationId: number;
  userId: number;
  isTyping: boolean;
}
