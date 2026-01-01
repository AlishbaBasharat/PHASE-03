# Data Model: Frontend Core Architecture Alignment

## Entities

### User Session
- **Fields**:
  - token: string (JWT token)
  - userId: string (UUID format)
  - expiresAt: Date
  - isAuthenticated: boolean
- **Validation**: Token must be valid JWT format, userId must be UUID format
- **State Transitions**: Unauthenticated → Authenticating → Authenticated → Expired/LoggedOut

### API Response Envelope
- **Fields**:
  - status: "success" | "error"
  - data: any (for success responses)
  - error: { code: string, message: string, details: any[] } (for error responses)
  - meta: { timestamp: string, request_id: string }
- **Validation**: Must follow Constitution v2.0.0 standardized format
- **State Transitions**: Request initiated → Response received → Processed

### Task (as consumed by frontend)
- **Fields**:
  - id: string (UUID)
  - title: string (1-200 characters)
  - description?: string
  - completed: boolean
  - createdAt: Date
  - updatedAt: Date
  - userId: string (UUID) - for frontend validation of ownership
- **Validation**: Title must be 1-200 characters, id and userId must be UUID format
- **State Transitions**: Created → Pending → Completed/Active → Updated → Deleted

### Loading State
- **Fields**:
  - isLoading: boolean
  - error?: string
  - data?: any
- **Validation**: Only one of loading/error/data should be active at a time
- **State Transitions**: Idle → Loading → Success/Error

## Relationships
- User Session contains multiple API requests
- API Response Envelope wraps Task data
- Loading State manages async operations for all entities