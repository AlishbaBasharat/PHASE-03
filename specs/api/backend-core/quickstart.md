# Quickstart Guide: Backend Core API

## Prerequisites

- Python 3.13+
- Docker and Docker Compose
- Neon PostgreSQL account
- Better Auth configured for JWT generation

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phase2-todo-app
   ```

2. **Set up the backend environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname
   BETTER_AUTH_SECRET=your-better-auth-secret
   ```

4. **Run the development server**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

5. **Alternative: Use Docker**
   ```bash
   docker-compose up --build
   ```

## API Usage

### Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The token should be obtained from Better Auth after user authentication.

### Example Requests

**Create a task:**
```bash
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample task", "description": "Task description"}'
```

**Get all tasks:**
```bash
curl -X GET http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <token>"
```

**Update a task:**
```bash
curl -X PUT http://localhost:8000/api/{user_id}/tasks/{task_id} \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task", "completed": true}'
```

## Seeding the Database

To populate the database with sample data for testing:

```bash
python src/seed.py
```

## Testing

Run the test suite:

```bash
pytest tests/
```

## Development Workflow

1. Make changes to the source files
2. Run tests to ensure functionality: `pytest tests/`
3. Verify API contracts are maintained
4. Update documentation if needed
5. Commit changes following SDD methodology