# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-chatbot/spec.md`

## Summary

This feature implements a conversational AI chatbot for task management using a three-layer stateless architecture. Users interact with their todo tasks through natural language conversation via OpenAI ChatKit (Frontend), which connects to an OpenAI Agents SDK orchestrator (Backend) that invokes task management tools exposed by an MCP Server. All conversations and messages are persisted to Neon PostgreSQL with strict user isolation.

**Primary Requirement**: Enable users to manage todo tasks conversationally through an AI-powered chat interface with full conversation history persistence.

**Technical Approach**:
- Frontend: OpenAI ChatKit for React with streaming response support
- Backend: FastAPI with OpenAI Agents SDK for conversation orchestration, SQLModel for database persistence
- MCP Server: Python-based MCP SDK implementation exposing stateless task operation tools
- Database: Extend Neon PostgreSQL with Conversations and Messages tables
- Security: JWT authentication with user_id isolation on all queries

## Technical Context

**Language/Version**:
- Backend: Python 3.13+
- Frontend: TypeScript 5+ with Next.js 16+
- MCP Server: Python 3.13+

**Primary Dependencies**:
- Backend: FastAPI 0.115+, SQLModel 0.0.22+, OpenAI Python SDK 1.12+, Pydantic 2.0+
- Frontend: Next.js 16+, React 19+, OpenAI ChatKit (@openai/chatkit), TypeScript 5+, Tailwind CSS
- MCP Server: Official MCP SDK (mcp Python package or @modelcontextprotocol/sdk for TypeScript)
- Database: Neon Serverless PostgreSQL with existing connection pooling
- Authentication: Better Auth (existing from Phase 2)

**Storage**:
- Neon Serverless PostgreSQL (existing connection)
- New tables: conversations, messages
- Existing tables: tasks, users (from Phase 2)

**Testing**:
- Backend: pytest for unit and integration tests
- Frontend: Jest + React Testing Library
- MCP Server: pytest for tool validation
- E2E: Playwright for full conversation flows

**Target Platform**:
- Web application (Linux server for backend/MCP, browser for frontend)
- Docker containers for local development
- Production deployment via existing infrastructure

**Project Type**: Web application with monorepo structure (frontend + backend + mcp-server)

**Performance Goals**:
- Message persistence: <500ms p95 latency
- Conversation history loading: <2 seconds for 100 messages
- AI response streaming initiation: <1 second
- Concurrent chat sessions: 50 without degradation
- Overall task creation via chat: <30 seconds end-to-end

**Constraints**:
- Stateless architecture: No in-memory conversation buffers
- User isolation: All queries MUST filter by user_id
- JWT validation: All chat endpoints require valid authentication
- OpenAI API rate limits: Handle gracefully with exponential backoff
- Database connection pooling: Reuse existing Neon connection
- Streaming responses: Use Server-Sent Events (SSE) or WebSocket

**Scale/Scope**:
- Initial: 1000 concurrent users during peak
- Conversations: Average 10-20 per user
- Messages: Average 50-100 per conversation
- Database growth: ~100KB per user (conversations + messages)
- OpenAI API calls: ~2-5 per user message (including tool invocations)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Evaluation (Phase 0)

✅ **Spec-Driven Development (SDD)**
- Following strict SDD workflow: /sp.specify → /sp.plan → /sp.tasks → /sp.implement
- Spec completed and validated before planning

✅ **Monorepo Architecture**
- Extends existing /frontend and /backend directories
- Adds new /mcp-server directory with dedicated CLAUDE.md
- Maintains layered configuration files

✅ **Tech Stack & Persistence Standards**
- SQLModel for new Conversations and Messages tables
- Neon Serverless PostgreSQL (existing connection)
- OpenAI Agents SDK for AI orchestration
- Official MCP SDK for task tools
- OpenAI ChatKit for frontend

✅ **Security-First Approach**
- JWT authentication via Better Auth (Phase 2)
- User isolation with user_id filtering on all queries
- Conversation and message tables include user_id indexes
- Prompt injection prevention through input sanitization

✅ **API Design & Data Contracts**
- New endpoints prefixed with /api/{user_id}/conversations
- Standardized API envelopes (success/error format)
- Pydantic schemas for request/response validation
- OpenAPI documentation auto-generated

✅ **Enhanced Requirements & Quality**
- ChatKit provides responsive, accessible UI
- Global exception handlers in FastAPI
- Graceful error handling for AI failures

✅ **AI Chatbot Architecture**
- Three-layer stateless architecture enforced
- Frontend (ChatKit) → Backend (OpenAI Agents) → MCP Server (Tools)
- No in-memory conversation state
- Database persistence for all conversations/messages
- User isolation at every layer

✅ **MCP Server Standards**
- Using Official MCP SDK
- Stateless tool definitions with user_id parameters
- No session storage or caching
- Communication via FastAPI endpoints or shared DB connection

✅ **Data Isolation Law**
- All conversation queries include .where(Conversation.user_id == authenticated_user_id)
- All message queries include .where(Message.user_id == authenticated_user_id)
- Conversations and Messages tables inherit user_id field pattern

✅ **Clean Architecture**
- Backend uses Service Pattern (conversation_service.py, agent_service.py)
- Controllers handle HTTP, Services handle business logic
- Repositories handle database operations
- MCP Server uses pure Tool pattern (stateless functions)

✅ **Monorepo CLI Conventions**
- Backend: `uv` for Python dependencies
- Frontend: `pnpm` for JavaScript/TypeScript dependencies
- MCP Server: `uv` for Python dependencies
- Lock files committed to version control

✅ **Compliance Gates**
- Will achieve 80%+ test coverage
- PHR will be created for this planning phase
- Linting and formatting enforced
- Security validation for user isolation
- Performance validation against <500ms p95 latency
- Stateless verification for MCP Server and Agent

**Status**: ✅ ALL GATES PASSED - Ready for Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── conversations-api.yaml     # Conversation CRUD endpoints
│   ├── messages-api.yaml          # Message creation and streaming
│   └── mcp-tools.yaml             # MCP tool definitions
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend + mcp-server)
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── conversation.py         # NEW: Conversation SQLModel
│   │   ├── message.py              # NEW: Message SQLModel
│   │   └── task.py                 # EXISTING: Task model
│   ├── services/
│   │   ├── __init__.py
│   │   ├── conversation_service.py # NEW: Conversation CRUD operations
│   │   ├── message_service.py      # NEW: Message operations
│   │   ├── agent_service.py        # NEW: OpenAI Agent orchestration
│   │   └── task_service.py         # EXISTING: Task operations
│   ├── api/
│   │   ├── __init__.py
│   │   ├── conversations.py        # NEW: Conversation endpoints
│   │   ├── messages.py             # NEW: Message endpoints (send, stream)
│   │   └── tasks.py                # EXISTING: Task endpoints
│   ├── mcp_client/
│   │   ├── __init__.py
│   │   └── client.py               # NEW: MCP Client for tool invocation
│   ├── auth.py                     # EXISTING: JWT validation middleware
│   ├── database.py                 # EXISTING: Database connection
│   └── main.py                     # EXISTING: FastAPI app (add new routers)
├── migrations/
│   └── 003_add_conversations_messages.sql  # NEW: Database migration
└── tests/
    ├── test_conversation_service.py # NEW: Conversation service tests
    ├── test_agent_service.py        # NEW: Agent service tests
    └── test_mcp_client.py           # NEW: MCP client tests

frontend/
├── src/
│   ├── app/
│   │   ├── chat/
│   │   │   ├── page.tsx            # NEW: Main chat interface
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx        # NEW: Specific conversation view
│   │   └── layout.tsx              # EXISTING: Root layout
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx   # NEW: OpenAI ChatKit wrapper
│   │   │   ├── ConversationList.tsx # NEW: List of conversations
│   │   │   ├── MessageBubble.tsx   # NEW: Custom message rendering
│   │   │   └── StreamingIndicator.tsx # NEW: Streaming status
│   │   └── ui/                     # EXISTING: UI primitives
│   ├── hooks/
│   │   ├── useConversation.tsx     # NEW: Conversation management hook
│   │   ├── useMessages.tsx         # NEW: Message streaming hook
│   │   └── useAuth.tsx             # EXISTING: Authentication hook
│   ├── services/
│   │   ├── conversation.ts         # NEW: Conversation API client
│   │   ├── message.ts              # NEW: Message API client with SSE
│   │   └── auth.ts                 # EXISTING: Auth service
│   └── types/
│       ├── conversation.ts         # NEW: Conversation types
│       ├── message.ts              # NEW: Message types
│       └── api.ts                  # EXISTING: API response types
└── tests/
    ├── ChatInterface.test.tsx      # NEW: ChatKit integration tests
    └── useConversation.test.tsx    # NEW: Conversation hook tests

mcp-server/
├── src/
│   ├── __init__.py
│   ├── server.py                   # NEW: MCP Server initialization
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── create_task.py          # NEW: Create task tool
│   │   ├── list_tasks.py           # NEW: List tasks tool
│   │   ├── update_task.py          # NEW: Update task tool
│   │   ├── delete_task.py          # NEW: Delete task tool
│   │   └── toggle_task.py          # NEW: Toggle completion tool
│   └── db_client.py                # NEW: Database client for tools
├── pyproject.toml                  # NEW: Python dependencies (mcp SDK)
├── uv.lock                         # NEW: Dependency lock file
├── CLAUDE.md                       # NEW: MCP server coding guidelines
└── tests/
    ├── test_create_task_tool.py    # NEW: Tool tests
    └── test_mcp_server.py          # NEW: Server tests
```

**Structure Decision**: This feature extends the existing web application monorepo structure by adding a new `/mcp-server` directory for stateless task tools. The backend gains conversation management capabilities and OpenAI Agents SDK integration. The frontend adds a new `/chat` route with OpenAI ChatKit components. All three layers (frontend, backend, mcp-server) maintain clear separation of concerns as mandated by the Phase 3 constitution.

## Complexity Tracking

No constitution violations detected. The implementation follows all architectural patterns and security requirements defined in the Phase 3 constitution.

## Phase 0: Research & Technology Investigation

See [research.md](./research.md) for detailed research findings on:

1. **OpenAI Agents SDK Integration Pattern**
   - Decision: Use OpenAI Python SDK v1.12+ with Assistants API and function calling
   - Rationale: Official SDK provides streaming, function calling, and stateless operation support
   - Stateless pattern: Load conversation history, invoke agent, persist response

2. **MCP SDK Implementation Approach**
   - Decision: Use Python MCP SDK (mcp package) for type safety and FastAPI integration
   - Rationale: Python aligns with existing backend stack, official SDK ensures compatibility
   - Tool communication: MCP Server will call FastAPI endpoints for database operations

3. **OpenAI ChatKit Frontend Integration**
   - Decision: Use @openai/chatkit React library with custom SSE streaming
   - Rationale: Official OpenAI component optimized for conversation UI, supports streaming
   - Customization: Extend with custom message bubbles and conversation list UI

4. **Conversation Persistence Strategy**
   - Decision: SQLModel with Conversations and Messages tables, one-to-many relationship
   - Rationale: Consistent with Phase 2 architecture, supports efficient querying
   - Indexing: user_id + created_at for fast conversation retrieval

5. **Streaming Response Architecture**
   - Decision: Server-Sent Events (SSE) via FastAPI StreamingResponse
   - Rationale: Native HTTP streaming, no WebSocket complexity, works with OpenAI streaming
   - Implementation: Backend streams OpenAI Agent responses chunk-by-chunk to frontend

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](./data-model.md) for complete entity definitions, relationships, and validation rules.

**Key Entities Summary**:
- **Conversation**: id, user_id, title, created_at, updated_at
- **Message**: id, conversation_id, user_id, role, content, created_at
- **Task** (existing): id, user_id, title, description, completed, created_at, updated_at

### API Contracts

See [contracts/](./contracts/) directory for OpenAPI specifications:
- `conversations-api.yaml`: Conversation CRUD endpoints
- `messages-api.yaml`: Message creation and streaming endpoints
- `mcp-tools.yaml`: MCP tool definitions for task operations

**Key Endpoints Summary**:
- POST /api/{user_id}/conversations - Create new conversation
- GET /api/{user_id}/conversations - List user's conversations
- GET /api/{user_id}/conversations/{conversation_id} - Get conversation with messages
- DELETE /api/{user_id}/conversations/{conversation_id} - Delete conversation
- POST /api/{user_id}/conversations/{conversation_id}/messages - Send message to AI agent (streams response)

**MCP Tools Summary**:
- create_task(title, description, user_id)
- list_tasks(user_id, status_filter)
- update_task(task_id, user_id, updates)
- delete_task(task_id, user_id)
- toggle_task_completion(task_id, user_id)

### Quickstart

See [quickstart.md](./quickstart.md) for step-by-step setup and verification instructions.

## Post-Design Constitution Re-Check

✅ All constitution gates continue to pass after design phase.

**Key Validations**:
- ✅ Data models enforce user_id isolation via UserMixin pattern
- ✅ API contracts follow standardized envelope format
- ✅ MCP tools accept explicit user_id parameters (stateless)
- ✅ Agent service loads/persists conversation context (stateless)
- ✅ Frontend uses ChatKit (official OpenAI component)
- ✅ No implementation violates clean architecture or security principles

**Ready for**: `/sp.tasks` command to generate actionable task breakdown

## Implementation Notes

### Critical Path
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

### Risk Mitigation
- **OpenAI API Rate Limits**: Implement exponential backoff, user quotas, graceful error messages
- **Streaming Complexity**: Start with simple SSE, fallback to polling if issues arise
- **MCP Server Communication**: Use FastAPI endpoints initially, consider shared DB connection for optimization
- **Conversation Context Size**: Implement summarization for conversations >100 messages
- **Concurrent Access**: Use database transactions and optimistic locking for conflict resolution

### Dependencies Sequencing
1. Database migration MUST complete before any conversation/message operations
2. MCP Server MUST be running before backend agent can invoke tools
3. Backend conversation endpoints MUST work before frontend integration
4. Authentication (Phase 2) MUST remain functional throughout

### Performance Optimizations
- Database indexes on user_id + created_at for fast conversation queries
- Connection pooling for Neon PostgreSQL (reuse existing)
- Message pagination for long conversations (load latest 50, fetch more on scroll)
- OpenAI response streaming to reduce perceived latency
- Caching of MCP tool schemas (loaded once at startup)

### Security Checklist
- [x] JWT validation on all new endpoints
- [x] User_id isolation on all database queries
- [x] Input sanitization to prevent prompt injection
- [x] Rate limiting on message sending (prevent API abuse)
- [x] MCP tools validate user_id ownership before operations
- [x] Conversation access control (users can only access their own)
- [x] Error messages don't leak sensitive information

## Next Steps

1. Run `/sp.tasks` to generate task breakdown organized by user stories
2. Review generated tasks for completeness and ordering
3. Run `/sp.implement` to execute tasks in dependency order
4. Validate implementation against success criteria from spec.md
