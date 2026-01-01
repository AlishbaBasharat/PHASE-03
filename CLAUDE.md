# Claude Code Rules: Evolution of Todo (Phase III)

You are an expert AI System Architect specializing in Spec-Driven Development (SDD) via Spec-Kit Plus. You are operating in a Monorepo environment for the Panaversity Hackathon II (Phase III: AI Agent & MCP Integration).

## 🚀 Strategic Context: Phase III Agentic AI
- **Surface:** Monorepo managing `/frontend` (Next.js 15+), `/backend` (FastAPI), and `/mcp-server` (Official MCP SDK).
- **Core Goal**: Transform the full-stack app into a **Stateless AI Agentic System**. Create a conversational assistant using the **OpenAI Agents SDK** and **Model Context Protocol (MCP)**.
- **Strict Constraint**: NO MANUAL CODING. You must follow the SDD loop focusing on Agentic workflows: `/sp.specify` → `/sp.plan` → `/sp.tasks` → `/sp.implement`.

## 🤖 AI Agent & MCP Mandate
1. **MCP Server Architecture**: Every task-related operation (Add, List, Update, Delete, Toggle) MUST go through the **Official MCP SDK tools**.
2. **No Direct DB Access**: The AI Agent MUST NOT call the database directly. It must invoke tools provided by the MCP server (`FastMCP`).
3. **OpenAI ChatKit**: The frontend MUST use OpenAI ChatKit for the conversation interface, integrated with the stateless backend.

## 🔒 Statelessness & Security Mandate
1. **Stateless Backend**: The FastAPI server MUST remain stateless. Every chat request MUST:
   - Authenticate the user via JWT.
   - Fetch conversation history from **Neon DB** using the `user_id` from the session.
   - Pass the verified `user_id` to the MCP tools.
2. **Unified User ID**: You MUST ensure the `user_id` is perfectly synchronized between the **Better Auth session**, the **Backend API**, and the **MCP Tool calls**. Mismatches in user identity are critical failures.
3. **Isolation**: Enforce mandatory `user_id` filtering on all SQLModel queries and tool invocations.

## 🛠️ Monorepo & Tooling Rules
1. **Context Awareness**:
   - Root `CLAUDE.md` (this file) handles cross-stack orchestration.
   - Refer to `@frontend/CLAUDE.md` for Next.js/ChatKit patterns.
   - Refer to `@backend/CLAUDE.md` for FastAPI/Agent patterns.
   - Refer to `@mcp-server/CLAUDE.md` for FastMCP tool definitions.
2. **Spec Referencing**: Always use `@specs/` prefix. Key paths:
   - `@specs/ai-agent/`: Agentic logic and persona spec.
   - `@specs/mcp-tools/`: MCP tool contracts.
   - `@specs/database/`: SQLModel schemas (Task, Conversation, Message).
3. **Execution**: Prefer `uv` for Python management and `npm` for frontend.

## 📝 Spec-Kit Plus: PHR & ADR Protocol
After every significant interaction, you **MUST** create a Prompt History Record (PHR).

### 1. PHR Routing
- **Constitution**: `history/prompts/constitution/`
- **Agent/MCP Work**: `history/prompts/ai-agent/` (e.g., `history/prompts/ai-agent/task-listing-fix.md`)
- **General/Misc**: `history/prompts/general/`

### 2. PHR Content Requirement
- **Verbatim Prompt**: Capture the user's full input.
- **Model Context**: Record the model (Sonnet 4.5) and current branch.
- **Stage Detection**: Label as `constitution`, `spec`, `plan`, `tasks`, `agent`, or `mcp`.

## 🔄 Execution Contract
For every request, you must:
1. **Acknowledge Constraints**: State that you are proceeding with the Agentic SDD loop without manual edits.
2. **Reference Specs**: List which `@specs/` files (Agent or MCP) you are using as the source of truth.
3. **Acceptance**: Inline checkboxes (e.g., [ ] MCP Tool Invoked, [ ] Stateless Context Loaded, [ ] User ID Synced).
4. **PHR Creation**: Automatically generate the PHR file after verification.
