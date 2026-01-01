# Data Model: AI-Powered Todo Chatbot

**Feature**: 003-ai-chatbot
**Date**: 2025-12-31
**Status**: Complete

## Overview

This document defines the database schema, entity relationships, validation rules, and state transitions for the AI-Powered Todo Chatbot feature. All entities follow the Phase 3 constitution's user isolation requirements.

---

## Entity Definitions

### 1. Conversation

Represents a chat thread between a user and the AI assistant.

**Fields:**

| Field        | Type      | Constraints                          | Description                                      |
|--------------|-----------|--------------------------------------|--------------------------------------------------|
| id           | UUID      | PRIMARY KEY, NOT NULL                | Unique identifier for the conversation           |
| user_id      | UUID      | NOT NULL, FOREIGN KEY, INDEX         | Owner of the conversation (user isolation)       |
| title        | VARCHAR(255) | NOT NULL                           | Conversation title (auto-generated or user-set)  |
| created_at   | TIMESTAMP | NOT NULL, DEFAULT NOW()              | When the conversation was created                |
| updated_at   | TIMESTAMP | NOT NULL, DEFAULT NOW()              | When the conversation was last updated           |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id` (for user isolation queries)
- COMPOSITE INDEX on `(user_id, created_at DESC)` (for sorted conversation listing)

**Relationships:**
- `user_id` → `users.id` (many-to-one: many conversations belong to one user)
- `messages` → One-to-many relationship with Message entity

**SQLModel Definition:**
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(nullable=False, foreign_key="users.id", index=True)
    title: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
```

**Validation Rules:**
- `title` must not be empty (length >= 1)
- `title` must not exceed 255 characters
- `user_id` must reference an existing user
- `created_at` must be <= `updated_at`

**Business Rules:**
- Title auto-generation: If not provided, use first 50 characters of the first user message
- Soft delete: Consider marking conversations as deleted rather than hard deletion (optional enhancement)
- Update `updated_at` timestamp whenever a new message is added to the conversation

---

### 2. Message

Represents a single message within a conversation (either from user or AI assistant).

**Fields:**

| Field            | Type      | Constraints                              | Description                                      |
|------------------|-----------|------------------------------------------|--------------------------------------------------|
| id               | UUID      | PRIMARY KEY, NOT NULL                    | Unique identifier for the message                |
| conversation_id  | UUID      | NOT NULL, FOREIGN KEY, INDEX             | Parent conversation                              |
| user_id          | UUID      | NOT NULL, FOREIGN KEY, INDEX             | Owner (for user isolation, matches conversation) |
| role             | VARCHAR(50) | NOT NULL, CHECK IN ('user', 'assistant') | Who sent the message                             |
| content          | TEXT      | NOT NULL                                 | Message text content                             |
| created_at       | TIMESTAMP | NOT NULL, DEFAULT NOW()                  | When the message was created                     |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `conversation_id` (for retrieving conversation messages)
- INDEX on `user_id` (for user isolation queries)
- COMPOSITE INDEX on `(conversation_id, created_at ASC)` (for chronological message ordering)
- COMPOSITE INDEX on `(user_id, created_at DESC)` (for user message history)

**Relationships:**
- `conversation_id` → `conversations.id` (many-to-one: many messages belong to one conversation)
- `user_id` → `users.id` (many-to-one: many messages belong to one user)

**SQLModel Definition:**
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(
        nullable=False,
        foreign_key="conversations.id",
        index=True
    )
    user_id: UUID = Field(nullable=False, foreign_key="users.id", index=True)
    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
```

**Validation Rules:**
- `role` must be exactly "user" or "assistant" (enforced by CHECK constraint)
- `content` must not be empty (length >= 1)
- `content` should not exceed 100,000 characters (application-level limit)
- `user_id` must match the `user_id` of the parent conversation (consistency check)
- `conversation_id` must reference an existing conversation

**Business Rules:**
- User messages are created directly by user input
- Assistant messages are created after AI agent processing
- Message order determined by `created_at` timestamp (must be unique within conversation)
- Messages are immutable once created (no edits allowed for audit trail)
- Cascade delete: When conversation is deleted, all its messages are deleted

---

### 3. Task (Existing Entity - Reference Only)

**Note**: This entity already exists from Phase 2. Included here for completeness.

**Fields:**

| Field        | Type      | Constraints                   | Description                              |
|--------------|-----------|-------------------------------|------------------------------------------|
| id           | UUID      | PRIMARY KEY, NOT NULL         | Unique identifier for the task           |
| user_id      | UUID      | NOT NULL, FOREIGN KEY, INDEX  | Owner of the task (user isolation)       |
| title        | VARCHAR(255) | NOT NULL                    | Task title                               |
| description  | TEXT      | NULLABLE                      | Task description (optional)              |
| completed    | BOOLEAN   | NOT NULL, DEFAULT FALSE       | Completion status                        |
| created_at   | TIMESTAMP | NOT NULL, DEFAULT NOW()       | When the task was created                |
| updated_at   | TIMESTAMP | NOT NULL, DEFAULT NOW()       | When the task was last updated           |

**Relationships:**
- `user_id` → `users.id` (many-to-one)

**Interaction with Chatbot:**
- Tasks are managed via MCP tools invoked by the AI agent
- All task operations include user_id parameter for isolation
- Task modifications update `updated_at` timestamp

---

## Entity Relationships

```
┌─────────────┐
│    User     │
│             │
└──────┬──────┘
       │
       │ (1:N)
       │
       ├────────────────────────────────┐
       │                                │
       │                                │
       ▼                                ▼
┌─────────────────┐            ┌──────────────┐
│  Conversation   │            │     Task     │
│                 │            │              │
│ - id            │            │ - id         │
│ - user_id (FK)  │            │ - user_id(FK)│
│ - title         │            │ - title      │
│ - created_at    │            │ - completed  │
│ - updated_at    │            │ - ...        │
└────────┬────────┘            └──────────────┘
         │
         │ (1:N)
         │
         ▼
  ┌──────────────┐
  │   Message    │
  │              │
  │ - id         │
  │ - conv_id(FK)│
  │ - user_id(FK)│
  │ - role       │
  │ - content    │
  │ - created_at │
  └──────────────┘
```

**Key Relationships:**
1. **User → Conversation**: One user can have many conversations (1:N)
2. **User → Task**: One user can have many tasks (1:N) - existing from Phase 2
3. **Conversation → Message**: One conversation contains many messages (1:N)
4. **User → Message**: One user can have many messages (1:N) - for isolation enforcement

---

## User Isolation Enforcement

All database queries MUST enforce user isolation by filtering on `user_id`. This is a **CRITICAL** security requirement from the Phase 3 constitution.

### Query Examples with Isolation

**Get User's Conversations:**
```python
async def get_user_conversations(user_id: UUID) -> List[Conversation]:
    async with get_session() as session:
        result = await session.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
        )
        return result.scalars().all()
```

**Get Conversation with Messages (with isolation):**
```python
async def get_conversation_with_messages(
    conversation_id: UUID,
    user_id: UUID
) -> Optional[Conversation]:
    async with get_session() as session:
        # CRITICAL: Filter by user_id for isolation
        result = await session.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .where(Conversation.user_id == user_id)
            .options(selectinload(Conversation.messages))
        )
        return result.scalar_one_or_none()
```

**Create Message (with isolation validation):**
```python
async def create_message(
    conversation_id: UUID,
    user_id: UUID,
    role: MessageRole,
    content: str
) -> Message:
    async with get_session() as session:
        # Verify conversation belongs to user
        conversation = await session.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .where(Conversation.user_id == user_id)
        )
        if not conversation.scalar_one_or_none():
            raise ValueError("Conversation not found or access denied")

        # Create message with matching user_id
        message = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role=role,
            content=content
        )
        session.add(message)
        await session.commit()
        await session.refresh(message)
        return message
```

---

## Database Migration

**File**: `backend/migrations/003_add_conversations_messages.sql`

```sql
-- Migration: Add Conversations and Messages tables for AI Chatbot
-- Feature: 003-ai-chatbot
-- Date: 2025-12-31

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT title_not_empty CHECK (LENGTH(title) >= 1)
);

-- Create indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
    ON conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_created
    ON conversations(user_id, created_at DESC);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT content_not_empty CHECK (LENGTH(content) >= 1)
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
    ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_user_id
    ON messages(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
    ON messages(conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_user_created
    ON messages(user_id, created_at DESC);

-- Add trigger to update conversation.updated_at when new message added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Add comments for documentation
COMMENT ON TABLE conversations IS 'Chat threads between users and AI assistant';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON COLUMN conversations.user_id IS 'User isolation - owner of conversation';
COMMENT ON COLUMN messages.user_id IS 'User isolation - must match conversation owner';
COMMENT ON COLUMN messages.role IS 'Message sender: user or assistant';
```

---

## Validation Rules Summary

### Conversation Validation
- ✅ `title`: Non-empty, max 255 characters
- ✅ `user_id`: Must reference existing user
- ✅ `updated_at`: Must be >= `created_at`

### Message Validation
- ✅ `role`: Must be "user" or "assistant"
- ✅ `content`: Non-empty, max 100,000 characters (app-level)
- ✅ `user_id`: Must match parent conversation's user_id
- ✅ `conversation_id`: Must reference existing conversation

### Cross-Entity Validation
- ✅ Message user_id MUST match conversation user_id (consistency)
- ✅ All queries MUST filter by user_id (isolation)
- ✅ Cascade deletion: conversation delete removes all messages

---

## State Transitions

### Conversation Lifecycle

```
┌──────────┐
│  Create  │ (User starts new conversation)
└────┬─────┘
     │
     ▼
┌──────────────┐
│    Active    │ ◄──── Add messages (user/assistant)
└─────┬────────┘
      │
      ├─────► Update title (rename)
      │
      ├─────► Archive (optional future enhancement)
      │
      ▼
┌──────────────┐
│   Deleted    │ (User deletes conversation)
└──────────────┘
```

**State Rules:**
- Created: When first message is sent or explicitly created
- Active: Default state, accepts new messages
- Deleted: Cascade deletes all associated messages

### Message Lifecycle

```
┌──────────┐
│  Create  │ (User sends message OR AI responds)
└────┬─────┘
     │
     ▼
┌──────────────┐
│  Immutable   │ (No edits allowed - audit trail)
└──────────────┘
```

**State Rules:**
- Messages are immutable once created
- No edit or update operations allowed
- Only deletion via conversation cascade delete

---

## Performance Considerations

### Query Optimization
1. **Conversation Listing**: Use `(user_id, created_at DESC)` index
2. **Message Retrieval**: Use `(conversation_id, created_at ASC)` index
3. **Pagination**: Implement LIMIT/OFFSET for large message lists
4. **Eager Loading**: Use SQLModel `selectinload` to avoid N+1 queries

### Example Optimized Query
```python
async def get_conversations_with_latest_message(user_id: UUID, limit: int = 20):
    """Get user's conversations with latest message (optimized)"""
    async with get_session() as session:
        # Use subquery to get latest message per conversation
        latest_message_subq = (
            select(
                Message.conversation_id,
                func.max(Message.created_at).label('latest_msg_time')
            )
            .where(Message.user_id == user_id)
            .group_by(Message.conversation_id)
            .subquery()
        )

        result = await session.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .join(
                latest_message_subq,
                Conversation.id == latest_message_subq.c.conversation_id
            )
            .order_by(latest_message_subq.c.latest_msg_time.desc())
            .limit(limit)
        )
        return result.scalars().all()
```

### Indexing Strategy
- All `user_id` fields indexed (user isolation queries)
- Composite indexes for common query patterns
- `created_at` indexes for chronological ordering
- Foreign key indexes for join performance

---

## Security Validation Checklist

- [x] All tables include `user_id` column for isolation
- [x] All queries filter by `user_id`
- [x] Foreign key constraints enforce referential integrity
- [x] CHECK constraints prevent invalid role values
- [x] Cascade deletion prevents orphaned messages
- [x] Indexes optimized for user-scoped queries
- [x] Trigger updates conversation timestamp automatically
- [x] No cross-user data access possible via schema design

**Status**: Data model ready for implementation
