---
id: 1
title: Create Backend Core Spec
stage: spec
date: 2025-12-18
surface: agent
model: Claude Sonnet 4.5
feature: backend-core
branch: 1-backend-core
user: Mubeen
command: /sp.specify
labels: [backend, api, specification, todo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/api/backend-core.md
 - specs/api/checklists/requirements.md
tests:
 - none
---

## Prompt

"Create a comprehensive Technical Specification for the Phase II Backend in /specs/api/backend-core.md.

This spec must strictly align with our Constitution v2.0.0 and cover:

1. CORE OBJECTIVE:
- Build a Python FastAPI service using SQLModel that handles multi-user Todo management.2. AUTHENTICATION & SECURITY (The JWT Bridge):
- Define the implementation of the JWT Verification Middleware.
- Specify how the BETTER_AUTH_SECRET will be used to validate tokens from the frontend.
- Detail the process of extracting the 'user_id' from the JWT sub/claims.3. DATA CONTRACTS (CRUD + Isolation):
- Specify all endpoints under the /api/{user_id}/ prefix as per the Constitution.
- Define strict Pydantic schemas for:
    - TaskRead (id, title, description, completed, user_id)
    - TaskCreate (title, description)
    - TaskUpdate (title, description, completed)
- MANDATE: Every endpoint must return a standardized JSON response format (data + meta).4. DATABASE SCHEMA (SQLModel):
- Define the 'Task' table structure including user_id as a foreign key and mandatory index.
- Enforce the 'User Isolation' logic at the specification level: every query must include a WHERE clause for user_id.

5. ERROR TAXONOMY:
- Define specific error responses for 401 (Unauthorized), 403 (Forbidden/Cross-user access), and 404 (Task not found).6. ACCEPTANCE CRITERIA:
- The backend must reject any request without a valid Bearer token.
- A user must be unable to view, edit, or delete a task belonging to another user_id.
- All database operations must use async sessions."

## Response snapshot

Created comprehensive Technical Specification for Phase II Backend in specs/api/backend-core.md. The specification includes:

1. User Scenarios & Testing with 3 prioritized user stories covering multi-user todo management, secure authentication, and error handling
2. Functional Requirements (FR-001 to FR-013) covering JWT verification, user isolation, API endpoints, data contracts, database schema, and error handling
3. Key Entities defining the Task entity with user isolation
4. Success Criteria with 6 measurable outcomes
5. Edge cases identified for various error conditions

Quality checklist created at specs/api/checklists/requirements.md confirming all validation items passed.

## Outcome

- ✅ Impact: Comprehensive backend API specification created aligned with Constitution v2.0.0
- 🧪 Tests: none
- 📁 Files: Created specs/api/backend-core.md and specs/api/checklists/requirements.md
- 🔁 Next prompts: Proceed to /sp.clarify for clarification or /sp.plan for implementation planning
- 🧠 Reflection: Specification covers all requested technical requirements with clear user value focus

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Proceed with planning phase using the specification