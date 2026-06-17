import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  favorites: string[];
  addFavorite: (matchId: string) => void;
  removeFavorite: (matchId: string) => void;
  isFavorite: (matchId: string) => boolean;
  toggleFavorite: (matchId: string) => void;

  history: string[];
  addToHistory: (id: string) => void;
  clearHistory: () => void;

  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  toggleLanguage: () => void;

  activeNavItem: string;
  setActiveNavItem: (item: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (matchId) =>
        set((state) => {
          if (state.favorites.includes(matchId)) return state;
          return { favorites: [...state.favorites, matchId] };
        }),
      removeFavorite: (matchId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== matchId),
        })),
      isFavorite: (matchId) => get().favorites.includes(matchId),
      toggleFavorite: (matchId) => {
        if (get().favorites.includes(matchId)) {
          get().removeFavorite(matchId);
        } else {
          get().addFavorite(matchId);
        }
      },

      history: [],
      addToHistory: (id) =>
        set((state) => ({
          history: [id, ...state.history.filter((hid) => hid !== id)].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),

      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      language: 'es',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'es' : 'en' })),

      activeNavItem: 'home',
      setActiveNavItem: (activeNavItem) => set({ activeNavItem }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'worldcup-store',
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
