import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_TOKEN_KEY = '@proestoque:token';
const STORAGE_USER_KEY = '@proestoque:user';

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_TOKEN_KEY),
          AsyncStorage.getItem(STORAGE_USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // If restore fails, stay logged out
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Simulated login — 500ms delay
  async function login(email: string, _password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fakeToken = 'token-' + Math.random().toString(36).slice(2);
    const fakeUser: User = {
      nome: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
    };

    await Promise.all([
      AsyncStorage.setItem(STORAGE_TOKEN_KEY, fakeToken),
      AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fakeUser)),
    ]);

    setToken(fakeToken);
    setUser(fakeUser);
  }

  async function logout() {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_TOKEN_KEY),
      AsyncStorage.removeItem(STORAGE_USER_KEY),
    ]);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
