import { create } from 'zustand';

export interface PlayerModalData {
  name: string;
  team: string;
  flag: string;
  avatar?: string;
  goals?: number;
  assists?: number;
  rating?: number;
  cleanSheets?: number;
}

interface PlayerModalState {
  isOpen: boolean;
  player: PlayerModalData | null;
  open: (player: PlayerModalData) => void;
  close: () => void;
}

export const usePlayerModalStore = create<PlayerModalState>((set) => ({
  isOpen: false,
  player: null,
  open: (player) => set({ isOpen: true, player }),
  close: () => set({ isOpen: false, player: null }),
}));
