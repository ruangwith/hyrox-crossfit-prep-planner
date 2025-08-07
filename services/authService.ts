// MOCK AUTH SERVICE using localStorage
import type { User, FullPlan } from '../types';

const MOCK_USERS_KEY = 'ai_fitness_users';
const MOCK_PLANS_KEY_PREFIX = 'ai_fitness_plans_';
const CURRENT_USER_SESSION_KEY = 'ai_fitness_session';

// --- User Management ---

export const signup = (email: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      if (users.some((u: User) => u.email === email)) {
        return reject(new Error('User with this email already exists.'));
      }
      const newUser: User = { id: `user_${Date.now()}`, email };
      // In a real app, you'd store a hashed password, not the plain one.
      users.push({ ...newUser, pass }); 
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(newUser));
      resolve(newUser);
    }, 500);
  });
};

export const login = (email: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      const user = users.find((u: any) => u.email === email && u.pass === pass);
      if (user) {
        const userData: User = { id: user.id, email: user.email };
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(userData));
        resolve(userData);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 500);
  });
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_SESSION_KEY);
  return userJson ? JSON.parse(userJson) : null;
};


// --- Plan Management ---

export const getSavedPlans = (userId: string): FullPlan[] => {
  const plansJson = localStorage.getItem(`${MOCK_PLANS_KEY_PREFIX}${userId}`);
  return plansJson ? JSON.parse(plansJson) : [];
};

export const savePlan = (userId: string, plan: FullPlan): void => {
  const plans = getSavedPlans(userId);
  if (!plans.some(p => p.id === plan.id)) {
    plans.unshift(plan); // Add new plan to the top
    localStorage.setItem(`${MOCK_PLANS_KEY_PREFIX}${userId}`, JSON.stringify(plans));
  }
};

export const deletePlan = (userId: string, planId: string): void => {
  let plans = getSavedPlans(userId);
  plans = plans.filter(p => p.id !== planId);
  localStorage.setItem(`${MOCK_PLANS_KEY_PREFIX}${userId}`, JSON.stringify(plans));
};
