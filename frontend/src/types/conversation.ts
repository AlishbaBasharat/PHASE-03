/**
 * Conversation Type Definitions
 *
 * Matches backend Conversation model schema
 */

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CreateConversationRequest {
  title?: string;
  initial_message?: string;
}

export interface UpdateConversationRequest {
  title: string;
}

export interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
  message_count: number;
}

// Import Message type
import { Message } from './message';
