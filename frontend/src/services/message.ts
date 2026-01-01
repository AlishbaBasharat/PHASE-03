/**
 * Message API Service
 *
 * Client for sending messages and receiving streaming responses via SSE
 */

import { Message, SendMessageRequest, StreamChunk } from '@/types/message';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Get authentication token from Better Auth session
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Import authClient dynamically to avoid SSR issues
    const { authClient } = await import('@/lib/auth');
    const session = await authClient.getSession();

    // The JWT token is in session.data.session.token
    return session?.data?.session?.token || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Send a message to the AI agent with streaming response
 *
 * @param conversationId - ID of the conversation
 * @param content - Message content
 * @param onChunk - Callback for each streamed chunk
 * @param onComplete - Callback when streaming completes
 * @param onError - Callback for errors
 * @returns EventSource instance for manual control
 */
export async function sendMessage(
  userId: string,
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const token = await getAuthToken();

  if (!userId || !token) {
    onError('Authentication required - please sign in');
    return; // Don't throw, just return
  }

  // Construct SSE URL with message content
  const url = `${API_BASE_URL}/api/${userId}/conversations/${conversationId}/messages`;

  // Use fetch with manual SSE parsing
  const controller = new AbortController();

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content }),
    signal: controller.signal
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE data
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamChunk = JSON.parse(line.substring(6));

              if (data.chunk) {
                onChunk(data.chunk);
              } else if (data.done) {
                onComplete();
                return;
              } else if (data.error) {
                onError(data.error);
                return;
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError(errorMessage);
    });
}
