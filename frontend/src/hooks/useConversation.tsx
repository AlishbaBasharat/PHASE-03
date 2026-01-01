/**
 * useConversation Hook
 *
 * Manages conversation state and operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Conversation } from '@/types/conversation';
import * as conversationService from '@/services/conversation';

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user's conversations
   */
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await conversationService.listConversations(20, 0);
      setConversations(result.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new conversation
   */
  const createConversation = useCallback(async (title?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newConversation = await conversationService.createConversation({ title });
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
  }, []);

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));

      // Deselect if deleted conversation was selected
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedConversation]);

  /**
   * Update conversation title
   */
  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const updated = await conversationService.updateConversation(conversationId, { title });
      setConversations(prev => prev.map(c => c.id === conversationId ? updated : c));

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedConversation]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    selectedConversation,
    isLoading,
    error,
    loadConversations,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle
  };
}
