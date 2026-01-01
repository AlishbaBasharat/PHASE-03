---
description: "Task list for Backend Core API implementation"
---

# Tasks: backend-core

**Input**: Design documents from `/specs/api/backend-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Sprint 1: Infrastructure (Environment, DB Connection, Models)

**Goal**: Set up the foundational infrastructure for the backend

### Tests for Sprint 1 (OPTIONAL)
- [ ] T001 [P] Write tests for database connection in tests/unit/test_database.py
- [ ] T002 [P] Write tests for Task model in tests/unit/test_models.py

### Implementation for Sprint 1
- [X] T003 Create project structure in backend/ with src/, tests/, requirements.txt, Dockerfile, docker-compose.yml
- [X] T004 [P] Setup requirements.txt with FastAPI, SQLModel, python-jose, pydantic, uvicorn, psycopg2-binary dependencies
- [X] T005 Create Task model in backend/src/models.py with id, title, description, completed, user_id, created_at, updated_at fields (following data-model.md)
- [X] T006 Create database connection setup in backend/src/database.py with async engine and get_session generator
- [X] T007 Create Pydantic schemas (TaskRead, TaskCreate, TaskUpdate) in backend/src/models.py

**Checkpoint**: Infrastructure ready - database connection and models are functional

---

## Sprint 2: Security (JWT Middleware, Auth dependency)

**Goal**: Implement JWT authentication and authorization middleware

### Tests for Sprint 2 (OPTIONAL)
- [ ] T008 [P] Write tests for JWT verification middleware in tests/unit/test_auth.py
- [ ] T009 [P] Write tests for user_id extraction from JWT in tests/unit/test_auth.py

### Implementation for Sprint 2
- [ ] T010 Create JWT authentication dependency in backend/src/auth.py using HTTPBearer and python-jose
- [ ] T011 Implement JWT token verification logic in backend/src/auth.py using BETTER_AUTH_SECRET
- [ ] T012 Implement user_id extraction from JWT claims in backend/src/auth.py
- [ ] T013 Create global exception handlers in backend/src/main.py for standardized error responses (data/meta format)

**Checkpoint**: Security layer ready - JWT authentication and user_id extraction are functional

---

## Sprint 3: Core CRUD (The 5 basic features with User Isolation)

**Goal**: Implement full CRUD operations for tasks with user isolation

### Tests for Sprint 3 (OPTIONAL)
- [ ] T014 [P] [US1] Write tests for task creation endpoint in tests/integration/test_tasks.py
- [ ] T015 [P] [US1] Write tests for task retrieval endpoint in tests/integration/test_tasks.py
- [ ] T016 [P] [US1] Write tests for task update endpoint in tests/integration/test_tasks.py
- [ ] T017 [P] [US1] Write tests for task deletion endpoint in tests/integration/test_tasks.py
- [ ] T018 [P] [US1] Write tests for user isolation (403 Forbidden) in tests/integration/test_tasks.py

### Implementation for Sprint 3
- [ ] T019 [P] Create CRUD service functions in backend/src/crud.py with user_id filtering for all operations
- [ ] T020 [P] [US1] Create GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [ ] T021 [P] [US1] Create POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [ ] T022 [P] [US1] Create GET /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/routes/tasks.py
- [ ] T023 [P] [US1] Create PUT /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/routes/tasks.py
- [ ] T024 [P] [US1] Create DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/routes/tasks.py
- [ ] T025 [US1] Ensure all CRUD operations enforce user isolation by checking user_id matches authenticated user
- [ ] T026 [US1] Add proper response formatting with data/meta structure to all endpoints

**Checkpoint**: At this point, User Story 1 (Multi-User Todo Management) should be fully functional with user isolation

---

## Sprint 4: Integration & Validation (Refining standardized JSON responses)

**Goal**: Validate and refine standardized JSON responses and error handling

### Tests for Sprint 4 (OPTIONAL)
- [ ] T027 [P] [US2] Write tests for 401 Unauthorized responses in tests/integration/test_auth.py
- [ ] T028 [P] [US3] Write tests for 403 Forbidden responses in tests/integration/test_auth.py
- [ ] T029 [P] [US3] Write tests for 404 Not Found responses in tests/integration/test_tasks.py

### Implementation for Sprint 4
- [ ] T030 [P] [US2] Implement proper 401 Unauthorized responses for invalid/missing JWT tokens
- [ ] T031 [P] [US2] Implement proper 403 Forbidden responses for cross-user access attempts
- [ ] T032 [P] [US3] Implement proper 404 Not Found responses for non-existent resources
- [ ] T033 [P] [US3] Refine all API responses to follow standardized JSON format (data/meta)
- [ ] T034 Create seed.py script to populate Neon DB for testing in backend/seed.py
- [ ] T035 Integrate all routes with main FastAPI app in backend/src/main.py

**Checkpoint**: All user stories complete with proper error handling and standardized responses

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Add documentation to all endpoints in backend/src/api/routes/tasks.py
- [ ] T037 [P] Add input validation to all endpoints based on data-model.md requirements
- [ ] T038 [P] Add database indexes as specified in data-model.md (user_id, completed, composite)
- [ ] T039 Add logging for all operations in backend/src/main.py
- [ ] T040 Run quickstart.md validation to ensure all functionality works as expected

---

## Dependencies & Execution Order

### Sprint Dependencies
- **Sprint 1** (Infrastructure): No dependencies - can start immediately
- **Sprint 2** (Security): Depends on Sprint 1 completion - models and database setup required
- **Sprint 3** (Core CRUD): Depends on Sprint 1 & 2 completion - needs models, database, and auth
- **Sprint 4** (Integration): Depends on Sprint 3 completion - needs all CRUD operations
- **Polish** (Final Phase): Depends on all sprints being complete

### Within Each Sprint
- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Sprint complete before moving to next

### Parallel Opportunities
- All setup tasks marked [P] can run in parallel within each sprint
- All tests for a sprint marked [P] can run in parallel
- Models and database setup can run in parallel (T005 and T006)
- All CRUD endpoints in Sprint 3 marked [P] can run in parallel
- Different sprints cannot run in parallel as they have dependencies

---

## Implementation Strategy

### MVP First (Sprint 1-3 Only)
1. Complete Sprint 1: Infrastructure
2. Complete Sprint 2: Security
3. Complete Sprint 3: Core CRUD (US1 - Multi-User Todo Management)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery
1. Complete Sprints 1-2 → Foundation ready
2. Add Sprint 3 → Test independently → Deploy/Demo (Core MVP!)
3. Add Sprint 4 → Test independently → Deploy/Demo
4. Each sprint adds value without breaking previous functionality

### Parallel Team Strategy
With multiple developers:
1. Team completes Sprint 1 together
2. Once Sprint 1 is done:
   - Developer A: Sprint 2 (Security)
   - Developer B: Begin Sprint 3 (CRUD) - depends on Sprint 1 & 2
3. Sprint 4 follows after Sprint 3 completion

---

## Definition of Done for Each Task

Each task must satisfy:
- Code matches the Spec: Implementation follows requirements from spec.md
- User Isolation is verified: Test case for 403 Forbidden responses exists
- PHR is created: Prompt History Record created for the implementation step
- Dependencies satisfied: All prerequisite tasks completed
- Tests pass: If tests were written, they pass successfully
- Code follows Constitution: Adheres to architectural patterns and requirements