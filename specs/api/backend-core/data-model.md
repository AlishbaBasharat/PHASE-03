# Data Model: Backend Core API

## Entity: Task

**Description**: Represents a user's todo item with title, description, completion status, and user ownership.

**Fields**:
- `id`: UUID (Primary Key, auto-generated)
- `title`: String (required, max 255 characters)
- `description`: String (optional, max 1000 characters)
- `completed`: Boolean (default: false)
- `user_id`: UUID (Foreign Key, references user, required for isolation)
- `created_at`: DateTime (auto-generated timestamp)
- `updated_at`: DateTime (auto-generated timestamp, updates on modification)

**Relationships**:
- Belongs to one User (via user_id foreign key)

**Validation Rules**:
- Title must be 1-255 characters
- Description can be empty or 1-1000 characters
- user_id must be a valid UUID and match the authenticated user
- completed defaults to false when creating new tasks

**State Transitions**:
- Creation: completed = false by default
- Update: completed can be toggled true/false
- Deletion: soft delete with deleted_at timestamp (optional)

## Entity: User (referenced via Better Auth)

**Description**: External user entity managed by Better Auth system, referenced by user_id in Task entity.

**Fields** (referenced via JWT token):
- `user_id`: UUID (Primary identifier from JWT claims)
- Other user details are managed by Better Auth system

**Relationships**:
- Has many Tasks (one-to-many with Task.user_id)

## Database Schema Requirements

**Indexes**:
- Primary key index on `id` (automatic)
- Foreign key index on `user_id` (required for performance)
- Index on `completed` field (for filtering)
- Composite index on (user_id, completed) for common queries

**Constraints**:
- All tasks must have a valid user_id
- Users can only access tasks with matching user_id
- No cross-user access allowed at database level