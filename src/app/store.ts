// Lo store in zustand e dove andiamo a memorizzare lo stato e qualsiasi funzione che aggiorna quello stato

import { create } from "zustand";

type CounterStore = {
  count: number;
  increase: () => void;
  incrementAsync: () => Promise<void>;
  decrementAsync: () => Promise<void>;
  decrease: () => void;
};

// Ogni stato deve esere diviso in diversi store  quindi qui lo usiamo per count un altro per autenticare gli utenti ecc..

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  incrementAsync: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count + 1 }));
  },
  decrementAsync: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count - 1 }));
  },
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));
