---
id: 4
title: Phase 3 AI Chatbot Constitution
stage: constitution
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: constitution
branch: main
user: Mubeen
command: /sp.constitution
labels: [phase-3, ai-chatbot, mcp-server, openai-agents, chatkit, constitution]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - null
---

## Prompt

Generate a full specification and implementation plan for Phase 3: Todo AI Chatbot

Context: Phase 2 is complete (FastAPI + Neon DB + Better Auth).

New Architecture:
- Use Official MCP SDK to build a stateless server for task tools.
- Use OpenAI Agents SDK for AI logic.
- Use SQLModel to add Conversation and Message tables for persistence.
- Frontend must use OpenAI ChatKit.

Instructions:
1. Update spec.md with these requirements.
2. Create a detailed plan.md that breaks this down into tasks (Database migration, MCP Server setup, Agent implementation, ChatKit UI).
3. Ensure the server remains stateless

Do not write code yet, just generate the Spec and Plan.

## Response snapshot

Constitution successfully updated from version 2.0.0 to 3.0.0 for Phase 3: AI-Powered Todo Chatbot.

### Key Changes:

**MAJOR VERSION BUMP (2.0.0 → 3.0.0)**: Backward incompatible architectural changes introducing new system layers

**Added Sections:**
- **VIII. AI Chatbot Architecture**: Three-layer stateless architecture (Frontend ChatKit, Backend OpenAI Agents SDK, MCP Server)
- **MCP Server Standards**: Official MCP SDK protocol requirements, tool definitions, stateless mandate
- **OpenAI Agents SDK Integration**: Agent configuration, stateless invocation patterns, tool execution flow
- **Conversation Persistence**: SQLModel schemas for Conversations and Messages tables with user isolation
- **ChatKit Frontend Requirements**: OpenAI ChatKit integration patterns and UI requirements
- **Stateless Server Mandate**: Critical requirements ensuring no in-memory state in MCP Server or Agent

**Modified Sections:**
- **II. Monorepo Architecture**: Added /mcp-server layer with dedicated CLAUDE.md
- **III. Tech Stack & Persistence Standards**: Added OpenAI Agents SDK, MCP SDK, and ChatKit
- **V. API Design & Data Contracts**: Added conversation endpoints (/api/{user_id}/conversations/*)
- **Architectural Layering**: Expanded from three-layer to four-layer architecture
- **Compliance Gates**: Added stateless verification requirement

**Architecture Overview:**

1. **Frontend Layer** - OpenAI ChatKit for React
   - Conversational UI rendering
   - Message input/output handling
   - JWT authentication integration
   - Streaming response support

2. **Backend Layer** - OpenAI Agents SDK + SQLModel
   - Conversation orchestration via OpenAI Agents SDK
   - Stateless agent invocation (loads history from DB each time)
   - MCP Client integration for task tools
   - Conversation/Message persistence to Neon DB

3. **MCP Server Layer** - Official MCP SDK
   - Stateless task operation tools (create, list, update, delete, toggle)
   - Explicit user_id parameters on all tools
   - No conversation state, no session storage
   - Communication with Backend database layer

**Data Flow:**
1. User message → ChatKit UI → Frontend
2. Frontend → Backend API (with JWT)
3. Backend → Load conversation history from DB
4. Backend → Invoke OpenAI Agent with context
5. Agent → Call MCP task tools as needed
6. Backend → Persist agent response to DB
7. Backend → Stream response to ChatKit UI

**Critical Requirements:**
- MCP Server MUST be completely stateless
- Backend Agent MUST load conversation history from DB before each invocation
- All conversations and messages MUST be persisted to Neon DB
- User isolation MUST be enforced on all conversation/message queries
- ChatKit MUST be used for frontend conversational UI

## Outcome

- ✅ Impact: Constitution updated to version 3.0.0 with comprehensive Phase 3 AI Chatbot architecture requirements
- 🧪 Tests: Templates validated for consistency with new constitution principles
- 📁 Files: `.specify/memory/constitution.md` updated with new sections and modified principles
- 🔁 Next prompts: Run `/sp.specify` to create feature specification, then `/sp.plan` to generate implementation plan
- 🧠 Reflection: The constitution now provides clear, prescriptive guidance for implementing a stateless AI chatbot with proper separation of concerns across Frontend (ChatKit), Backend (OpenAI Agents SDK), and MCP Server (Official MCP SDK). The stateless mandate is critical to ensure scalability and proper persistence.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution update completed successfully
- Graders run and results (PASS/FAIL): PASS - All sections properly documented with code examples and clear requirements
- Prompt variant (if applicable): N/A - First iteration
- Next experiment (smallest change to try): Proceed with `/sp.specify` to create the feature specification based on the new constitution
