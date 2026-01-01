---
id: 2
title: AI Chatbot Implementation Plan
stage: plan
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-chatbot
branch: 003-ai-chatbot
user: Mubeen
command: /sp.plan
labels: [phase-3, ai-chatbot, planning, architecture, openai-agents, mcp-server, chatkit]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-ai-chatbot/plan.md
 - specs/003-ai-chatbot/research.md
 - specs/003-ai-chatbot/data-model.md
 - specs/003-ai-chatbot/contracts/conversations-api.yaml
 - specs/003-ai-chatbot/contracts/messages-api.yaml
 - specs/003-ai-chatbot/contracts/mcp-tools.yaml
 - specs/003-ai-chatbot/quickstart.md
 - CLAUDE.md
tests:
 - null
---

## Prompt

Create implementation plan for Phase 3: AI-Powered Todo Chatbot based on the completed specification.

## Response snapshot

Successfully created comprehensive implementation plan with complete Phase 0 (research) and Phase 1 (design artifacts) for the AI-Powered Todo Chatbot feature.

### Plan Overview

**Branch**: `003-ai-chatbot`

**Summary**: Three-layer stateless architecture enabling conversational task management through OpenAI ChatKit (Frontend) → OpenAI Agents SDK (Backend) → MCP Server (Task Tools), with full conversation persistence in Neon PostgreSQL.

### Technical Context Defined

**Languages/Versions**:
- Backend: Python 3.13+
- Frontend: TypeScript 5+ with Next.js 16+
- MCP Server: Python 3.13+

**Primary Dependencies**:
- Backend: FastAPI 0.115+, SQLModel 0.0.22+, OpenAI Python SDK 1.12+, Pydantic 2.0+
- Frontend: Next.js 16+, React 19+, OpenAI ChatKit, TypeScript 5+, Tailwind CSS
- MCP Server: Official MCP SDK (Python mcp package)
- Database: Neon Serverless PostgreSQL

**Performance Goals**:
- Message persistence: <500ms p95 latency
- Conversation history loading: <2 seconds for 100 messages
- AI response streaming initiation: <1 second
- Concurrent chat sessions: 50 without degradation
- Task creation via chat: <30 seconds end-to-end

**Scale/Scope**:
- 1000 concurrent users during peak
- Average 10-20 conversations per user
- Average 50-100 messages per conversation
- ~100KB per user database growth
- 2-5 OpenAI API calls per user message

### Constitution Check: ✅ ALL GATES PASSED

Validated compliance with all Phase 3 constitution requirements:
- ✅ Spec-Driven Development (SDD) workflow followed
- ✅ Monorepo architecture with /mcp-server layer
- ✅ SQLModel + Neon PostgreSQL for persistence
- ✅ OpenAI Agents SDK for AI orchestration
- ✅ Official MCP SDK for task tools
- ✅ OpenAI ChatKit for frontend
- ✅ JWT authentication with user isolation
- ✅ Stateless architecture (no in-memory state)
- ✅ Service Pattern in backend
- ✅ Pure Tool pattern in MCP Server
- ✅ All compliance gates defined

### Phase 0: Research Findings (research.md)

Completed comprehensive research on 9 technical decisions:

1. **OpenAI Agents SDK Integration**: Use Python SDK v1.12+ with Assistants API and function calling; stateless pattern loading history from DB
2. **MCP SDK Implementation**: Python MCP SDK for type safety and FastAPI integration; tools call backend endpoints
3. **ChatKit Frontend Integration**: @openai/chatkit React library with custom SSE streaming
4. **Conversation Persistence**: SQLModel with Conversations and Messages tables, one-to-many relationship
5. **Streaming Response**: Server-Sent Events via FastAPI StreamingResponse
6. **Authentication**: Reuse Better Auth JWT with service-to-service tokens for MCP Server
7. **Rate Limiting**: Tiered rate limiting (20/minute per user) with exponential backoff
8. **Performance**: Message pagination, conversation context summarization for >100 messages
9. **Testing**: pytest (backend), Jest (frontend), Playwright (E2E)

All research findings validated and support three-layer stateless architecture.

### Phase 1: Design Artifacts Created

**1. Data Model (data-model.md)**:
- **Conversation** entity: id, user_id, title, created_at, updated_at
- **Message** entity: id, conversation_id, user_id, role, content, created_at
- **Task** entity: Existing from Phase 2, managed via MCP tools
- Relationships: User (1:N) Conversation (1:N) Message
- Indexes: user_id, created_at composite indexes for performance
- Validation rules: user_id isolation, role enum constraints, content length limits
- Migration SQL: 003_add_conversations_messages.sql with triggers

**2. API Contracts**:

**conversations-api.yaml** - Conversation CRUD endpoints:
- POST /api/{user_id}/conversations - Create conversation
- GET /api/{user_id}/conversations - List conversations (paginated)
- GET /api/{user_id}/conversations/{id} - Get conversation with messages
- PUT /api/{user_id}/conversations/{id} - Update conversation (rename)
- DELETE /api/{user_id}/conversations/{id} - Delete conversation (cascade)
- All endpoints follow standardized envelope format
- JWT authentication required
- User isolation enforced

**messages-api.yaml** - Message streaming endpoint:
- POST /api/{user_id}/conversations/{id}/messages - Send message, stream AI response
- Server-Sent Events (text/event-stream)
- Streaming format: data: {chunk: "text"}, data: {done: true}
- Real-time response chunks from OpenAI Agent

**mcp-tools.yaml** - MCP tool definitions:
- create_task(title, description, user_id)
- list_tasks(user_id, status_filter)
- update_task(task_id, user_id, updates)
- delete_task(task_id, user_id)
- toggle_task_completion(task_id, user_id)
- All tools stateless with explicit user_id parameters
- Standardized return format matching API envelopes

**3. Quickstart Guide (quickstart.md)**:
- 10-step setup and verification process
- Database migration instructions
- MCP Server setup and testing
- Backend configuration with OpenAI SDK
- Frontend ChatKit installation
- End-to-end verification scenarios
- Performance validation tests
- Security validation tests (isolation, JWT, prompt injection)
- Error handling validation
- Component test instructions
- Final checklist (19 items)
- Troubleshooting guide
- Success criteria validation

### Project Structure

**Backend** (Existing + New):
- `src/models/conversation.py` - NEW
- `src/models/message.py` - NEW
- `src/services/conversation_service.py` - NEW
- `src/services/message_service.py` - NEW
- `src/services/agent_service.py` - NEW (OpenAI Agents SDK)
- `src/mcp_client/client.py` - NEW (MCP Client)
- `src/api/conversations.py` - NEW
- `src/api/messages.py` - NEW (SSE streaming)
- `migrations/003_add_conversations_messages.sql` - NEW

**Frontend** (Existing + New):
- `src/app/chat/page.tsx` - NEW (Main chat interface)
- `src/app/chat/[conversationId]/page.tsx` - NEW
- `src/components/chat/ChatInterface.tsx` - NEW (ChatKit wrapper)
- `src/components/chat/ConversationList.tsx` - NEW
- `src/components/chat/MessageBubble.tsx` - NEW
- `src/components/chat/StreamingIndicator.tsx` - NEW
- `src/hooks/useConversation.tsx` - NEW
- `src/hooks/useMessages.tsx` - NEW
- `src/services/conversation.ts` - NEW
- `src/services/message.ts` - NEW (SSE client)
- `src/types/conversation.ts` - NEW
- `src/types/message.ts` - NEW

**MCP Server** (Entirely New):
- `src/server.py` - MCP Server initialization
- `src/tools/create_task.py` - Create task tool
- `src/tools/list_tasks.py` - List tasks tool
- `src/tools/update_task.py` - Update task tool
- `src/tools/delete_task.py` - Delete task tool
- `src/tools/toggle_task.py` - Toggle completion tool
- `src/db_client.py` - Database client
- `pyproject.toml` - Dependencies (mcp SDK)
- `CLAUDE.md` - MCP server guidelines

### Post-Design Constitution Re-Check

✅ All constitution gates continue to pass after design phase.

**Key Validations**:
- ✅ Data models enforce user_id isolation via UserMixin pattern
- ✅ API contracts follow standardized envelope format
- ✅ MCP tools accept explicit user_id parameters (stateless)
- ✅ Agent service loads/persists conversation context (stateless)
- ✅ Frontend uses ChatKit (official OpenAI component)
- ✅ No implementation violates clean architecture or security principles

### Implementation Notes

**Critical Path**:
1. Database migration (Conversations + Messages tables)
2. MCP Server setup (task tools + server initialization)
3. Backend conversation service (CRUD operations)
4. Backend agent service (OpenAI Agents SDK integration)
5. Backend MCP client (tool invocation)
6. Backend conversation endpoints (including streaming)
7. Frontend ChatKit integration (conversation UI)
8. Frontend conversation management (list, create, switch)
9. Frontend message streaming (SSE handling)
10. End-to-end testing (conversation flows)

**Risk Mitigation**:
- OpenAI API rate limits: Exponential backoff, user quotas
- Streaming complexity: Start with SSE, fallback to polling
- MCP Server communication: FastAPI endpoints initially
- Conversation context size: Summarization for >100 messages
- Concurrent access: Database transactions, optimistic locking

**Security Checklist** (All items checked):
- [x] JWT validation on all new endpoints
- [x] User_id isolation on all database queries
- [x] Input sanitization to prevent prompt injection
- [x] Rate limiting on message sending
- [x] MCP tools validate user_id ownership
- [x] Conversation access control
- [x] Error messages don't leak sensitive information

### Agent Context Updated

Successfully updated `CLAUDE.md` with Phase 3 context including:
- Web application with monorepo structure (frontend + backend + mcp-server)
- Technology stack references preserved
- Project structure aligned with plan

## Outcome

- ✅ Impact: Complete technical implementation plan with research, data model, API contracts, and quickstart guide
- 🧪 Tests: Testing strategy defined (pytest, Jest, Playwright) with >80% coverage target
- 📁 Files: Created 8 new files (plan.md, research.md, data-model.md, 3 contract files, quickstart.md, agent context update)
- 🔁 Next prompts: Run `/sp.tasks` to generate actionable task breakdown organized by user stories
- 🧠 Reflection: Plan successfully translates Phase 3 specification into concrete technical architecture. Three-layer stateless design ensures scalability and aligns with constitution mandates. All research decisions validated. Design artifacts provide clear implementation contracts. Quickstart guide enables rapid validation. Ready for task generation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully with all artifacts generated
- Graders run and results (PASS/FAIL):
  - Constitution Check: PASS (all gates passed)
  - Technical Context: PASS (all fields completed)
  - Research: PASS (9 decisions with rationale)
  - Data Model: PASS (complete entity definitions with validation)
  - API Contracts: PASS (3 OpenAPI/YAML files with standardized envelopes)
  - Quickstart: PASS (10-step guide with verification)
  - Overall: PASS (plan ready for task generation)
- Prompt variant (if applicable): N/A - First iteration with constitution-guided approach
- Next experiment (smallest change to try): Proceed with `/sp.tasks` to generate dependency-ordered task breakdown
