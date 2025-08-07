import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, FullPlan } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  savedPlans: FullPlan[];
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  savePlan: (plan: FullPlan) => void;
  deletePlan: (planId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [savedPlans, setSavedPlans] = useState<FullPlan[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setSavedPlans(authService.getSavedPlans(user.id));
    } else {
      setSavedPlans([]);
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await authService.login(email, pass);
    setUser(loggedInUser);
  };

  const signup = async (email: string, pass: string) => {
    const newUser = await authService.signup(email, pass);
    setUser(newUser);
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const savePlan = (plan: FullPlan) => {
    if (user) {
      authService.savePlan(user.id, plan);
      setSavedPlans(authService.getSavedPlans(user.id));
    }
  };

  const deletePlan = (planId: string) => {
    if (user) {
      authService.deletePlan(user.id, planId);
      setSavedPlans(authService.getSavedPlans(user.id));
    }
  };

  const value = {
    user,
    savedPlans,
    isAuthModalOpen,
    setAuthModalOpen,
    login,
    signup,
    logout,
    savePlan,
    deletePlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
