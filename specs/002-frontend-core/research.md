# Research Findings: Frontend Core Architecture

## Decision: Next.js 15+ with App Router for Frontend Framework
**Rationale**: Next.js 15+ provides the best combination of server-side rendering, static generation, and client-side rendering capabilities needed for the Todo App. The App Router offers better layout management and nested routing which is essential for the multi-page application structure required. It also provides excellent integration with TypeScript and Tailwind CSS.

**Alternatives considered**:
- Create React App: Lacks built-in routing and server-side rendering
- Remix: More complex setup, smaller community than Next.js
- Nuxt.js: Vue-based, not aligned with the React ecosystem requirements

## Decision: Tailwind CSS with Custom Dark Mode Theme
**Rationale**: Tailwind CSS provides utility-first styling that aligns with the requirement to "always use Tailwind CSS for styling". The dark mode theme can be easily implemented using Tailwind's theme customization and dark mode variants to achieve the specified color scheme (Primary: #0B0E14, Accents: #A855F7, #7C3AED).

**Implementation approach**:
- Configure tailwind.config.js with the specified color palette
- Use dark mode with class strategy for consistent dark theme application
- Implement glassmorphism effects using backdrop-blur and custom CSS

## Decision: Lucide React for Icon Library
**Rationale**: Lucide React provides a consistent, lightweight icon library that meets the requirement to "Use Lucide-react for icons". It offers a large collection of well-designed icons that can be easily customized with Tailwind classes.

**Alternatives considered**:
- React Icons: Larger bundle size due to including multiple icon sets
- Heroicons: Good but limited compared to Lucide's extensive collection
- Feather Icons: Similar to Lucide but Lucide has more active development

## Decision: Better Auth for Authentication System
**Rationale**: Better Auth meets the constitution requirement for secure authentication and JWT token handling. It provides a complete authentication solution with session management that can be integrated with both frontend and backend components.

**Implementation approach**:
- Implement Better Auth on frontend for user sessions
- Configure JWT token extraction and inclusion in API requests
- Set up automatic token refresh mechanism as per constitution requirements

## Decision: TypeScript for Type Safety
**Rationale**: TypeScript provides compile-time error checking and better developer experience for the complex frontend application. It aligns with industry best practices and helps maintain code quality.

## Decision: Responsive Design with Mobile-First Approach
**Rationale**: The requirement to "ensure all forms are centered and mobile-responsive" necessitates a mobile-first responsive design approach using Tailwind's responsive utility classes.

**Implementation approach**:
- Use mobile-first design with Tailwind's responsive breakpoints
- Implement centered layouts using flexbox and grid utilities
- Test on multiple screen sizes to ensure responsive behavior

## Decision: API Integration Pattern
**Rationale**: The frontend needs to communicate with the backend API while maintaining security and performance. The implementation will follow the JWT protocol specified in the constitution.

**Implementation approach**:
- Create API service layer to handle all backend communication
- Implement JWT token inclusion in Authorization header
- Handle API response envelopes as specified in constitution
- Implement proper error handling and loading states

## Decision: State Management Approach
**Rationale**: For the Todo application, we'll use React's built-in useState and useContext hooks for local state management, with potential integration of React Query for server state management if needed.

**Implementation approach**:
- Use React hooks for component-level state
- Implement context for application-wide state that doesn't require complex management
- Consider React Query for server state and caching if performance requirements demand it