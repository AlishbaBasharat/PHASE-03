# Feature Specification: Backend Core API for Multi-User Todo Management

**Feature Branch**: `1-backend-core`
**Created**: 2025-12-18
**Status**: Draft
**Input**: User description: "Create a comprehensive Technical Specification for the Phase II Backend in /specs/api/backend-core.md.

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

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-User Todo Management (Priority: P1)

A registered user can create, read, update, and delete their own todo tasks through the web application. The system ensures that users can only access their own tasks and cannot see or modify tasks belonging to other users.

**Why this priority**: This is the core functionality that enables the multi-user todo system to function securely and correctly.

**Independent Test**: A user can log in, create a task, view their tasks, update a task, and delete a task. The user should not be able to access tasks belonging to other users.

**Acceptance Scenarios**:
1. **Given** a user is authenticated with a valid JWT token, **When** they create a new task via the API, **Then** the task is created with their user_id and they can view it in their task list
2. **Given** a user is authenticated with a valid JWT token, **When** they attempt to access a task belonging to another user, **Then** the system returns a 403 Forbidden error
3. **Given** a user has created tasks, **When** they request their task list, **Then** only tasks with their user_id are returned

---

### User Story 2 - Secure Authentication (Priority: P1)

Users must authenticate via JWT tokens to access any backend API endpoints. The system validates JWT tokens using the Better Auth secret and extracts user identity from the token.

**Why this priority**: Security is critical for the multi-user system to prevent unauthorized access and ensure data isolation.

**Independent Test**: An authenticated user can access their data, while requests without valid tokens are rejected with appropriate error responses.

**Acceptance Scenarios**:
1. **Given** a request with a valid JWT token in the Authorization header, **When** the request is made to any API endpoint, **Then** the request is processed with the user identity extracted from the token
2. **Given** a request without a JWT token or with an invalid token, **When** the request is made to any API endpoint, **Then** the system returns a 401 Unauthorized error

---

### User Story 3 - Error Handling (Priority: P2)

When errors occur during API operations, the system returns standardized error responses that clearly indicate the type and cause of the error to enable proper client-side handling.

**Why this priority**: Proper error handling is essential for a reliable user experience and for debugging purposes.

**Independent Test**: Different error conditions (authentication failure, authorization failure, missing resources) return appropriate error responses with clear messages.

**Acceptance Scenarios**:
1. **Given** a request without proper authentication, **When** the request is made to an API endpoint, **Then** a 401 Unauthorized response is returned with standardized error format
2. **Given** an authenticated user requests a task that doesn't belong to them, **When** the request is processed, **Then** a 403 Forbidden response is returned with standardized error format
3. **Given** an authenticated user requests a task that doesn't exist, **When** the request is processed, **Then** a 404 Not Found response is returned with standardized error format

---

## Edge Cases

- What happens when a JWT token is expired or malformed?
- How does the system handle database connection failures during operations?
- What occurs when a user tries to access the API with an invalid user_id in the URL path?
- How does the system respond to concurrent requests from the same user?
- What happens when the database query returns an empty result set?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement JWT verification middleware that validates tokens using the BETTER_AUTH_SECRET
- **FR-002**: System MUST extract user_id from JWT token claims/subject to enforce data isolation
- **FR-003**: System MUST prefix all API endpoints with /api/{user_id}/ as required by the Constitution
- **FR-004**: System MUST provide Pydantic schemas for TaskRead (id, title, description, completed, user_id), TaskCreate (title, description), and TaskUpdate (title, description, completed)
- **FR-005**: System MUST return standardized JSON response format with data and meta fields for all endpoints
- **FR-006**: System MUST define a Task table with user_id as a foreign key and mandatory index
- **FR-007**: System MUST enforce user isolation by including WHERE clause filtering by user_id in every database query
- **FR-008**: System MUST reject requests without valid Bearer tokens with 401 Unauthorized response
- **FR-009**: System MUST prevent cross-user access with 403 Forbidden responses when users try to access tasks belonging to other users
- **FR-010**: System MUST use async database sessions for all operations
- **FR-011**: System MUST return 401 error responses for invalid/missing authentication
- **FR-012**: System MUST return 403 error responses for cross-user access attempts
- **FR-013**: System MUST return 404 error responses for non-existent resources

### Key Entities

- **Task**: Represents a user's todo item with attributes id, title, description, completed status, and user_id. This entity enforces data isolation by requiring user_id for all operations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create, read, update, and delete their own tasks with 100% success rate when authenticated
- **SC-002**: Cross-user access attempts are blocked 100% of the time with appropriate 403 Forbidden responses
- **SC-003**: Unauthenticated requests are rejected 100% of the time with 401 Unauthorized responses
- **SC-004**: All API endpoints return responses within 500ms p95 latency
- **SC-005**: All API responses follow the standardized JSON format with data and meta fields
- **SC-006**: Database operations complete successfully with 99%+ success rate under normal load