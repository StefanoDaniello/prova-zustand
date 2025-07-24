"use client";

import { useCounterStore } from "./store";
import { useEffect } from "react";

const setCount = () => {
  useCounterStore.setState({ count: 1 });
};

export default function Home() {
  // Abbiamo due esempi
  // 1.  viediamo che prendiamo state.count quindi count si reinderizzera ogni volta che count si modifica
  // 2.  destrutturiamo e ci mettiamo in ascolto dello state quindi ogni volta che qualche stato cambia in nell file store count si reinderizza

  // quindi bisogna essere precisi quando si prende uno stato per non causare il molteplice reinderizzamento dello stato o funzione che lo modifica

  const count = useCounterStore((state) => state.count);
  // const { count } = useCounterStore((state) => state);

  const increment = useCounterStore((state) => state.increase);
  const incrementAsync = useCounterStore((state) => state.incrementAsync);
  const decrementAsync = useCounterStore((state) => state.decrementAsync);
  const decrement = useCounterStore((state) => state.decrease);

  useEffect(() => {
    setCount();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Zustand</h1>
      <div className="flex space-x-2 items-center">
        <button
          onClick={increment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          +
        </button>
        <button
          onClick={incrementAsync}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          incrementAsync
        </button>
        <div>{count}</div>
        <button
          onClick={decrementAsync}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          decrementAsync
        </button>
        <button
          onClick={decrement}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          -
        </button>
      </div>
    </div>
  );
}
