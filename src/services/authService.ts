import type { User } from '@/types';
import { storageService } from './storageService';

const USER_KEY = 'markaradar_user';
const AUTH_KEY = 'markaradar_auth_token';

export const authService = {
  register(email: string, _password: string, name: string): { user: User; token: string } {
    const existingUser = storageService.getUser();
    if (existingUser && existingUser.email === email) {
      throw new Error('Bu e-posta adresi ile kayıtlı bir hesap zaten mevcut.');
    }

    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      plan: 'free',
      analysesCount: 0,
      createdAt: new Date().toISOString(),
    };

    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    storageService.setUser(user);
    localStorage.setItem(AUTH_KEY, token);
    
    return { user, token };
  },

  login(email: string, _password: string): { user: User; token: string } {
    // For demo, accept any credentials if user exists, otherwise create demo user
    let user = storageService.getUser();
    
    if (!user || user.email !== email) {
      // Create a demo user for any login attempt
      user = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        plan: 'free',
        analysesCount: 0,
        createdAt: new Date().toISOString(),
      };
      storageService.setUser(user);
    }

    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(AUTH_KEY, token);
    
    return { user, token };
  },

  demoLogin(): { user: User; token: string } {
    const user: User = {
      id: `demo_user_${Date.now()}`,
      email: 'demo@markaradar.com',
      name: 'Kullanıcı',
      plan: 'pro',
      analysesCount: 0,
      createdAt: new Date().toISOString(),
    };

    const token = `demo_token_${Date.now()}`;
    storageService.setUser(user);
    localStorage.setItem(AUTH_KEY, token);
    
    return { user, token };
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    return storageService.getUser();
  },

  upgradeToPro(): void {
    const user = storageService.getUser();
    if (user) {
      user.plan = 'pro';
      storageService.setUser(user);
    }
  },
};
