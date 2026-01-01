/**
 * useMessages Hook
 *
 * Manages message state and streaming
 */

'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/types/message';
import * as messageService from '@/services/message';

export function useMessages(conversationId: string, userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message and handle streaming response
   */
  const sendMessage = useCallback(async (content: string) => {
    // Check authentication
    if (!userId) {
      setError('Authentication required - please sign in');
      return;
    }

    setIsStreaming(true);
    setError(null);

    // Add user message immediately (optimistic UI)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      user_id: userId,
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Prepare assistant message container
    const assistantMessageId = crypto.randomUUID();
    let assistantContent = '';

    // Handle streaming chunks
    const handleChunk = (chunk: string) => {
      assistantContent += chunk;

      // Update or create assistant message
      setMessages(prev => {
        const existing = prev.find(m => m.id === assistantMessageId);
        if (existing) {
          return prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: assistantContent }
              : m
          );
        } else {
          return [
            ...prev,
            {
              id: assistantMessageId,
              conversation_id: conversationId,
              user_id: userId,
              role: 'assistant' as const,
              content: assistantContent,
              created_at: new Date().toISOString()
            }
          ];
        }
      });
    };

    // Handle completion
    const handleComplete = () => {
      setIsStreaming(false);
    };

    // Handle errors
    const handleError = (error: string) => {
      console.error('Message service error:', error);
      setError(error);
      setIsStreaming(false);
    };

    // Start streaming
    try {
      messageService.sendMessage(
        userId,
        conversationId,
        content,
        handleChunk,
        handleComplete,
        handleError
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      handleError(errorMsg);
    }
  }, [conversationId, userId]);

  /**
   * Set messages from loaded conversation history
   */
  const setMessagesFromHistory = useCallback((loadedMessages: Message[]) => {
    setMessages(loadedMessages);
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    setMessagesFromHistory,
    clearMessages
  };
}
