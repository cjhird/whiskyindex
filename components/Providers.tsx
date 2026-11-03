'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AUTH_COOKIE, DEMO_EMAIL, demoUser, type MockUser } from '@/lib/mock/auth';

const queryClient = new QueryClient();

type AuthContextValue = {
  user: MockUser | null;
  isLoading: boolean;
  login: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => undefined,
  logout: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readCookie(AUTH_COOKIE);
    setUser(session ? { ...demoUser, email: session === '1' ? DEMO_EMAIL : session } : null);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email?: string) => {
    const value = email?.trim() || DEMO_EMAIL;
    document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    setUser({ email: value, name: 'Demo Collector' });
  }, []);

  const logout = useCallback(async () => {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}
