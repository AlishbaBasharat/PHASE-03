import authClient from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface BetterAuthUser {
  id: string; // UUID format
  email: string;
  name: string;
  // Add other fields as needed
}

interface BetterAuthSession {
  token: string;
  // Add other fields as needed
}

interface AuthResponse {
  token: string;
  user: BetterAuthUser;
}

// Helper function to add timeout to promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs);
    }) as Promise<T>
  ]);
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use Better Auth's signIn function with timeout
      const result = await withTimeout(
        authClient.signIn.email({
          email: credentials.email,
          password: credentials.password,
          callbackURL: '/dashboard', // Redirect after login
        }),
        10000 // 10 second timeout
      );

      if (result?.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      // Get the session after successful login with timeout
      const session = await withTimeout(authClient.getSession(), 10000);
      if (!session?.session || !session?.user) {
        throw new Error('Session not found after login');
      }

      return {
        token: session.session.token,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      // Use Better Auth's signUp function with timeout
      const result = await withTimeout(
        authClient.signUp.email({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          callbackURL: '/dashboard', // Redirect after signup
        }),
        10000 // 10 second timeout
      );

      if (result?.error) {
        throw new Error(result.error.message || 'Signup failed');
      }

      // Get the session after successful signup with timeout
      const session = await withTimeout(authClient.getSession(), 10000);
      if (!session?.session || !session?.user) {
        throw new Error('Session not found after signup');
      }

      return {
        token: session.session.token,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || userData.name,
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the logout fails, clear local state
      // The token will be cleared on the server side eventually
    }
  }

  static async getProfile(): Promise<BetterAuthUser> {
    try {
      const session = await authClient.getSession();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
      };
    } catch (error) {
      throw error;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await authClient.getSession();
    return !!session?.session;
  }

  static async getAuthToken(): Promise<string | null> {
    const session = await authClient.getSession();
    return session?.session?.token || null;
  }

  static async clearAuthToken(): Promise<void> {
    await authClient.signOut();
  }
}