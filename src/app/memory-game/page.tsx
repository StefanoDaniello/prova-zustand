"use client";

import { useEffect, ElementType } from "react";

import { useMemoryGameStore } from "../zustand-state/memory-game-store";
import { Modalities, MatchStatuses } from "../zustand-state/memory-game-store";

export default function MemoryGame() {
  const shuffledIcons = useMemoryGameStore((state) => state.shuffledIcons);
  const setShuffledIcons = useMemoryGameStore(
    (state) => state.setShuffledIcons
  );

  const point = useMemoryGameStore((state) => state.point);
  const win = useMemoryGameStore((state) => state.win);
  const lose = useMemoryGameStore((state) => state.lose);
  const time = useMemoryGameStore((state) => state.time);
  const modality = useMemoryGameStore((state) => state.modality);
  const setModality = useMemoryGameStore((state) => state.setModality);
  const activeBalls = useMemoryGameStore((state) => state.activeBalls);
  const matchStatus = useMemoryGameStore((state) => state.modality);

  useEffect(() => {
    if (shuffledIcons.length === 0) {
      setShuffledIcons();
    }
  }, [shuffledIcons, setShuffledIcons]);

  return (
    <>
      <div className="max-w-6xl m-auto mt-5">
        <div className="flex justify-between items-center gap-4 p-4 w-full flex-wrap">
          <div className="flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <h4>Punti:</h4>
              <span>{point}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-lg font-semibold ">
                <h4>Vinte:</h4>
                <span>{win}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold ">
                <h4>Perse:</h4>
                <span>{lose}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end  pr-4">
            <div className="flex flex-col items-center gap-2">
              <h4 className="text-xl font-bold text-primary">Modalità</h4>
              <select
                className="select px-2 rounded-full shadow-lg border-white border-2 text-white bg-transparent"
                aria-label="Selezione Modalità"
                onChange={(e) => setModality(e.target.value)}
                value={modality.name}
              >
                {Modalities.map((m) => (
                  <option
                    key={m.name}
                    value={m.name}
                    className="bg-neutral text-white"
                  >
                    {m.name.charAt(0).toUpperCase() + m.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center items-center gap-5"
          id="status-bar"
        >
          <div className="flex justify-center items-center gap-3 text-2xl font-bold text-primary">
            <img src="./timer.png" alt="Timer" className="timer" />
            <h4>{time}</h4>
          </div>
          <div className="status-bar">
            {/* Genera i pallini dinamicamente  */}
            {Array.from({ length: activeBalls }).map((_, index) => (
              <div
                key={index}
                // Applica 'filled' solo se l'indice è inferiore al numero di pallini attivi
                className={`status-indicator ${
                  index < activeBalls ? "filled" : ""
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center p-5 mt-10">
        <div className={`grid grid-cols-${modality.col} gap-4`}>
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
    </>
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
