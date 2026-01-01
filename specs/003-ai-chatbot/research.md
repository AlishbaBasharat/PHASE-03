# Research: AI-Powered Todo Chatbot

**Feature**: 003-ai-chatbot
**Date**: 2025-12-31
**Status**: Complete

## Overview

This document consolidates research findings for implementing the AI-Powered Todo Chatbot feature. All technical decisions are informed by the Phase 3 constitution requirements, existing Phase 2 architecture, and best practices for AI agent systems.

---

## 1. OpenAI Agents SDK Integration Pattern

### Decision
Use **OpenAI Python SDK v1.12+** with the Assistants API and function calling capabilities for agent orchestration.

### Rationale
1. **Official SDK**: Maintained by OpenAI, ensures compatibility and long-term support
2. **Streaming Support**: Native streaming responses reduce perceived latency
3. **Function Calling**: Built-in support for tool invocation (MCP tools)
4. **Stateless Operation**: Assistants API supports passing full conversation history without relying on OpenAI's thread storage
5. **Type Safety**: Strong Python typing aligns with SQLModel and Pydantic usage

### Alternatives Considered
- **LangChain**: More abstraction but adds complexity, not needed for focused use case
- **Custom OpenAI API calls**: Too low-level, would require reimplementing streaming and function calling
- **OpenAI Threads API**: Stores conversation state on OpenAI servers, violates stateless mandate

### Implementation Pattern
```python
from openai import OpenAI
import openai

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def invoke_agent(user_id: str, conversation_id: str, user_message: str):
    # Step 1: Load conversation history from database (stateless requirement)
    messages = await get_conversation_messages(conversation_id, user_id)

    # Step 2: Prepare messages array (history + new message)
    openai_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]
    openai_messages.append({"role": "user", "content": user_message})

    # Step 3: Define tools (MCP tools wrapped as OpenAI functions)
    tools = [
        {
            "type": "function",
            "function": {
                "name": "create_task",
                "description": "Creates a new task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"}
                    },
                    "required": ["title"]
                }
            }
        },
        # ... other tools
    ]

    # Step 4: Invoke OpenAI with streaming
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=openai_messages,
        tools=tools,
        stream=True
    )

    # Step 5: Stream response chunks
    full_response = ""
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            full_response += content
            yield content  # Stream to frontend

        # Handle tool calls
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            result = await invoke_mcp_tool(tool_call.function.name, tool_call.function.arguments, user_id)
            # Continue conversation with tool result...

    # Step 6: Persist assistant response to database (stateless requirement)
    await save_message(conversation_id, user_id, "assistant", full_response)
```

### Key Points
- **No state in memory**: Agent doesn't remember conversations between invocations
- **Database is source of truth**: Load history before each request, persist after
- **Streaming**: Use `stream=True` and yield chunks for real-time UI updates
- **Tool invocation**: When agent calls a function, invoke corresponding MCP tool

---

## 2. MCP SDK Implementation Approach

### Decision
Use **Python MCP SDK (mcp package)** for implementing the stateless MCP Server.

### Rationale
1. **Language Consistency**: Python aligns with existing FastAPI backend
2. **Official SDK**: Ensures compliance with MCP protocol specification
3. **Type Safety**: Python type hints provide strong contracts for tools
4. **FastAPI Integration**: Easy to connect MCP Server to existing backend database layer
5. **Async Support**: Native async/await for non-blocking tool execution

### Alternatives Considered
- **TypeScript MCP SDK (@modelcontextprotocol/sdk)**: Would require separate Node.js runtime, adds complexity
- **Custom MCP Protocol**: Reinventing the wheel, high maintenance burden
- **REST API without MCP**: Loses MCP standardization, tool discoverability

### Implementation Pattern
```python
# mcp-server/src/server.py
from mcp import Server, Tool
from mcp.server.stdio import stdio_server
import httpx
import os

# Initialize MCP server
server = Server("todo-mcp-server")

# Backend API base URL (for database operations)
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000")

@server.tool()
async def create_task(title: str, description: str, user_id: str) -> dict:
    """Creates a new task for the authenticated user"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BACKEND_API_URL}/api/{user_id}/tasks",
            json={"title": title, "description": description},
            headers={"Authorization": f"Bearer {get_service_token()}"}
        )
        return response.json()

@server.tool()
async def list_tasks(user_id: str, status_filter: str = "all") -> dict:
    """Lists tasks for the authenticated user"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BACKEND_API_URL}/api/{user_id}/tasks",
            params={"status": status_filter},
            headers={"Authorization": f"Bearer {get_service_token()}"}
        )
        return response.json()

@server.tool()
async def update_task(task_id: str, user_id: str, updates: dict) -> dict:
    """Updates an existing task"""
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{BACKEND_API_URL}/api/{user_id}/tasks/{task_id}",
            json=updates,
            headers={"Authorization": f"Bearer {get_service_token()}"}
        )
        return response.json()

@server.tool()
async def delete_task(task_id: str, user_id: str) -> dict:
    """Deletes a task"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{BACKEND_API_URL}/api/{user_id}/tasks/{task_id}",
            headers={"Authorization": f"Bearer {get_service_token()}"}
        )
        return response.json()

@server.tool()
async def toggle_task_completion(task_id: str, user_id: str) -> dict:
    """Toggles task completion status"""
    async with httpx.AsyncClient() as client:
        response = await client.patch(
            f"{BACKEND_API_URL}/api/{user_id}/tasks/{task_id}/toggle",
            headers={"Authorization": f"Bearer {get_service_token()}"}
        )
        return response.json()

# Run server
if __name__ == "__main__":
    import asyncio
    asyncio.run(stdio_server(server))
```

### Key Points
- **Stateless tools**: Each tool accepts `user_id` parameter explicitly
- **No caching**: Tools don't store any state between invocations
- **Communication**: Tools call FastAPI endpoints for database operations
- **Authentication**: Service-to-service token for MCP→Backend communication
- **Error handling**: HTTP errors propagated back to agent for user-friendly messaging

---

## 3. OpenAI ChatKit Frontend Integration

### Decision
Use **@openai/chatkit** React library with custom Server-Sent Events (SSE) streaming.

### Rationale
1. **Official Component**: OpenAI-maintained, optimized for conversation UI
2. **Streaming Support**: Built-in handling for streaming AI responses
3. **Customization**: Allows custom message bubbles and conversation list UI
4. **Accessibility**: WCAG-compliant out of the box
5. **TypeScript**: Strong typing for Next.js 16+ integration

### Alternatives Considered
- **Custom Chat UI**: Too much effort for standard chat patterns, reinventing the wheel
- **react-chat-widget**: Less feature-rich, no streaming support
- **chat-ui from Vercel**: Opinionated styling, difficult to customize

### Implementation Pattern
```typescript
// frontend/src/components/chat/ChatInterface.tsx
import { ChatKit, Message } from '@openai/chatkit';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function ChatInterface({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user, token } = useAuth();

  // Load conversation history on mount
  useEffect(() => {
    if (conversationId) {
      loadConversationHistory(conversationId);
    }
  }, [conversationId]);

  const loadConversationHistory = async (convId: string) => {
    const response = await fetch(`/api/${user.id}/conversations/${convId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setMessages(data.data.messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: new Date(msg.created_at)
    })));
  };

  const handleSendMessage = async (content: string) => {
    // Add user message immediately (optimistic UI)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Stream AI response using SSE
    setIsStreaming(true);
    const assistantMessageId = crypto.randomUUID();
    let assistantContent = '';

    const eventSource = new EventSource(
      `/api/${user.id}/conversations/${conversationId}/messages?content=${encodeURIComponent(content)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    eventSource.onmessage = (event) => {
      const chunk = event.data;
      assistantContent += chunk;

      // Update assistant message incrementally
      setMessages(prev => {
        const existing = prev.find(m => m.id === assistantMessageId);
        if (existing) {
          return prev.map(m => m.id === assistantMessageId
            ? { ...m, content: assistantContent }
            : m
          );
        } else {
          return [...prev, {
            id: assistantMessageId,
            role: 'assistant',
            content: assistantContent,
            createdAt: new Date()
          }];
        }
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsStreaming(false);
    };

    eventSource.addEventListener('done', () => {
      eventSource.close();
      setIsStreaming(false);
    });
  };

  return (
    <ChatKit
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isStreaming}
      placeholder="Ask me to manage your tasks..."
      className="h-full"
    />
  );
}
```

### Key Points
- **Streaming UI**: ChatKit automatically handles incremental message updates
- **Optimistic Updates**: User messages appear immediately, AI streams in
- **SSE Integration**: EventSource API for server-sent events
- **Error Handling**: Graceful fallback if streaming fails

---

## 4. Conversation Persistence Strategy

### Decision
Use **SQLModel with Conversations and Messages tables** with one-to-many relationship.

### Rationale
1. **Consistency**: Matches Phase 2 architecture (SQLModel + Neon PostgreSQL)
2. **Relationships**: SQLModel's Relationship feature handles conversation→messages
3. **Type Safety**: Pydantic integration ensures validation
4. **Query Efficiency**: Indexes on user_id + created_at enable fast queries
5. **User Isolation**: Built-in support for user_id filtering

### Alternatives Considered
- **NoSQL (MongoDB)**: Doesn't align with existing Neon PostgreSQL, adds complexity
- **JSON columns**: Less queryable, harder to enforce relationships
- **Single messages table**: Would require client-side grouping, less efficient

### Implementation Pattern
```python
# backend/src/models/conversation.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(nullable=False, index=True)  # User isolation
    title: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")

    class Config:
        indexes = [
            ("user_id", "created_at"),  # Fast user conversation queries
        ]

# backend/src/models/message.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", nullable=False)
    user_id: UUID = Field(nullable=False, index=True)  # User isolation
    role: str = Field(max_length=50, nullable=False)  # "user" or "assistant"
    content: str = Field(nullable=False)  # Message text
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Optional[Conversation] = Relationship(back_populates="messages")

    class Config:
        indexes = [
            ("conversation_id", "created_at"),  # Fast message ordering
            ("user_id", "created_at"),         # Fast user message queries
        ]
```

### Database Migration
```sql
-- migrations/003_add_conversations_messages.sql
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_created ON conversations(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_messages_user_created ON messages(user_id, created_at DESC);
```

### Key Points
- **User isolation**: Both tables have user_id with indexes
- **Cascade deletion**: Deleting conversation removes all messages
- **Role validation**: CHECK constraint ensures role is 'user' or 'assistant'
- **Efficient queries**: Composite indexes for common query patterns

---

## 5. Streaming Response Architecture

### Decision
Use **Server-Sent Events (SSE)** via FastAPI StreamingResponse for AI response streaming.

### Rationale
1. **Native HTTP**: No WebSocket server complexity, works over standard HTTP
2. **FastAPI Support**: Built-in StreamingResponse for async generators
3. **OpenAI Compatible**: OpenAI SDK streaming integrates seamlessly
4. **Automatic Reconnection**: Browser EventSource API handles reconnection
5. **Simpler Than WebSocket**: Unidirectional (server→client) is sufficient for AI streaming

### Alternatives Considered
- **WebSocket**: Bidirectional overkill for one-way streaming, requires separate server
- **Long Polling**: Higher latency, more server load, poor user experience
- **HTTP Chunked Transfer**: Less browser support than SSE

### Implementation Pattern
```python
# backend/src/api/messages.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from src.services.agent_service import AgentService
from src.auth import get_current_user
import json

router = APIRouter()

@router.post("/api/{user_id}/conversations/{conversation_id}/messages")
async def send_message(
    user_id: str,
    conversation_id: str,
    content: str,
    current_user: dict = Depends(get_current_user),
    agent_service: AgentService = Depends()
):
    # Validate user owns this conversation
    if current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Stream AI response
    async def stream_response():
        async for chunk in agent_service.invoke_agent(user_id, conversation_id, content):
            # SSE format: data: {json}\n\n
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"

        # Send completion signal
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable proxy buffering
        }
    )
```

### Key Points
- **SSE Format**: Each chunk is `data: {json}\n\n`
- **Done Signal**: Send special event when streaming completes
- **Headers**: Disable caching and buffering for real-time streaming
- **Error Handling**: If streaming fails, send error event and close connection

---

## 6. Authentication and Security

### Decision
**Reuse Phase 2 Better Auth JWT authentication** with service-to-service tokens for MCP Server.

### Rationale
1. **Existing Infrastructure**: Better Auth already implemented and working
2. **Consistent Security**: Same JWT validation for all endpoints
3. **Service Tokens**: MCP Server uses dedicated service token to call backend APIs
4. **User Isolation**: user_id extracted from JWT enforced on all queries

### Service-to-Service Authentication
```python
# backend/src/mcp_client/client.py
import os
import jwt
from datetime import datetime, timedelta

def generate_service_token() -> str:
    """Generate JWT token for MCP Server → Backend communication"""
    secret = os.getenv("AUTH_SECRET")
    payload = {
        "sub": "mcp-server",
        "service": True,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, secret, algorithm="HS256")

# mcp-server/src/server.py
def get_service_token() -> str:
    """Get service token for backend API calls"""
    # Token stored in environment or generated on startup
    return os.getenv("MCP_SERVICE_TOKEN")
```

### Prompt Injection Prevention
```python
# backend/src/services/agent_service.py
import re

def sanitize_user_input(content: str) -> str:
    """Prevent prompt injection attacks"""
    # Remove potential system prompt injections
    content = re.sub(r'(?i)(ignore\s+previous|forget\s+instructions)', '', content)

    # Limit length
    if len(content) > 2000:
        content = content[:2000]

    # Remove control characters
    content = ''.join(char for char in content if ord(char) >= 32 or char in '\n\r\t')

    return content.strip()
```

---

## 7. Rate Limiting and Error Handling

### Decision
Implement **tiered rate limiting** with graceful degradation for OpenAI API failures.

### Rate Limiting Strategy
```python
# backend/src/api/messages.py
from fastapi import Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/api/{user_id}/conversations/{conversation_id}/messages")
@limiter.limit("20/minute")  # 20 messages per minute per user
async def send_message(request: Request, ...):
    # ... implementation
```

### Error Handling Pattern
```python
# backend/src/services/agent_service.py
from openai import RateLimitError, APIError, APITimeoutError
import asyncio

async def invoke_agent_with_retry(user_id: str, conversation_id: str, content: str):
    max_retries = 3
    base_delay = 1

    for attempt in range(max_retries):
        try:
            async for chunk in invoke_agent(user_id, conversation_id, content):
                yield chunk
            return
        except RateLimitError:
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)  # Exponential backoff
                await asyncio.sleep(delay)
            else:
                yield "I'm experiencing high demand right now. Please try again in a moment."
        except APITimeoutError:
            yield "The request timed out. Please try again."
        except APIError as e:
            yield f"An error occurred: {e.message}. Please contact support if this persists."
```

---

## 8. Performance Considerations

### Message Pagination
```python
# backend/src/services/conversation_service.py
async def get_conversation_messages(
    conversation_id: str,
    user_id: str,
    limit: int = 50,
    offset: int = 0
) -> List[Message]:
    """Get messages with pagination for long conversations"""
    async with get_session() as session:
        result = await session.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .where(Message.user_id == user_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
```

### Conversation Context Summarization
For conversations >100 messages, summarize older context:
```python
async def prepare_conversation_context(conversation_id: str, user_id: str):
    messages = await get_conversation_messages(conversation_id, user_id)

    if len(messages) > 100:
        # Summarize older messages (beyond 50 most recent)
        older_messages = messages[50:]
        summary = await summarize_messages(older_messages)
        recent_messages = messages[:50]

        return [
            {"role": "system", "content": f"Previous conversation summary: {summary}"}
        ] + [{"role": m.role, "content": m.content} for m in recent_messages]
    else:
        return [{"role": m.role, "content": m.content} for m in messages]
```

---

## 9. Testing Strategy

### Backend Tests
```python
# backend/tests/test_agent_service.py
import pytest
from unittest.mock import Mock, AsyncMock, patch

@pytest.mark.asyncio
async def test_invoke_agent_streams_response():
    """Test that agent service streams AI responses correctly"""
    mock_openai = AsyncMock()
    mock_openai.chat.completions.create.return_value = [
        Mock(choices=[Mock(delta=Mock(content="Hello"))]),
        Mock(choices=[Mock(delta=Mock(content=" world"))])
    ]

    with patch('openai.OpenAI', return_value=mock_openai):
        agent_service = AgentService()
        chunks = []
        async for chunk in agent_service.invoke_agent("user123", "conv456", "Hi"):
            chunks.append(chunk)

        assert chunks == ["Hello", " world"]
```

### MCP Server Tests
```python
# mcp-server/tests/test_create_task_tool.py
import pytest
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_create_task_tool_enforces_user_isolation():
    """Test that create_task tool validates user_id"""
    with patch('httpx.AsyncClient') as mock_client:
        mock_client.return_value.__aenter__.return_value.post = AsyncMock(
            return_value=Mock(json=lambda: {"status": "success"})
        )

        result = await create_task("Test Task", "Description", "user123")

        # Verify correct user_id in API call
        call_args = mock_client.return_value.__aenter__.return_value.post.call_args
        assert "user123" in call_args[0][0]  # URL contains user_id
```

### E2E Tests
```typescript
// frontend/tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('user can send message and receive streamed response', async ({ page }) => {
  await page.goto('/chat');

  // Send message
  await page.fill('[data-testid="message-input"]', 'Create a task to buy milk');
  await page.click('[data-testid="send-button"]');

  // Wait for streaming response
  await page.waitForSelector('[data-testid="message-bubble"]:has-text("task")');

  // Verify task was created
  const response = await page.textContent('[data-testid="assistant-message"]');
  expect(response).toContain('created');
  expect(response).toContain('buy milk');
});
```

---

## Summary

All research findings support the three-layer stateless architecture mandated by the Phase 3 constitution:

1. **OpenAI Agents SDK**: Provides stateless AI orchestration with streaming and function calling
2. **MCP SDK**: Enables stateless task tools with explicit user_id parameters
3. **ChatKit**: Official React component for conversational UI
4. **SQLModel + PostgreSQL**: Conversation persistence with user isolation
5. **SSE Streaming**: Real-time AI responses without WebSocket complexity
6. **Better Auth**: Consistent JWT authentication across all layers

**Status**: All technical decisions validated and ready for Phase 1 (design artifacts).
