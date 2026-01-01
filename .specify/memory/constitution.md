# Phase III: AI-Powered Todo Chatbot Constitution
<!-- SYNC IMPACT REPORT
Version change: 2.0.0 → 3.0.0
Added sections: VIII. AI Chatbot Architecture, MCP Server Standards, OpenAI Agents SDK Integration, Conversation Persistence, ChatKit Frontend Requirements, Stateless Server Mandate
Modified sections: II. Monorepo Architecture (added /mcp-server layer), III. Tech Stack & Persistence Standards (added OpenAI Agents SDK, MCP SDK), V. API Design & Data Contracts (added conversation endpoints)
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ reviewed
  - .specify/templates/spec-template.md ✅ reviewed
  - .specify/templates/tasks-template.md ✅ reviewed
  - .claude/commands/sp.constitution.md ✅ reviewed
Follow-up TODOs: None
-->

## Core Principles

### I. Spec-Driven Development (SDD)
All development must follow Spec-Driven Development methodology; No manual code edits allowed without corresponding spec updates in /specs/ first; Strict workflow: /sp.specify → /sp.plan → /sp.tasks → /sp.implement

### II. Monorepo Architecture
Project structure follows monorepo pattern with /frontend (Next.js 16+, TS, Tailwind, OpenAI ChatKit), /backend (FastAPI, Python 3.13+, SQLModel), /mcp-server (Official MCP SDK for stateless task tools), /specs organized by features/api/database/ui; Layered CLAUDE.md files for localized coding patterns. The root 'CLAUDE.md' provides project-wide instructions and coordinates with '@frontend/CLAUDE.md', '@backend/CLAUDE.md', and '@mcp-server/CLAUDE.md' which contain technology-specific guidelines. Each CLAUDE.md file operates at its respective layer: root for overall project orchestration, frontend for client-side patterns, backend for server-side architecture, and mcp-server for tool definitions.

### III. Tech Stack & Persistence Standards
Backend ORM: SQLModel for all schema definitions and queries; Database: Neon Serverless PostgreSQL for production-grade persistence; AI Layer: OpenAI Agents SDK for AI logic and conversation management; Tool Integration: Official MCP SDK for stateless task operation tools; Frontend Chat: OpenAI ChatKit for conversational UI; Deployment: Dockerized environment using docker-compose.yml for local orchestration

### IV. Security-First Approach
All endpoints must implement proper authentication and authorization; User data isolation required (endpoints prefixed with /api/{user_id}/); Secure session management using Better Auth; Input validation and sanitization mandatory. THE JWT HANDSHAKE: The Better Auth JWT Plugin protocol requires that the Frontend MUST extract the JWT token from the authentication response and include it in the 'Authorization: Bearer {token}' header for all authenticated requests. The Backend MUST verify the JWT token using a shared secret environment variable (AUTH_SECRET) and reject any requests with invalid or missing tokens.

DETAILED JWT PROTOCOL:
- JWT Header Format: 'Authorization: Bearer <jwt_token>'
- Token Refresh Strategy: Implement automatic token refresh 5 minutes before expiration using refresh tokens
- Error Handling:
  - '401 Unauthorized': Invalid or expired token, requires re-authentication
  - '403 Forbidden': Valid token but insufficient permissions or data isolation breach
- Backend middleware MUST validate token signature, expiration, and user permissions before processing requests

### V. API Design & Data Contracts
All endpoints must be prefixed with /api/{user_id}/; Required operations: CRUD (GET, POST, GET {id}, PUT, DELETE) and PATCH for completion status; Return standardized JSON responses using Pydantic schemas; Auto-generated OpenAPI docs via FastAPI

STANDARDIZED API ENVELOPES: ALL API responses MUST follow these exact JSON structures:

Success Response Format:
```
{
  "status": "success",
  "data": {},
  "meta": {
    "timestamp": "ISO_8601_timestamp",
    "request_id": "unique_request_identifier"
  }
}
```

Error Response Format:
```
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "human_readable_error_message",
    "details": []
  },
  "meta": {
    "timestamp": "ISO_8601_timestamp",
    "request_id": "unique_request_identifier"
  }
}
```

### VI. Enhanced Requirements & Quality
User interface must be responsive and accessible; Complete authentication UI with Signup/Signin flows using Better Auth components/client; Global exception handlers in FastAPI (HTTP 401 for Auth, 404 for missing tasks); Error handling with graceful degradation

### VII. AI Chatbot Requirements
Chat interface must be built using OpenAI ChatKit for React; Conversational AI powered by OpenAI Agents SDK; Task operations exposed via MCP Server using Official MCP SDK; All conversations and messages must be persisted in Neon DB using SQLModel; User isolation applies to all conversations and messages

### VIII. AI Chatbot Architecture

AI_CHATBOT_MANDATE: The AI Chatbot feature MUST follow a three-layer stateless architecture with clear separation of concerns:

**Layer 1: Frontend (ChatKit UI)**
- MUST use OpenAI ChatKit for React to render the conversational interface
- ChatKit handles message rendering, input collection, and streaming responses
- Frontend MUST authenticate via Better Auth and pass JWT tokens to backend
- Frontend MUST NOT contain any AI logic or direct tool execution

**Layer 2: Backend (OpenAI Agents SDK)**
- MUST use OpenAI Agents SDK for AI conversation orchestration
- Backend receives chat requests from ChatKit, invokes OpenAI Agents SDK
- OpenAI Agent MUST be stateless - it does NOT maintain conversation history in memory
- Agent MUST retrieve conversation history from Neon DB via SQLModel before processing
- Agent MUST persist new messages to Neon DB via SQLModel after processing
- Agent MUST use MCP Client to invoke task tools from MCP Server
- Backend MUST enforce user_id isolation on all conversation queries

**Layer 3: MCP Server (Task Tools)**
- MUST be built using Official MCP SDK (https://modelcontextprotocol.io)
- MCP Server MUST expose task operations as stateless tools:
  - create_task(title, description, user_id)
  - list_tasks(user_id, status_filter)
  - update_task(task_id, user_id, updates)
  - delete_task(task_id, user_id)
  - toggle_task_completion(task_id, user_id)
- MCP Server MUST be stateless - it does NOT store conversation state
- Each tool MUST accept user_id as a parameter and enforce isolation
- MCP Server MUST communicate with Backend's database layer (FastAPI endpoints or direct DB access via shared connection)

**STATELESS SERVER MANDATE**:
The MCP Server MUST be completely stateless. It MUST NOT:
- Store conversation history or context
- Maintain user sessions
- Cache task data
- Keep any in-memory state between tool invocations

The Backend MUST be stateless regarding conversation context. It MUST:
- Retrieve full conversation history from DB before each agent invocation
- Persist all new messages to DB after each agent response
- Never rely on in-memory conversation buffers
- Treat each agent invocation as independent (context loaded from DB)

**DATA FLOW**:
1. User sends message via ChatKit UI → Frontend
2. Frontend sends message + JWT to Backend API
3. Backend validates JWT, extracts user_id
4. Backend loads conversation history from Conversations & Messages tables (SQLModel)
5. Backend invokes OpenAI Agent with conversation context
6. OpenAI Agent uses MCP Client to call task tools from MCP Server
7. MCP Server executes task operations (isolated by user_id)
8. Backend persists agent response to Messages table
9. Backend streams response back to ChatKit UI

## MCP Server Standards

MCP_SERVER_PROTOCOL: The MCP Server implementation MUST adhere to the Official MCP SDK specification:

**Tool Definition Structure**:
```python
from mcp import Tool

@Tool.define(
    name="create_task",
    description="Creates a new task for the authenticated user",
    parameters={
        "title": {"type": "string", "description": "Task title"},
        "description": {"type": "string", "description": "Task description"},
        "user_id": {"type": "string", "format": "uuid", "description": "User identifier"}
    }
)
async def create_task(title: str, description: str, user_id: str) -> dict:
    # Stateless implementation - no session storage
    pass
```

**MCP Server Requirements**:
- MUST use Official MCP SDK from npm (@modelcontextprotocol/sdk) or Python (mcp)
- MUST define all task tools with explicit user_id parameters
- MUST return structured JSON responses matching API envelope standards
- MUST handle errors gracefully with proper MCP error responses
- MUST NOT maintain any state between tool invocations
- MUST validate user_id on every tool call (no session assumptions)

**MCP Client Integration (Backend)**:
- Backend MUST use MCP Client from Official SDK
- Backend MUST connect to MCP Server via standard MCP transport (stdio, HTTP, or SSE)
- Backend MUST pass authenticated user_id to all tool invocations
- Backend MUST handle MCP tool errors and map to API error envelopes

## OpenAI Agents SDK Integration

OPENAI_AGENTS_INTEGRATION: The Backend MUST use OpenAI Agents SDK for conversation orchestration:

**Agent Configuration**:
```python
from openai import OpenAI
from openai.agents import Agent

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

agent = Agent(
    name="TodoAssistant",
    instructions="You are a helpful assistant for managing todo tasks...",
    tools=[
        # MCP tools registered via MCP Client
    ],
    model="gpt-4o"  # or latest recommended model
)
```

**Stateless Agent Invocation Pattern**:
```python
# CORRECT: Load history from DB first
async def invoke_agent(user_id: str, user_message: str):
    # Step 1: Load conversation from DB
    conversation = await get_conversation_history(user_id)

    # Step 2: Prepare messages array (including history)
    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in conversation.messages
    ]
    messages.append({"role": "user", "content": user_message})

    # Step 3: Invoke agent (stateless - no memory)
    response = await agent.run(messages=messages)

    # Step 4: Persist new message to DB
    await save_message(user_id, "assistant", response.content)

    return response

# INCORRECT: Never rely on agent memory
# agent.add_message()  # FORBIDDEN - agent must be stateless
```

**Agent Tool Execution**:
- Agent MUST have access to MCP tools via MCP Client
- Agent invokes tools during conversation as needed
- Tools execute in MCP Server (stateless)
- Tool results return to Agent for response generation

## Conversation Persistence

CONVERSATION_PERSISTENCE_SCHEMA: The database MUST include two new tables for conversation management:

**Conversations Table** (SQLModel):
```python
class Conversation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(nullable=False, index=True)  # Isolation
    title: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    messages: list["Message"] = Relationship(back_populates="conversation")
```

**Messages Table** (SQLModel):
```python
class Message(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id", nullable=False)
    user_id: uuid.UUID = Field(nullable=False, index=True)  # Isolation
    role: str = Field(max_length=50, nullable=False)  # "user" or "assistant"
    content: str = Field(nullable=False)  # Message text
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    conversation: Conversation = Relationship(back_populates="messages")
```

**Conversation API Endpoints**:
- POST /api/{user_id}/conversations - Create new conversation
- GET /api/{user_id}/conversations - List user's conversations
- GET /api/{user_id}/conversations/{conversation_id} - Get conversation with messages
- DELETE /api/{user_id}/conversations/{conversation_id} - Delete conversation
- POST /api/{user_id}/conversations/{conversation_id}/messages - Send message to agent

**Isolation Enforcement**:
- ALL conversation queries MUST filter by user_id
- ALL message queries MUST filter by user_id
- Cross-user conversation access is a CRITICAL security violation

## ChatKit Frontend Requirements

CHATKIT_IMPLEMENTATION: The Frontend MUST use OpenAI ChatKit for React to render the conversational interface:

**ChatKit Installation**:
```bash
npm install @openai/chatkit
```

**ChatKit Integration Pattern**:
```typescript
import { ChatKit, Message } from '@openai/chatkit';

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user_id } = useAuth();  // Better Auth user_id

  const handleSendMessage = async (content: string) => {
    // Send to backend
    const response = await fetch(`/api/${user_id}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    const data = await response.json();
    // Update messages state with streaming response
  };

  return (
    <ChatKit
      messages={messages}
      onSendMessage={handleSendMessage}
      // Additional ChatKit configuration
    />
  );
}
```

**ChatKit Requirements**:
- MUST use ChatKit's built-in message rendering components
- MUST support streaming responses from OpenAI Agent
- MUST display user and assistant messages with proper styling
- MUST handle loading states during agent processing
- MUST integrate with Better Auth for JWT token management
- MUST enforce responsive design for mobile and desktop

## Security Requirements

Authentication required for all endpoints; User data isolation by user_id; Session management with secure cookies; Rate limiting to prevent abuse; Input validation and sanitization; SQL injection prevention via ORM; XSS protection with proper headers

## PHR (Prompt History Record) Architecture

All Prompt History Records must follow strict directory routing: history/prompts/constitution/ for constitution-related prompts, history/prompts/<feature-name>/ for feature-specific prompts, and history/prompts/general/ for general prompts. This ensures proper organization and traceability of all development decisions and changes.

PHR SCHEMA & METADATA: Every PHR file MUST include exact YAML frontmatter with these required fields:
```
---
id: <sequential_number>
title: <descriptive_title>
stage: <stage_type>
date: <YYYY-MM-DD>
surface: agent
model: <model_name>
feature: <feature_name_or_none>
branch: <current_branch>
user: <username>
command: <command_used>
labels: [<comma_separated_labels>]
links:
  spec: <url_or_null>
  ticket: <url_or_null>
  adr: <url_or_null>
  pr: <url_or_null>
files:
 - <list_of_modified_files>
tests:
 - <list_of_tests_run_or_none>
---
```

## Data Isolation Law

DATA ISOLATION LAW: Any SQLModel query missing a '.where(TableName.user_id == authenticated_user_id)' filter is a critical security failure. All database queries that access user-specific data MUST include proper user_id filtering to prevent unauthorized data access between users. This applies to SELECT, UPDATE, and DELETE operations on any table containing user-specific information.

USER ISOLATION (THE 'ISOLATION INVARIANT'):
- SQLModel models MUST use a 'UserMixin' class or explicit 'user_id: uuid.UUID' field on every table that stores user-specific data
- The 'user_id' field MUST be globally unique (UUID format) and indexed for performance
- All SQLModel tables containing user-specific data MUST inherit from UserMixin or explicitly declare user_id field
- Foreign key relationships to user_id MUST maintain referential integrity
- Conversations and Messages tables MUST enforce user_id isolation
```
class UserMixin(SQLModel):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, nullable=False, description="Globally unique user identifier")
```

## Clean Architecture & Tech Clarifications

CLEAN ARCHITECTURE: The Backend MUST use a 'Service Pattern' (e.g., crud.py, services/*.py) to separate API routes from Database logic. API endpoints should not contain direct database operations; all database interactions must be encapsulated in service layer functions.

DRIZZLE CLARIFICATION: If Drizzle ORM is used, it is ONLY for the Frontend/TypeScript layers and MUST NOT be used in Python backend code. SQLModel remains the exclusive ORM for Python-based backend services and database operations.

## Architectural Layering

ARCHITECTURAL LAYERING: The application follows a strict four-layer architecture with defined interactions:
- Root Layer: Project orchestration, shared configurations, and cross-cutting concerns
- Frontend Layer: Presentation logic, UI components (including ChatKit), and client-side state management
- Backend Layer: Business logic, OpenAI Agents SDK orchestration, data access, and API services
- MCP Server Layer: Stateless task operation tools exposed via Official MCP SDK

The Backend MUST implement the Controller-Service-Repository pattern:
- Controllers: Handle HTTP requests/responses, input validation, and authentication checks
- Services: Implement business logic, orchestrate OpenAI Agents, and coordinate between repositories
- Repositories: Handle direct database operations and data persistence

The MCP Server MUST implement a pure Tool pattern:
- Tools: Stateless functions that accept user_id and execute task operations
- No services, no repositories, no state - tools are pure functions
- Tools communicate with Backend database layer via shared connection or API calls

## Monorepo CLI Conventions

MONOREPO CLI CONVENTIONS: Package manager usage MUST follow these strict rules:
- Backend folder (/backend): Use 'uv' as the exclusive package manager for Python dependencies
- Frontend folder (/frontend): Use 'pnpm' as the preferred package manager for JavaScript/TypeScript dependencies
- MCP Server folder (/mcp-server): Use 'npm' or 'pnpm' for JavaScript/TypeScript dependencies (if TypeScript) OR 'uv' for Python (if Python)
- Root folder: Use appropriate package manager for root-level operations only
- Forbid mixing package managers within the same project layer (no npm in backend, no uv in frontend)
- All developers MUST use the same package manager per layer to ensure consistency
- Lock files (.lock) MUST be committed to version control for reproducible builds

## Development Workflow

Strict SDD methodology: specs first, then plan, tasks, implementation; Code reviews required for all changes; Automated testing at unit/integration levels; Continuous integration with automated checks; Branch naming conventions following feature/bugfix/hotfix prefixes

## Compliance Gates

COMPLIANCE GATES: A 'Definition of Done' (DoD) MUST be satisfied for every task before completion:
- Spec match: Implementation must fully satisfy the feature specification requirements
- Test coverage: Code coverage MUST exceed 80% for all new/modified code
- PHR created: Prompt History Record MUST be created for all significant changes
- No linting errors: All code must pass linting and formatting checks with no errors
- Security validation: All user data access must follow isolation requirements
- Performance validation: API endpoints must respond within 500ms p95 latency
- Stateless verification: MCP Server and Agent must be verified as stateless (no in-memory state)

## Governance

Constitution supersedes all other practices; Amendments require documentation and approval; All PRs must verify compliance with these principles; Version control with semantic versioning; Regular compliance reviews scheduled quarterly

**Version**: 3.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-31
