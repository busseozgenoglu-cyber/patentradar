import type { StoredAnalysis, User } from '@/types';

const ANALYSES_KEY = 'markaradar_analyses';
const USER_KEY = 'markaradar_user';

export const storageService = {
  // Analyses
  getAnalyses(): StoredAnalysis[] {
    try {
      const data = localStorage.getItem(ANALYSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getAnalysisById(id: string): StoredAnalysis | null {
    const analyses = this.getAnalyses();
    return analyses.find(a => a.id === id) || null;
  },

  saveAnalysis(analysis: StoredAnalysis): void {
    const analyses = this.getAnalyses();
    analyses.unshift(analysis); // Add to beginning
    
    // Keep only last 50 analyses
    if (analyses.length > 50) {
      analyses.length = 50;
    }
    
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
  },

  deleteAnalysis(id: string): void {
    const analyses = this.getAnalyses().filter(a => a.id !== id);
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
  },

  clearAnalyses(): void {
    localStorage.removeItem(ANALYSES_KEY);
  },

  // User
  getUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Guest analyses (stored separately, not tied to user)
  getGuestAnalyses(): StoredAnalysis[] {
    try {
      const data = localStorage.getItem('markaradar_guest_analyses');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveGuestAnalysis(analysis: StoredAnalysis): void {
    const analyses = this.getGuestAnalyses();
    analyses.unshift(analysis);
    if (analyses.length > 10) analyses.length = 10; // Keep last 10 for guests
    localStorage.setItem('markaradar_guest_analyses', JSON.stringify(analyses));
  },
};
