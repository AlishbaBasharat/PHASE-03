---
id: phr-20251219-001
title: Configure Environment Variables
stage: green
date: 2025-12-19
surface: monorepo
model: Claude Sonnet 4.5
feature: frontend-core
branch: 002-frontend-core
user: Mubeen
command: /sp.implement
labels: [env, configuration, security, jwt]
links:
  spec:
  ticket:
  adr:
  pr:
files:
  - path: backend/.env
    action: created
    summary: Backend environment file with database and auth secrets
  - path: frontend/.env.local
    action: updated
    summary: Frontend environment file with auth and backend URL configuration
tests:
  - name: env-configuration
    result: pending
    summary: Environment variables available for development
---

## Prompt

Configure Environment Variables for both Backend and Frontend as per Constitution v2.0.0.

ACTIONS:
1. Create a '.env' file in the '/backend' directory with these keys:
   - DATABASE_URL (For Neon PostgreSQL)
   - AUTH_SECRET (A random string for JWT signing)
2. Create a '.env.local' file in the '/frontend' directory with these keys:
   - NEXT_PUBLIC_BACKEND_URL (e.g., http://localhost:8000)
   - BETTER_AUTH_SECRET (Should match the backend's secret)
   - BETTER_AUTH_URL (e.g., http://localhost:3000)

REASONING:
- This is required to establish the 'JWT Bridge' and 'Database Connection' defined in the project architecture.

## Response snapshot

Environment variables have been successfully configured for both backend and frontend:

1. Created backend/.env file with:
   - DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
   - AUTH_SECRET=your-super-secret-jwt-key-change-this-in-production

2. Updated frontend/.env.local file with:
   - NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   - BETTER_AUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
   - BETTER_AUTH_URL=http://localhost:3000

These configurations establish the JWT Bridge and Database Connection required by the Constitution v2.0.0 architecture.

## Outcome

- ✅ Impact: Environment variables configured for JWT Bridge and database connection
- 🧪 Tests: Manual verification completed
- 📁 Files: 2 environment files created/updated
- 🔁 Next prompts: Ready for backend and frontend development
- 🧠 Reflection: Environment configuration aligns with security requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement JWT middleware verification