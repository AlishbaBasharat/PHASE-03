---
id: 1
title: Establish Project Constitution
stage: constitution
date: 2025-12-18
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: Mubeen
command: /sp.constitution
labels: [constitution, sdd, architecture]
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

Act as a Lead System Architect to establish a strict Project Constitution for Phase II: Full-Stack Web Evolution.

1. NON-NEGOTIABLE DEVELOPMENT PARADIGM:
- STRICT Spec-Driven Development (SDD): Zero manual code edits. All logic must be updated via specs in /specs/ first.
- Methodology: /sp.specify (What/Why) → /sp.plan (How/Blueprint) → /sp.tasks (Atomic Units) → /sp.implement (Execution).

2. MONOREPO ARCHITECTURE:
- Folder Structure:
  - /frontend (Next.js 16+ App Router, TS, Tailwind)
  - /backend (FastAPI, Python 3.13+, SQLModel)
  - /specs (Organized: /features, /api, /database, /ui)
  - /.spec-kit/ (Config and templates)
- Instruction Context: Layered CLAUDE.md files in Root, Frontend, and Backend folders to maintain localized coding patterns.

3. TECH STACK & PERSISTENCE:
- Backend ORM: SQLModel for all schema definitions and queries.
- Database: Neon Serverless PostgreSQL (Production-grade).
- Deployment: Dockerized environment using root docker-compose.yml for local orchestration.

4. SECUR5. API DESIGN & DATA CONTRACTS:
- All endpoints must be prefixed with /api/{user_id}/.
- Required Operations: CRUD (GET, POST, GET {id}, PUT, DELETE) and PATCH for completion status.
- Return Types: Standardized JSON responses using Pydantic schemas.

6. OPTIONAL & ENHANCED REQUIREMENTS:
- User Interface: Must be responsive and accessible.
- Authentication UI: Complete Signup/Signin flows using Better Auth components/client.
- Error Handling: Global exception handlers in FastAPI (HTTP 401 for Auth, 404 for missing tasks).
- Documentation: Auto-generate OpenAPI docs via FastAPI (/docs).

## Response snapshot

The project constitution has been successfully created with 6 core principles:

1. I. Spec-Driven Development (SDD) - All development must follow SDD methodology with no manual code edits without spec updates
2. II. Monorepo Architecture - Project structure with frontend/backend/specs organization
3. III. Tech Stack & Persistence Standards - SQLModel ORM, Neon PostgreSQL, Docker deployment
4. IV. Security-First Approach - Authentication, user data isolation, secure session management
5. V. API Design & Data Contracts - Endpoints with /api/{user_id}/ prefix, CRUD operations, Pydantic schemas
6. VI. Enhanced Requirements & Quality - Responsive UI, auth flows, error handling

The constitution also includes Security Requirements, Development Workflow, and Governance sections. The file is saved to .specify/memory/constitution.md with version 1.0.0, ratified on 2025-12-18.

## Outcome

- ✅ Impact: Established foundational project constitution with 6 core principles and governance structure
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with complete constitution
- 🔁 Next prompts: Follow SDD methodology: /sp.specify → /sp.plan → /sp.tasks → /sp.implement
- 🧠 Reflection: Constitution enforces Spec-Driven Development methodology as the primary development paradigm

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Begin feature specification following SDD methodology