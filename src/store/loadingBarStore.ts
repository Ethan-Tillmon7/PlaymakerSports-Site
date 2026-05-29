import { create } from 'zustand';

interface LoadingBarStore {
  active: boolean;
  progress: number;
  start: () => void;
  done: () => void;
}

export const useLoadingBarStore = create<LoadingBarStore>((set) => ({
  active: false,
  progress: 0,

  start() {
    set({ active: true, progress: 0 });
    // Two rAF frames ensure the initial opacity/width render happens
    // before we animate to 75%, so the CSS transition fires correctly.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        set({ progress: 0.75 });
      });
    });
  },

  done() {
    set({ progress: 1 });
    setTimeout(() => set({ active: false, progress: 0 }), 350);
  },
}));
