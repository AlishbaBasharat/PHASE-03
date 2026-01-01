# MCP Server Coding Guidelines

## Purpose
This MCP Server exposes stateless task management tools for the AI chatbot using the Official MCP SDK.

## Stateless Mandate

**CRITICAL**: This MCP Server MUST be completely stateless.

### What This Means:
- ❌ NO in-memory state storage
- ❌ NO conversation history caching
- ❌ NO user session management
- ❌ NO task data caching
- ✅ Each tool invocation is independent
- ✅ All tools accept explicit `user_id` parameters
- ✅ Tools communicate with backend database via API calls

## Tool Definitions

All tools follow this pattern:

```python
from mcp import Tool

@Tool.define(
    name="tool_name",
    description="Clear description of what this tool does",
    parameters={
        "param1": {"type": "string", "description": "Parameter description"},
        "user_id": {"type": "string", "format": "uuid", "description": "User identifier"}
    }
)
async def tool_name(param1: str, user_id: str) -> dict:
    # Stateless implementation
    # Call backend API with service token
    # Return structured response
    pass
```

## User Isolation

**Every tool MUST**:
1. Accept `user_id` as a parameter
2. Include `user_id` in all backend API calls
3. Validate that operations only affect the specified user's data

## Error Handling

Tools should:
- Return structured error responses matching API envelope format
- Handle HTTP errors gracefully
- Provide user-friendly error messages
- Never expose internal implementation details

## Service Authentication

Tools authenticate to the backend using:
- Service-to-service JWT token
- Token stored in `MCP_SERVICE_TOKEN` environment variable
- Include in `Authorization: Bearer {token}` header

## Available Tools

1. **create_task**: Creates a new task
2. **list_tasks**: Lists tasks with optional status filter
3. **update_task**: Updates an existing task
4. **delete_task**: Deletes a task
5. **toggle_task_completion**: Toggles task completion status

## Response Format

All tools return standardized API envelope format:

```python
{
    "status": "success",
    "data": {...},
    "meta": {
        "timestamp": "ISO_8601_timestamp",
        "request_id": "unique_id"
    }
}
```

Error responses:

```python
{
    "status": "error",
    "error": {
        "code": "ERROR_CODE",
        "message": "User-friendly message",
        "details": []
    },
    "meta": {
        "timestamp": "ISO_8601_timestamp",
        "request_id": "unique_id"
    }
}
```

## Development Guidelines

- Use type hints for all function signatures
- Write async functions for all I/O operations
- Keep tools focused (single responsibility)
- Test each tool independently
- Document all parameters clearly

## Testing

Each tool should have:
- Unit tests verifying correct parameter handling
- Integration tests with mock backend API
- User isolation validation tests
- Error handling tests

## Environment Variables

Required:
- `BACKEND_API_URL`: Backend API base URL
- `MCP_SERVICE_TOKEN`: Service authentication token
- `DATABASE_URL`: (Optional) Direct database access if needed

## Constitution Compliance

This MCP Server adheres to Phase 3 constitution requirements:
- ✅ Official MCP SDK usage
- ✅ Stateless architecture
- ✅ Explicit user_id parameters
- ✅ No session storage
- ✅ Pure tool pattern (stateless functions)
