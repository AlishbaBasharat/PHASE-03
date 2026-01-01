# Implementation Plan: backend-core

**Branch**: `1-backend-core` | **Date**: 2025-12-18 | **Spec**: [specs/api/backend-core.md](../backend-core.md)
**Input**: Feature specification from `/specs/api/backend-core.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a FastAPI backend service using SQLModel for multi-user Todo management. The system will follow the Controller-Service-Repository pattern with JWT authentication middleware to secure routes and enforce user isolation. The architecture includes separate modules for models, database management, authentication, main application, and CRUD operations with mandatory user_id filtering.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI, SQLModel, python-jose, pydantic, uvicorn, psycopg2-binary (for Neon PostgreSQL)
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest
**Target Platform**: Linux server (Docker container)
**Project Type**: web
**Performance Goals**: <500ms p95 response time, support 1000+ concurrent users
**Constraints**: <200ms p95 for database queries, JWT token validation <50ms
**Scale/Scope**: Multi-user system supporting 10k+ users with isolated data access

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] Spec-Driven Development (SDD): Following spec from `/specs/api/backend-core.md`
- [X] Monorepo Architecture: Backend organized in `/backend/src/` directory
- [X] Tech Stack & Persistence: Using SQLModel ORM with Neon PostgreSQL
- [X] Security-First Approach: JWT authentication with Better Auth secret validation
- [X] API Design & Data Contracts: Endpoints follow `/api/{user_id}/` prefix pattern
- [X] Clean Architecture: Controller-Service-Repository pattern implementation
- [X] Data Isolation Law: All queries must include `.where(Task.user_id == authenticated_user_id)` filter
- [X] User Isolation (ISOLATION INVARIANT): SQLModel models use user_id field with UUID
- [X] Standardized API Envelopes: All responses follow data/meta format
- [X] Architectural Layering: Backend implements Controller-Service-Repository pattern

## Project Structure

### Documentation (this feature)

```text
specs/api/backend-core/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models.py        # SQLModel definitions with user_id foreign key
│   ├── database.py      # Async engine & session management for Neon
│   ├── auth.py          # JWT middleware & security dependencies
│   ├── main.py          # FastAPI app & router inclusion
│   ├── crud.py          # Service layer with enforced user_id filtering
│   └── api/
│       └── routes/
│           └── tasks.py # Task-related endpoints with user isolation
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── seed.py              # Script to populate Neon DB for testing
```

**Structure Decision**: Web application structure with dedicated backend directory following the required module separation: models.py, database.py, auth.py, main.py, and crud.py as specified in requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |