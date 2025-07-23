"use client";

import { useEffect, ElementType } from "react";

import { useMemoryGameStore } from "../zustand-state/memory-game-store";

export default function MemoryGame() {
  const shuffledIcons = useMemoryGameStore((state) => state.shuffledIcons);
  const setShuffledIcons = useMemoryGameStore(
    (state) => state.setShuffledIcons
  );

  useEffect(() => {
    if (shuffledIcons.length === 0) {
      setShuffledIcons();
    }
  }, [shuffledIcons, setShuffledIcons]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-4 gap-4">
        {shuffledIcons.map((icon) => (
          <Card
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            matched={icon.matched}
            flipped={icon.flipped}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  id,
  icon,
  flipped,
  matched,
}: {
  id: number;
  icon: ElementType;
  flipped: boolean;
  matched: boolean;
}) {
  const flipCard = useMemoryGameStore((state) => state.flipCard);
  const IconComponent = icon;

  return (
    <div
      onClick={() => flipCard(id)}
      className="relative w-[150px] h-[200px] perspective cursor-pointer "
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Lato front */}
        <div
          className={`absolute w-full h-full bg-[url('/card-bg.jpg')] bg-cover bg-center bg-no-repeat rounded-lg backface-hidden border ${
            matched ? "border-yellow-500" : "border-white"
          }`}
        ></div>

        {/* Lato back */}
        <div
          className={`absolute w-full h-full bg-[url('/card-front.jpg')] bg-cover bg-center bg-no-repeat rounded-lg backface-hidden rotate-y-180 flex items-center justify-center text-white shadow-lg border ${
            matched ? "border-yellow-500" : "border-white"
          }`}
        >
          <IconComponent className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
}
