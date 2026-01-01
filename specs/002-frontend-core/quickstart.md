# Quickstart: Frontend Core Architecture Alignment

## Prerequisites
- Node.js 18+ installed
- pnpm package manager installed (`npm install -g pnpm`)
- Access to backend API with proper authentication setup

## Setup Instructions

1. **Clone and Navigate**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Configuration**:
   Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   AUTH_SECRET=your-secret-key-here
   ```

4. **Run Development Server**:
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

## Key Features Setup

### Authentication
- Better Auth is configured with JWT plugin
- Protected routes are handled by middleware
- Session tokens are automatically attached to API requests

### API Client
- Centralized API client in `src/services/api.ts`
- JWT interceptor automatically adds Authorization header
- Standardized response envelope processing

### UI Components
- Atomic design pattern following shadcn principles
- Responsive design with Tailwind CSS
- Loading skeletons for async operations

## Running Tests
```bash
pnpm test
```

## Building for Production
```bash
pnpm build
pnpm start  # To serve the built application
```