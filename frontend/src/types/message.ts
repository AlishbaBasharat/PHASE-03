/**
 * Message Type Definitions
 *
 * Matches backend Message model schema
 */

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface StreamChunk {
  chunk?: string;
  done?: boolean;
  error?: string;
}
