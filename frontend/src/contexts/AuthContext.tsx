import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  nome: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
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

  // Login real com a API
  async function login(email: string, senha: string) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      const { usuario, token: authToken } = response.data;

      await Promise.all([
        AsyncStorage.setItem(STORAGE_TOKEN_KEY, authToken),
        AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario)),
      ]);

      setToken(authToken);
      setUser(usuario);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(message);
    }
  }

  // Registrar novo usuário
  async function registrar(nome: string, email: string, senha: string) {
    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      
      const { usuario, token: authToken } = response.data;

      await Promise.all([
        AsyncStorage.setItem(STORAGE_TOKEN_KEY, authToken),
        AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario)),
      ]);

      setToken(authToken);
      setUser(usuario);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar';
      throw new Error(message);
    }
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
        registrar,
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
