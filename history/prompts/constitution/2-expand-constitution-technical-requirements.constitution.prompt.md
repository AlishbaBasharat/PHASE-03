---
id: 2
title: Expand Constitution Technical Requirements
stage: constitution
date: 2025-12-18
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: Mubeen
command: /sp.clarify
labels: [constitution, security, architecture, monorepo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

The current constitution is too brief and lacks the technical depth required for Phase II. Please expand the Constitution in '.specify/memory/constitution.md' to address the following missing technical requirements:

1. MONOREPO ORCHESTRATION: Explicitly define how the root 'CLAUDE.md' interacts with '@frontend/CLAUDE.md' and '@backend/CLAUDE.md'.
2. THE JWT HANDSHAKE: Detail the exact protocol for the 'Better Auth JWT Plugin'. Specify that the Frontend MUST extract the token and the Backend MUST verify it using a shared secret.
3. PHR (Prompt History Record) ARCHITECTURE: Define the strict directory routing for history files:
   - history/prompts/constitution/
   - history/prompts/<feature-name>/
   - history/prompts/general/
4. DATA ISOLATION LAW: Add a section stating that any SQLModel query missing a '.where(Task.user_id == authenticated_user_id)' is a critical security failure.
5. CLEAN ARCHITECTURE: Specify that the Backend must use a 'Service Pattern' (crud.py) to separate API routes from Database logi

## Response snapshot

The constitution has been successfully expanded with several new technical requirements:

1. MONOREPO ORCHESTRATION: Enhanced the Monorepo Architecture section to detail how root 'CLAUDE.md' coordinates with frontend/backend CLAUDE.md files
2. THE JWT HANDSHAKE: Added specific protocol details in Security-First Approach section about token extraction and verification
3. PHR ARCHITECTURE: Added dedicated section defining directory routing for history files
4. DATA ISOLATION LAW: Added specific security rule about SQLModel query user_id filtering
5. CLEAN ARCHITECTURE: Added requirement for Service Pattern to separate API routes from database logic
6. DRIZZLE CLARIFICATION: Added clarification that Drizzle is only for frontend/TypeScript layers

Version updated from 1.0.0 to 1.1.0 with comprehensive technical depth for Phase II requirements.

## Outcome

- ✅ Impact: Enhanced constitution with critical technical depth for Phase II implementation
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with expanded technical requirements
- 🔁 Next prompts: Continue with feature specification following enhanced constitution
- 🧠 Reflection: Constitution now provides detailed technical guidance for security, architecture, and workflow

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Begin feature specification with enhanced technical requirements