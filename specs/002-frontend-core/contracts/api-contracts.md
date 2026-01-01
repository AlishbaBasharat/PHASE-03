# API Contracts: Frontend Core Architecture Alignment

## Authentication API Contracts

### POST /api/auth/login
**Description**: Authenticate user and return JWT token
**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid-here",
      "email": "user@example.com"
    }
  },
  "meta": {
    "timestamp": "2025-12-18T10:30:00Z",
    "request_id": "req-uuid-here"
  }
}
```
**Response (Error)**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  },
  "meta": {
    "timestamp": "2025-12-18T10:30:00Z",
    "request_id": "req-uuid-here"
  }
}
```

### POST /api/auth/signup
**Description**: Create new user account
**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```
**Response**: Similar to login success response

### GET /api/auth/profile
**Description**: Get authenticated user profile
**Headers**: Authorization: Bearer {token}
**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid-here",
      "email": "user@example.com",
      "name": "User Name"
    }
  },
  "meta": {
    "timestamp": "2025-12-18T10:30:00Z",
    "request_id": "req-uuid-here"
  }
}
```

## Task API Contracts

### GET /api/tasks
**Description**: Get user's tasks
**Headers**: Authorization: Bearer {token}
**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "task-uuid-here",
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "created_at": "2025-12-18T10:30:00Z",
        "updated_at": "2025-12-18T10:30:00Z",
        "user_id": "user-uuid-here"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-12-18T10:30:00Z",
    "request_id": "req-uuid-here"
  }
}
```

### POST /api/tasks
**Description**: Create new task
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "title": "New task title",
  "description": "Task description"
}
```
**Response**: Similar to GET tasks success response with single task

### PUT /api/tasks/{id}
**Description**: Update task
**Headers**: Authorization: Bearer {token}
**Request**: Similar to POST with updated fields
**Response**: Similar to GET tasks success response with updated task

### PATCH /api/tasks/{id}/complete
**Description**: Toggle task completion status
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "completed": true
}
```
**Response**: Similar to GET tasks success response with updated task

### DELETE /api/tasks/{id}
**Description**: Delete task
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "status": "success",
  "data": {
    "message": "Task deleted successfully"
  },
  "meta": {
    "timestamp": "2025-12-18T10:30:00Z",
    "request_id": "req-uuid-here"
  }
}
```