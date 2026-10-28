import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { AuthResponseDto, LoginRequestDto, RegisterParticipantRequestDto } from '../types/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Employee' | 'Participant' | string;
  token: string;
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmployee: boolean;
  isParticipant: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  register: (data: RegisterParticipantRequestDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('skillhub_user');
    const token = localStorage.getItem('skillhub_token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.expiresAt && new Date(parsed.expiresAt) <= new Date()) {
          logout();
        } else {
          setUser(parsed);
        }
      } catch {
        logout();
      }
    }
  }, []);

  const saveAuthSession = (auth: AuthResponseDto) => {
    if (!auth.token) throw new Error('Token no retornado por el servidor');
    const sessionUser: User = {
      id: auth.userId,
      fullName: auth.fullName || auth.email || 'Usuario',
      email: auth.email || '',
      role: auth.role || 'Participant',
      token: auth.token,
      expiresAt: auth.expiresAt,
    };
    localStorage.setItem('skillhub_token', auth.token);
    localStorage.setItem('skillhub_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async (credentials: LoginRequestDto) => {
    const res = await api.login(credentials);
    saveAuthSession(res);
  };

  const register = async (data: RegisterParticipantRequestDto) => {
    const res = await api.register(data);
    saveAuthSession(res);
  };

  const logout = () => {
    localStorage.removeItem('skillhub_token');
    localStorage.removeItem('skillhub_user');
    setUser(null);
  };

  const isEmployee = user?.role === 'Employee';
  const isParticipant = user?.role === 'Participant';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEmployee,
        isParticipant,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
