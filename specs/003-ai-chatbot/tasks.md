---
description: "Task list for AI-Powered Todo Chatbot implementation"
---

# Tasks: AI-Powered Todo Chatbot

**Input**: Design documents from `/specs/003-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are optional and marked for reference only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **MCP Server**: `mcp-server/src/`, `mcp-server/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and MCP Server structure

- [x] T001 Create MCP Server project structure with src/, tests/, pyproject.toml in mcp-server/
- [x] T002 Initialize MCP Server pyproject.toml with mcp SDK dependency and Python 3.13+ requirement
- [x] T003 [P] Create mcp-server/CLAUDE.md with MCP server coding guidelines and stateless tool patterns
- [x] T004 [P] Create mcp-server/src/__init__.py for package initialization
- [x] T005 [P] Create mcp-server/src/tools/__init__.py for tools package
- [x] T006 [P] Create backend/.env.example with OPENAI_API_KEY, MCP_SERVICE_TOKEN placeholders
- [x] T007 [P] Create frontend/.env.local.example with API base URL placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Run database migration backend/migrations/003_add_conversations_messages.sql to create conversations and messages tables
- [x] T009 Verify database migration success by checking conversations and messages tables exist with correct schema
- [x] T010 [P] Install OpenAI Python SDK in backend: uv add openai>=1.12.0
- [x] T011 [P] Install httpx in backend for MCP Server HTTP communication: uv add httpx
- [x] T012 [P] Install mcp SDK in MCP Server: cd mcp-server && uv add mcp
- [x] T013 [P] Install OpenAI ChatKit in frontend: cd frontend && pnpm add @openai/chatkit
- [x] T014 Create backend/src/models/conversation.py with Conversation SQLModel (id, user_id, title, created_at, updated_at)
- [x] T015 Create backend/src/models/message.py with Message SQLModel (id, conversation_id, user_id, role, content, created_at)
- [x] T016 Update backend/src/models/__init__.py to export Conversation and Message models
- [x] T017 Create backend/src/services/conversation_service.py with CRUD operations (create, get_by_id, get_by_user, update, delete) enforcing user_id isolation
- [x] T018 Create backend/src/services/message_service.py with operations (create, get_by_conversation) enforcing user_id isolation
- [x] T019 Create mcp-server/src/db_client.py with database connection utility for tool operations (reuse existing connection string)
- [x] T020 Create mcp-server/src/server.py with MCP Server initialization and stdio transport setup

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Conversational Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to manage tasks through natural language conversation with AI

**Independent Test**: Authenticate, open chat, type "create a task to buy groceries", verify AI creates task and confirms conversationally

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create mcp-server/src/tools/create_task.py tool with @Tool.define decorator, accepts title, description, user_id parameters
- [ ] T022 [P] [US1] Create mcp-server/src/tools/list_tasks.py tool accepting user_id and status_filter (all/completed/incomplete) parameters
- [ ] T023 [P] [US1] Create mcp-server/src/tools/update_task.py tool accepting task_id, user_id, updates dict parameters
- [ ] T024 [P] [US1] Create mcp-server/src/tools/delete_task.py tool accepting task_id, user_id parameters
- [ ] T025 [P] [US1] Create mcp-server/src/tools/toggle_task.py tool accepting task_id, user_id parameters to toggle completion
- [ ] T026 [US1] Register all 5 tools (create, list, update, delete, toggle) in mcp-server/src/server.py @server.tool() decorators
- [ ] T027 [US1] Implement tool execution logic in each tool file to call backend API endpoints with service token authentication
- [ ] T028 [US1] Add service token generation function in backend/src/mcp_client/__init__.py using JWT with "mcp-server" subject
- [ ] T029 [US1] Create backend/src/mcp_client/client.py with MCP Client class to invoke MCP Server tools via stdio transport
- [ ] T030 [US1] Implement MCP Client connection initialization and tool invocation methods (invoke_tool, list_tools)
- [ ] T031 [US1] Create backend/src/services/agent_service.py with invoke_agent method accepting user_id, conversation_id, user_message
- [ ] T032 [US1] Implement stateless agent invocation pattern in agent_service.py: load conversation history from DB, invoke OpenAI with tools, persist response
- [ ] T033 [US1] Configure OpenAI Agent with GPT-4o model, system instructions for task management assistant, and MCP tools as OpenAI functions
- [ ] T034 [US1] Implement streaming response generator in agent_service.py using async generator pattern for OpenAI stream chunks
- [ ] T035 [US1] Add tool call handling in agent_service.py: detect OpenAI tool calls, invoke MCP Client, continue conversation with tool results
- [ ] T036 [US1] Create backend/src/api/conversations.py router with POST, GET (list), GET (by ID), PUT, DELETE endpoints for /api/{user_id}/conversations
- [ ] T037 [US1] Implement conversation CRUD endpoint handlers calling conversation_service methods with JWT authentication and user_id validation
- [ ] T038 [US1] Create backend/src/api/messages.py router with POST endpoint for /api/{user_id}/conversations/{conversation_id}/messages
- [ ] T039 [US1] Implement message streaming endpoint using FastAPI StreamingResponse, invoke agent_service.invoke_agent, yield SSE format chunks
- [ ] T040 [US1] Add SSE headers to streaming response (Cache-Control: no-cache, Connection: keep-alive, X-Accel-Buffering: no)
- [ ] T041 [US1] Register conversation and messages routers in backend/src/main.py with /api prefix
- [ ] T042 [US1] Create frontend/src/types/conversation.ts with Conversation type definition matching backend schema
- [ ] T043 [US1] Create frontend/src/types/message.ts with Message type definition matching backend schema (id, conversation_id, role, content, created_at)
- [ ] T044 [US1] Create frontend/src/services/conversation.ts API client with methods: create, list, getById, update, delete (using fetch with JWT token)
- [ ] T045 [US1] Create frontend/src/services/message.ts API client with sendMessage method using EventSource for SSE streaming
- [ ] T046 [US1] Create frontend/src/hooks/useConversation.tsx custom hook for conversation state management (list, create, select, delete)
- [ ] T047 [US1] Create frontend/src/hooks/useMessages.tsx custom hook for message state management (messages array, sendMessage with streaming)
- [ ] T048 [US1] Create frontend/src/components/chat/ChatInterface.tsx wrapper component integrating OpenAI ChatKit with custom hooks
- [ ] T049 [US1] Implement ChatKit message rendering, input handling, and streaming indicator in ChatInterface.tsx
- [ ] T050 [US1] Create frontend/src/components/chat/MessageBubble.tsx custom message display component with user/assistant styling
- [ ] T051 [US1] Create frontend/src/components/chat/StreamingIndicator.tsx component showing typing animation during AI response
- [ ] T052 [US1] Create frontend/src/app/chat/page.tsx main chat page component rendering ChatInterface with conversation management
- [ ] T053 [US1] Add chat page navigation link to frontend/src/app/layout.tsx or dashboard menu
- [ ] T054 [US1] Implement error handling in ChatInterface for network failures, API errors, streaming interruptions with user-friendly messages
- [ ] T055 [US1] Add input sanitization in agent_service.py to prevent prompt injection attacks (remove system prompt injections, limit length)
- [ ] T056 [US1] Implement rate limiting on messages endpoint using slowapi: 20 messages per minute per user
- [ ] T057 [US1] Test end-to-end flow: create conversation, send "create a task", verify task created via dashboard, verify AI confirmation

**Checkpoint**: At this point, User Story 1 should be fully functional - users can manage tasks conversationally

---

## Phase 4: User Story 2 - Conversation History and Context (Priority: P2)

**Goal**: Enable conversation persistence and multi-turn context understanding

**Independent Test**: Have conversation, navigate away, return, verify history displayed and AI remembers context

### Implementation for User Story 2

- [ ] T058 [P] [US2] Create frontend/src/components/chat/ConversationList.tsx component listing user's conversations with titles and timestamps
- [ ] T059 [US2] Implement conversation selection in ConversationList: onClick navigates to /chat/[conversationId] route
- [ ] T060 [US2] Create frontend/src/app/chat/[conversationId]/page.tsx dynamic route for specific conversation view
- [ ] T061 [US2] Implement conversation history loading in [conversationId]/page.tsx: fetch messages on mount, display in chronological order
- [ ] T062 [US2] Add "New Conversation" button in ConversationList that creates empty conversation and navigates to it
- [ ] T063 [US2] Implement conversation auto-titling in backend/src/services/conversation_service.py: use first 50 chars of first user message if title not provided
- [ ] T064 [US2] Add conversation title update functionality: PUT endpoint calls conversation_service.update with new title
- [ ] T065 [US2] Implement conversation deletion with cascade in conversation_service.py: delete conversation triggers message deletion via foreign key
- [ ] T066 [US2] Add conversation list sidebar to chat page showing all user conversations sorted by updated_at DESC
- [ ] T067 [US2] Implement conversation switching: selecting conversation loads its messages and updates URL
- [ ] T068 [US2] Add message pagination in message_service.py: get_by_conversation accepts limit and offset parameters (default limit=50)
- [ ] T069 [US2] Implement "Load More" button in ChatInterface for conversations with >50 messages
- [ ] T070 [US2] Test multi-conversation flow: create 3 conversations, switch between them, verify independent histories
- [ ] T071 [US2] Test context persistence: mention task in conversation, navigate away, return, reference "that task", verify AI understands

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can manage conversations and maintain context

---

## Phase 5: User Story 3 - Intelligent Task Suggestions and Insights (Priority: P3)

**Goal**: Provide AI-driven task analysis, prioritization suggestions, and insights

**Independent Test**: Create tasks with various dates, ask "what should I focus on today?", verify AI provides intelligent prioritization

### Implementation for User Story 3

- [ ] T072 [P] [US3] Enhance agent system instructions in agent_service.py to include task analysis and prioritization guidance
- [ ] T073 [US3] Add "analyze tasks" context to OpenAI Agent: include user task statistics (total, completed, incomplete counts) in system message
- [ ] T074 [US3] Implement task priority detection in agent_service.py: parse task descriptions for date mentions, urgency keywords
- [ ] T075 [US3] Add smart suggestions to AI responses: when listing tasks, include priority ranking based on detected dates and patterns
- [ ] T076 [US3] Implement task similarity detection: when creating task, agent checks for similar existing tasks via list_tasks and suggests duplicates
- [ ] T077 [US3] Add progress summary generation: agent can calculate completion rate, identify overdue tasks from descriptions
- [ ] T078 [US3] Test intelligent suggestions: create tasks "buy milk by tomorrow", "report due Friday", "groceries", ask "what's urgent?", verify AI prioritizes tomorrow task
- [ ] T079 [US3] Test duplicate detection: create "write report", then create "write the report", verify AI suggests potential duplicate
- [ ] T080 [US3] Test progress insights: complete 5 tasks, ask "how am I doing?", verify AI provides completion statistics

**Checkpoint**: All user stories should now be independently functional - full chatbot with task management, history, and intelligent insights

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T081 [P] Add comprehensive error handling in all API endpoints: catch database errors, OpenAI API errors, MCP Server errors, return standardized error envelopes
- [ ] T082 [P] Implement exponential backoff for OpenAI API rate limit errors in agent_service.py (3 retries, base delay 1s)
- [ ] T083 [P] Add logging throughout backend: conversation creation, message sending, agent invocations, tool calls, errors
- [ ] T084 [P] Add loading states in ChatInterface: show skeleton UI while conversation history loads
- [ ] T085 [P] Implement optimistic UI updates in frontend: user messages appear immediately, update after server confirmation
- [ ] T086 [P] Add conversation search functionality: filter conversations by title or content
- [ ] T087 [P] Implement message retry mechanism: if streaming fails, allow user to retry sending message
- [ ] T088 [P] Add conversation export feature: download conversation as text or JSON
- [ ] T089 [P] Optimize conversation queries: add database indexes verification, query performance testing
- [ ] T090 [P] Add OpenAPI documentation annotations to all endpoints in conversations.py and messages.py
- [ ] T091 [P] Create backend/README.md documenting MCP Server setup, agent configuration, environment variables
- [ ] T092 [P] Create frontend/README.md documenting ChatKit integration, conversation hooks usage
- [ ] T093 [P] Create mcp-server/README.md documenting tool definitions, stateless requirements, testing instructions
- [ ] T094 Implement conversation context summarization in agent_service.py for conversations >100 messages: summarize older messages, keep recent 50
- [ ] T095 Add metrics collection: track conversation count, message count, average response time, tool invocation frequency
- [ ] T096 Implement graceful degradation: if MCP Server down, show "task operations unavailable" message, allow conversation to continue
- [ ] T097 Add security audit: verify all endpoints validate JWT, all queries filter by user_id, no SQL injection vulnerabilities
- [ ] T098 Run quickstart.md validation: follow all 10 steps, verify each checkpoint passes
- [ ] T099 Performance testing: measure message persistence latency (target <500ms p95), conversation loading (target <2s for 100 messages)
- [ ] T100 Security testing: attempt cross-user data access, prompt injection, invalid JWT, verify all blocked

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start immediately after Foundational
  - User Story 2 (P2) can start immediately after Foundational (independent of US1)
  - User Story 3 (P3) can start immediately after Foundational (independent of US1, US2)
  - OR execute sequentially: P1 → P2 → P3 if single developer
- **Polish (Phase 6)**: Depends on desired user stories being complete (typically after US1 for MVP)

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No dependencies on other stories ✅ Independent MVP
- **User Story 2 (P2)**: Depends on Foundational (Phase 2) - Builds on US1 conversation infrastructure but independently testable
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) - Uses US1 agent service but independently testable

### Within Each User Story

- MCP tools can be created in parallel (T021-T025)
- Tool registration (T026) depends on all tools created
- Frontend components can be created in parallel after types/services (T048-T051)
- Backend services can be developed in parallel with frontend once API contracts defined
- End-to-end testing (T057, T070, etc.) depends on all components of that story

### Parallel Opportunities

- **Setup (Phase 1)**: All tasks T003-T007 can run in parallel (different files)
- **Foundational (Phase 2)**: Tasks T010-T013 (dependency installation) can run in parallel, T014-T018 (models/services) can run in parallel after T008-T009 (migration)
- **User Story 1**: Tasks T021-T025 (MCP tools) in parallel, T036-T040 (API endpoints) in parallel, T042-T045 (frontend types/services) in parallel, T048-T051 (UI components) in parallel
- **User Story 2**: Tasks T058-T062 (frontend components) can run in parallel
- **User Story 3**: Tasks T072-T077 (agent enhancements) can run in parallel
- **Polish**: Tasks T081-T093 (documentation, logging, error handling) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch MCP tools in parallel (different files):
- T021: Create create_task.py
- T022: Create list_tasks.py
- T023: Create update_task.py
- T024: Create delete_task.py
- T025: Create toggle_task.py

# Then sequentially:
- T026: Register all tools in server.py

# Launch backend API endpoints in parallel:
- T036: Create conversations.py router
- T038: Create messages.py router

# Launch frontend types in parallel:
- T042: Create conversation.ts types
- T043: Create message.ts types

# Launch frontend services in parallel:
- T044: Create conversation.ts service
- T045: Create message.ts service

# Launch frontend components in parallel:
- T048: Create ChatInterface.tsx
- T050: Create MessageBubble.tsx
- T051: Create StreamingIndicator.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T020) - CRITICAL
3. Complete Phase 3: User Story 1 (T021-T057)
4. **STOP and VALIDATE**: Test US1 independently (T057)
5. Deploy/demo MVP if ready

**MVP Scope**: After completing User Story 1, users can:
- Open chat interface
- Send natural language messages to AI
- Create tasks conversationally ("create a task to...")
- List tasks conversationally ("show me my tasks")
- Update tasks conversationally ("mark X as done")
- Delete tasks conversationally ("delete X")
- Toggle task completion conversationally
- Receive AI confirmations and responses
- **MVP Complete**: Functional conversational task management 🎯

### Incremental Delivery

1. Complete Setup + Foundational (T001-T020) → Foundation ready
2. Add User Story 1 (T021-T057) → Test independently (T057) → Deploy/Demo (MVP!)
3. Add User Story 2 (T058-T071) → Test independently (T070-T071) → Deploy/Demo
4. Add User Story 3 (T072-T080) → Test independently (T078-T080) → Deploy/Demo
5. Add Polish (T081-T100) → Final testing → Production deploy

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With 3 developers:

1. All developers complete Setup + Foundational together (T001-T020)
2. Once Foundational done:
   - **Developer A**: User Story 1 (T021-T057) - MCP tools + Backend agent + Frontend chat
   - **Developer B**: User Story 2 (T058-T071) - Conversation list + History management
   - **Developer C**: User Story 3 (T072-T080) - Intelligent suggestions + Insights
3. Each developer tests their story independently
4. Integration testing after all stories complete
5. Polish phase done collaboratively (T081-T100)

---

## Task Summary

- **Total Tasks**: 100
- **Setup**: 7 tasks
- **Foundational**: 13 tasks (CRITICAL - blocks everything)
- **User Story 1 (P1)**: 37 tasks (MVP - conversational task management)
- **User Story 2 (P2)**: 14 tasks (conversation history and context)
- **User Story 3 (P3)**: 9 tasks (intelligent suggestions and insights)
- **Polish**: 20 tasks (error handling, optimization, documentation)

### Parallel Opportunities

- **Setup**: 5 tasks can run in parallel (T003-T007)
- **Foundational**: 4 tasks can run in parallel (T010-T013), 4 can run in parallel (T014-T017)
- **User Story 1**: 15+ tasks can run in parallel at various stages
- **User Story 2**: 5 tasks can run in parallel (T058-T062)
- **User Story 3**: 6 tasks can run in parallel (T072-T077)
- **Polish**: 13 tasks can run in parallel (T081-T093)

**Total Parallel Opportunities**: ~45 tasks can be parallelized with proper team coordination

### Independent Test Criteria

- **User Story 1**: Create task via chat, verify in dashboard, verify AI confirmation (T057)
- **User Story 2**: Create conversation, navigate away, return, verify history, reference previous task (T070-T071)
- **User Story 3**: Create varied tasks, ask prioritization question, verify intelligent response (T078-T080)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete work
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are NOT required by spec - focus on implementation first, add tests if time permits
- Follow quickstart.md for setup instructions and validation procedures
