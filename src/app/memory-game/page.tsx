"use client";

import { useEffect, ElementType, useRef, use } from "react";
import confetti from "canvas-confetti";

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
  const matchStatus = useMemoryGameStore((state) => state.matchStatus);
  const setMatchStatus = useMemoryGameStore((state) => state.setMatchStatus);

  useEffect(() => {
    if (shuffledIcons.length === 0) {
      setShuffledIcons();
    }
  }, [shuffledIcons, setShuffledIcons]);

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const confettiRan = useRef(false); // Usa useRef per tenere traccia se i coriandoli sono già stati sparati
  useEffect(() => {
    if (matchStatus.name === "progress") {
      // Reset animation flag così da poter riavviare animazioni future
      confettiRan.current = false;
      return; // esco subito perché non serve far partire confetti in "progress"
    }

    if (
      (matchStatus.name === "win" || matchStatus.name === "lose") &&
      !confettiRan.current
    ) {
      if (matchStatus.name === "lose") {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        const frame = () => {
          const timeLeft = animationEnd - Date.now();
          const ticks = Math.max(200, 500 * (timeLeft / duration));
          skew = Math.max(0.8, skew - 0.001);

          confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks,
            origin: {
              x: Math.random(),
              y: Math.random() * skew - 0.2,
            },
            colors: ["#ffffff"],
            shapes: ["circle"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
            disableForReducedMotion: true,
          });

          if (timeLeft > 0) {
            requestAnimationFrame(frame);
          }
        };

        requestAnimationFrame(frame);
      } else {
        // Effetto "win"
        confetti({
          particleCount: 150,
          spread: 120,
          startVelocity: 60,
          origin: { y: 1 },
          disableForReducedMotion: true,
        });
      }

      confettiRan.current = true;
    }
  }, [matchStatus]);

  return (
    <div>
      <div>
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
              {Array.from({ length: 10 }).map((_, index) => (
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
      </div>

      {(matchStatus.name === "win" || matchStatus.name === "lose") && (
        <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center space-y-5">
            <h4 className="text-white text-3xl font-bold">
              {matchStatus.name === "win"
                ? "Hai Vinto Complimenti!"
                : "Hai Perso, andra meglio la prossima volta!"}
            </h4>
            <button
              onClick={() => {
                setMatchStatus("progress");
              }}
              className={`flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring  focus:ring-opacity-80 hover:cursor-pointer ${
                matchStatus.name === "win"
                  ? "bg-blue-600  hover:bg-blue-500  focus:ring-blue-300"
                  : "bg-red-600  hover:bg-red-500  focus:ring-red-300"
              }  `}
            >
              <svg
                className="w-5 h-5 mx-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="mx-1 font-bold">Ricomincia</span>
            </button>
          </div>
        </div>
      )}
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
