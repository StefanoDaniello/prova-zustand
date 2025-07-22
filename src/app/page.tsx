"use client";

import { log } from "console";
import { useCounterStore } from "./store";
import { useEffect } from "react";

const setCount = () => {
  useCounterStore.setState({ count: 1 });
};

export default function Home() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increase);
  const increaseAsync = useCounterStore((state) => state.increaseAsync);
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
        <button onClick={increaseAsync}>IncreseAsync</button>
        <div>{count}</div>
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
