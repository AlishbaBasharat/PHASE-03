"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import { authClient } from '@/lib/auth'; 
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  isLoading: boolean;
  isActionLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();

  const user: User | null = data?.user ? {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name || ""
  } : null;

  const login = async (email: string, password: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      });
      if (error) throw new Error(error.message || "Login failed");
      router.push('/dashboard');
    } finally {
      setIsActionLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard"
      });
      if (error) throw new Error(error.message || "Signup failed");
      router.push('/dashboard');
    } finally {
      setIsActionLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      router.push('/signin');
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: data?.session || null, 
      isLoading: isPending, 
      isActionLoading,
      login, 
      signup, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};