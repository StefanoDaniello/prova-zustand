"use client";

import { useEffect, ElementType, useRef } from "react";
import confetti from "canvas-confetti";

import { useMemoryGameStore } from "./store";
import { Modalities } from "./store";
import Image from "next/image";

export default function MemoryGame() {
  const loading = useMemoryGameStore((state) => state.loading);
  const shuffledIcons = useMemoryGameStore((state) => state.shuffledIcons);
  // const setShuffledIcons = useMemoryGameStore(
  //   (state) => state.setShuffledIcons
  // );
  const startGame = useMemoryGameStore((state) => state.startGame);

  const point = useMemoryGameStore((state) => state.point);
  const win = useMemoryGameStore((state) => state.win);
  const lose = useMemoryGameStore((state) => state.lose);
  const time = useMemoryGameStore((state) => state.time);
  const modality = useMemoryGameStore((state) => state.modality);
  const setModality = useMemoryGameStore((state) => state.setModality);
  const activeBalls = useMemoryGameStore((state) => state.activeBalls);
  const matchStatus = useMemoryGameStore((state) => state.matchStatus);
  const setMatchStatus = useMemoryGameStore((state) => state.setMatchStatus);

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Inizializza i suoni in modo sicuro (solo lato client)
  const sounds = useRef<Record<string, HTMLAudioElement | null>>({
    win: null,
    lose: null,
    progress: null,
    menu: null,
  });

  // Setup dei suoni quando il componente è montato nel browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("useEffect iniziale");

      sounds.current.win = new Audio("/music/win.mp3");
      sounds.current.lose = new Audio("/music/lose.mp3");
      sounds.current.progress = new Audio("/music/progress.mp3");
      sounds.current.menu = new Audio("/music/menu.mp3");
      if (sounds.current.progress || sounds.current.menu) {
        sounds.current.progress.loop = true;
      }
    }

    // Cleanup all'unmount
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!startGame) {
      playMatchSound("menu");
    }
  }, [startGame]);

  // Funzione per riprodurre il suono in base allo stato

  function playMatchSound(status: any | string) {
    const newAudio = sounds.current[status];

    if (!newAudio || currentAudioRef.current === newAudio) return;

    // Ferma e resetta l'audio corrente
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    currentAudioRef.current = newAudio;
    newAudio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });
  }

  const confettiRan = useRef(false); // Usa useRef per tenere traccia se i coriandoli sono già stati sparati

  useEffect(() => {
    if (matchStatus?.name === "progress") {
      playMatchSound("progress");
      // Reset animation flag così da poter riavviare animazioni future
      confettiRan.current = false;
      return; // esco subito perché non serve far partire confetti in "progress"
    }

    if (
      (matchStatus?.name === "win" || matchStatus?.name === "lose") &&
      !confettiRan.current
    ) {
      if (matchStatus?.name === "lose") {
        // dura 2 secondi
        const duration = 400;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        const frame = () => {
          const timeLeft = animationEnd - Date.now();
          const ticks = Math.max(200, 500 * (timeLeft / duration));
          //  esso genera valori casuali ma non minori di 0.8  se e minore viene mantenuto 0.8
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
    if (matchStatus?.name != "menu") {
      console.log(matchStatus?.name);
      playMatchSound(matchStatus?.name);
    }
  }, [matchStatus]);

  function restartGame() {
    setMatchStatus("menu");
    playMatchSound("menu");
  }

  return (
    <div>
      {!loading ? (
        <div className="max-w-8xl m-auto mt-5">
          <div className="max-w-6xl m-auto mt-5">
            <div
              className="flex flex-wrap justify-between sm:justify-between gap-4 p-4 w-full
            items-center text-center
            sm:text-left
            [&>*]:mx-auto sm:[&>*]:mx-0"
            >
              <div className="flex-col items-center">
                <div className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  <h4>Punti:</h4>
                  <span>{point}</span>
                </div>
                <div className="flex items-center gap-5 mt-2">
                  <div className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold">
                    <h4>Vinte:</h4>
                    <span>{win}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold">
                    <h4>Perse:</h4>
                    <span>{lose}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end  pr-4">
                <div className="flex flex-col items-center gap-2">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    Modalità
                  </h4>
                  <select
                    className="select px-2 rounded-full shadow-lg border-white border-2 text-white bg-transparent "
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
              className="w-full flex justify-center items-center "
              id="status-bar"
            >
              <div className="flex justify-center items-center gap-3 ">
                <Image
                  src="/timer.png"
                  alt="Timer"
                  className="timer"
                  width={30}
                  height={30}
                />
                <h4 className="sm:text-xl md:text-2xl font-bold text-primary">
                  {time}
                </h4>
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
            <div
              className={`
            grid gap-4
            ${modality.name === "easy" && "grid-cols-3 sm:grid-cols-3"}
            ${
              modality.name === "medium" &&
              "grid-cols-3 sm:grid-cols-4 md:grid-cols-4"
            }
            ${
              modality.name === "hard" &&
              "grid-cols-4 sm:grid-cols-4 md:grid-cols-6"
            }
            ${
              modality.name === "impossible" &&
              "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10"
            }
          `}
            >
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
      ) : (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <div className="flex space-x-2">
            <div className="w-5 h-5 bg-[#006335] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-5 h-5 bg-[#006335] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-5 h-5 bg-[#006335] rounded-full animate-bounce"></div>
          </div>
          <p className="text-lg text-white">Loading...</p>
        </div>
      )}

      {(matchStatus?.name === "win" || matchStatus?.name === "lose") && (
        <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center space-y-5 px-2">
            <h4 className="text-white text-xl md:text-3xl font-bold text-center">
              {matchStatus?.name === "win"
                ? "Hai Vinto Complimenti!"
                : "Hai Perso, andra meglio la prossima volta!"}
            </h4>
            <button
              onClick={() => {
                restartGame();
              }}
              className={`flex items-center px-2 md:px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring  focus:ring-opacity-80 hover:cursor-pointer ${
                matchStatus?.name === "win"
                  ? "bg-[#ffb300] hover:bg-[#ffa000] focus:ring-[#ffe082]"
                  : "bg-[#a41919] hover:bg-[#b91c1c] focus:ring-[#fca5a5]"
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
      {(matchStatus.name == "menu" || shuffledIcons.length == 0) && <Menu />}
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
      className="relative 
             w-[80px] h-[120px]              
             md:w-[100px] md:h-[150px]    
             lg:w-[120px] lg:h-[180px]   
             perspective cursor-pointer"
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
          <IconComponent
            className="w-8 h-8
             sm:w-10 sm:h-10
             md:w-10 md:h-10 
             lg:w-18 lg:h-18
             xl:w-23 xl:h-23"
          />
        </div>
      </div>
    </div>
  );
}
function Menu() {
  const setModality = useMemoryGameStore((state) => state.setModality);
  const setMatchStatus = useMemoryGameStore((state) => state.setMatchStatus);
  const setLoading = useMemoryGameStore((state) => state.setLoading);
  const shuffledIcons = useMemoryGameStore((state) => state.shuffledIcons);
  const setShuffledIcons = useMemoryGameStore(
    (state) => state.setShuffledIcons
  );
  const setStartGame = useMemoryGameStore((state) => state.setStartGame);
  const startGame = useMemoryGameStore((state) => state.startGame);

  function modalityAndSong(modalityName: string) {
    setModality(modalityName);

    if (shuffledIcons.length === 0) {
      setShuffledIcons();
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setMatchStatus("progress");
  }
  return (
    <div className="fixed inset-0 z-50 bg-black flex justify-center items-center">
      {!startGame ? (
        <div className="flex flex-col items-center justify-center space-y-5 px-2">
          <div className="flex flex-col items-center gap-2 space-y-3">
            <h4 className="text-3xl md:text-5xl font-bold text-primary mb-5">
              Scegli la tua Modalità
            </h4>

            <div className="flex flex-wrap justify-center gap-5 p-5">
              {" "}
              {/* Contenitore per i bottoni */}
              {Modalities.map((m) => (
                <button
                  key={m.name}
                  onClick={() => modalityAndSong(m.name)}
                  className={`
                  relative w-full max-w-sm h-20 flex items-center justify-center
                  text-2xl font-bold tracking-wide text-white capitalize
                  bg-[url('/card-front.jpg')] bg-cover bg-center bg-no-repeat
                  rounded-lg border-2 border-white overflow-hidden
                  hover:cursor-pointer hover:border-[#e0d080] hover:text-[#e0d080]
                
                `}
                >
                  {/* Overlay per l'effetto hover */}
                  <div
                    className={`
                  absolute inset-0 bg-black opacity-20 transition-opacity duration-300 hover:opacity-40 
                `}
                  ></div>
                  <span className="relative z-10">
                    {m.name.charAt(0).toUpperCase() + m.name.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-5 px-2">
          <div className="flex flex-col items-center gap-2 space-y-3">
            <h4 className="text-3xl md:text-5xl font-bold text-primary mb-5">
              Sei Pronto per iniziare ?
            </h4>

            <button
              onClick={() => setStartGame(false)}
              className="
                  relative w-full max-w-md h-20 flex items-center justify-center
                  text-2xl font-bold tracking-wide text-white capitalize
                  bg-[url('/card-front.jpg')] bg-cover bg-center bg-no-repeat
                  rounded-lg border-2 border-white overflow-hidden
                  hover:cursor-pointer hover:border-[#e0d080] hover:text-[#e0d080]
                
                "
            >
              <div
                className={`
                  absolute inset-0 bg-black opacity-20 transition-opacity duration-300 hover:opacity-40 
                `}
              ></div>
              <span className="relative z-10">Premi per iniziare</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
