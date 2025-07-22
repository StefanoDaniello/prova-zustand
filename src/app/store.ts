// Lo store in zustand e dove andiamo a memorizzare lo stato e qualsiasi funzione che aggiorna quello stato

import { create } from "zustand";

type CounterStore = {
  count: number;
  increase: () => void;
  increaseAsync: () => Promise<void>;
  decrease: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  increaseAsync: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count + 1 }));
  },
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));
