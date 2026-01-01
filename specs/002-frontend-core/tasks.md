# Implementation Tasks: Frontend Core Architecture Alignment

**Feature**: Frontend Core Architecture Alignment
**Branch**: 002-frontend-core
**Generated**: 2025-12-18
**Based on**: specs/002-frontend-core/spec.md, plan.md, data-model.md, contracts/api-contracts.md

## Sprint 1: Setup & Core Infrastructure

### Phase 1: Project Setup
- [x] T001 Initialize the '/frontend' directory using 'pnpm' as the exclusive package manager
- [x] T002 Install Core Dependencies: Next.js 15 (App Router), TypeScript, Tailwind CSS, and Axios for API calls
- [x] T003 Create directory structure: frontend/src/{app,components,services,types,hooks,lib,styles}
- [x] T004 Create frontend/public directory for static assets
- [x] T005 Configure basic Next.js configuration in next.config.js
- [x] T006 Configure Tailwind CSS in tailwind.config.js and globals.css
- [x] T007 Set up TypeScript configuration in tsconfig.json
- [x] T008 Create .env.local for environment variables

### Phase 2: API Infrastructure
- [x] T009 [P] Configure 'frontend/src/lib/api.ts': Create a centralized Axios/Fetch instance
- [x] T010 [P] Implement an 'Interceptor' in api.ts to handle the Constitution-mandated 'Standardized API Envelope' (extracting 'data' from the {status, data, meta} structure)
- [x] T011 [P] Create 'frontend/src/types/api.ts' with TypeScript interfaces for API responses
- [x] T012 [P] Define the 'APIResponse' generic interface following Constitution standards
- [x] T013 [P] Create basic unit tests for the API client to ensure envelope processing works

### Phase 3: Authentication Infrastructure
- [x] T014 [P] Create 'frontend/src/services/auth.ts' for authentication service
- [x] T015 [P] Set up Better Auth integration with JWT plugin in the frontend
- [x] T016 [P] Create 'frontend/src/hooks/useAuth.ts' for authentication state management
- [x] T017 [P] Create 'frontend/src/types/auth.ts' with authentication-related TypeScript interfaces

### Phase 4: Task Infrastructure
- [x] T018 [P] Create 'frontend/src/types/tasks.ts' with Task interface ensuring 'user_id' is a UUID string
- [x] T019 [P] Create 'frontend/src/services/tasks.ts' for task-specific API functions
- [x] T020 [P] Create 'frontend/src/hooks/useTasks.ts' for task state management
- [x] T021 [P] Create 'frontend/src/hooks/useApi.ts' for generic API hook

## Sprint 2: User Story 1 - Secure User Authentication (Priority: P1)

### Phase 5: Authentication UI Components
- [x] T022 [US1] Create authentication layout in frontend/src/app/(auth)/layout.tsx
- [x] T023 [US1] Create login page in frontend/src/app/(auth)/signin/page.tsx
- [x] T024 [US1] Create signup page in frontend/src/app/(auth)/signup/page.tsx
- [ ] T025 [US1] [P] Create reusable authentication components in frontend/src/components/auth/
- [ ] T026 [US1] [P] Create navigation bar with user profile/logout in frontend/src/components/layout/
- [x] T027 [US1] Implement protected route middleware for authentication

### Phase 6: Authentication Implementation
- [x] T028 [US1] Implement login functionality with JWT token handling
- [x] T029 [US1] Implement signup functionality with proper validation
- [x] T030 [US1] Implement logout functionality with token cleanup
- [ ] T031 [US1] Implement token refresh logic 5 minutes before expiry
- [x] T032 [US1] Add form validation for authentication forms (email, password requirements)

## Sprint 3: User Story 2 - Todo Features (CRUD Operations) (Priority: P2)

### Phase 7: Task Service & API Integration
- [x] T033 [US2] Create 'frontend/src/services/taskService.ts' to handle all API calls to the '/api/{user_id}/tasks' endpoints with proper user_id isolation
- [x] T034 [US2] Implement standardized API envelope processing for all task operations
- [x] T035 [US2] Add proper error handling with toast notifications for API failures

### Phase 8: Task Components & UI
- [x] T036 [US2] [P] Create 'AddTaskForm' component to create new tasks with validation
- [x] T037 [US2] [P] Create 'TaskCard' component to display, delete, and toggle task completion
- [x] T038 [US2] [P] Create 'TaskFilters' component for basic filtering (All, Active, Completed)
- [x] T039 [US2] Implement main dashboard to display the list of tasks

## Sprint 4: User Story 3 - Validation & Polishing (Priority: P3)

### Phase 8: Loading States & Skeletons
- [x] T042 [US3] Implement loading skeletons for all async operations in task list and auth forms
- [x] T047 [US3] Create loading skeletons for every async operation
- [x] T043 [US3] Ensure responsive design works on mobile and desktop

### Phase 9: Compliance Gates & Testing
- [x] T049 [US3] Add comprehensive unit tests to achieve 80% coverage using Vitest/React Testing Library
- [x] T050 [US3] Verify that the 'Standardized Error Envelope' correctly triggers toast notifications for 401, 403, and 500 errors
- [x] T045 [US3] Implement form validation for task titles (1-200 characters)

### Phase 10: Performance Optimization
- [x] T044 [US3] Audit application to ensure p95 latency is within the 500ms goal
- [x] T046 [US3] Implement 'Optimistic UI' updates for toggling task completion to ensure instant feedback
- [x] T048 [US3] Verify proper user isolation with user_id handling

### Phase 11: Final Cleanup
- [x] T051 [US3] Run final linting check and ensure no console.logs or debuggers remain
- [x] T052 [US3] Verify that the 'PHR Architecture' is complete for this feature set

## Dependencies

- T001-T008 must complete before other phases
- T009-T013 should be completed before authentication and task infrastructure
- User stories can be implemented in parallel after infrastructure is in place
- Testing tasks can run throughout development

## Parallel Execution Examples

- T009-T013 can run in parallel during Phase 2
- T014-T017 can run in parallel during Phase 3
- T018-T021 can run in parallel during Phase 4
- T025-T026 can run in parallel during Phase 5

## Implementation Strategy

- MVP scope: Complete Sprint 1 (Setup & Core Infrastructure) and Sprint 2 (User Story 1)
- This provides a functional authentication system with proper API integration
- Subsequent sprints build on this foundation incrementally