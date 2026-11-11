import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import * as api from '../services/api';
import type { User } from '../types';
import { readStore, removeStore, writeStore } from '../utils/storage';

interface AuthApi {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { name: string; email: string; phone?: string; password: string }) => Promise<User>;
  logout: () => void;
  updateUser: (u: User) => Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStore<User | null>('user', null));

  const persist = (u: User, token: string) => {
    writeStore('user', u);
    writeStore('token', token);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.loginUser(email, password);
    persist(user, token);
    return user;
  }, []);

  const register = useCallback(async (input: { name: string; email: string; phone?: string; password: string }) => {
    const { user, token } = await api.registerUser(input);
    persist(user, token);
    return user;
  }, []);

  const logout = useCallback(() => {
    removeStore('user');
    removeStore('token');
    setUser(null);
  }, []);

  const updateUser = useCallback(async (u: User) => {
    const saved = await api.updateProfile(u);
    writeStore('user', saved);
    setUser(saved);
  }, []);

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
