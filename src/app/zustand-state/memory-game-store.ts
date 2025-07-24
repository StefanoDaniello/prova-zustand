import { create } from "zustand";
import { ReactNode, ElementType, JSX } from "react";
import {
  Heart,
  Star,
  Moon,
  Sun,
  Camera,
  Bell,
  Smile,
  Cloud,
  Folder,
  Globe,
  Home,
  Rocket,
  BowArrow,
  Sword,
  Flame,
  Ghost,
  Gift,
  Hand,
  Headphones,
  Key,
  Leaf,
  Lock,
  Magnet,
  Map,
  Palette,
  Paperclip,
  Shield,
  ShoppingCart,
  ThumbsUp,
  Watch,
} from "lucide-react";
import { match } from "assert";

const baseIcons: IconItem[] = [
  { id: 1, name: "heart", icon: Heart, flipped: false, matched: false },
  { id: 2, name: "star", icon: Star, flipped: false, matched: false },
  { id: 3, name: "moon", icon: Moon, flipped: false, matched: false },
  { id: 4, name: "sun", icon: Sun, flipped: false, matched: false },
  { id: 5, name: "camera", icon: Camera, flipped: false, matched: false },
  { id: 6, name: "bell", icon: Bell, flipped: false, matched: false },
  { id: 7, name: "smile", icon: Smile, flipped: false, matched: false },
  { id: 8, name: "cloud", icon: Cloud, flipped: false, matched: false },
  { id: 9, name: "folder", icon: Folder, flipped: false, matched: false },
  { id: 10, name: "globe", icon: Globe, flipped: false, matched: false },
  { id: 11, name: "home", icon: Home, flipped: false, matched: false },
  { id: 12, name: "rocket", icon: Rocket, flipped: false, matched: false },
  { id: 13, name: "bow-arrow", icon: BowArrow, flipped: false, matched: false },
  { id: 14, name: "sword", icon: Sword, flipped: false, matched: false },
  { id: 15, name: "flame", icon: Flame, flipped: false, matched: false },
  { id: 16, name: "ghost", icon: Ghost, flipped: false, matched: false },
  { id: 17, name: "gift", icon: Gift, flipped: false, matched: false },
  { id: 18, name: "hand", icon: Hand, flipped: false, matched: false },
  {
    id: 19,
    name: "headphones",
    icon: Headphones,
    flipped: false,
    matched: false,
  },
  { id: 20, name: "key", icon: Key, flipped: false, matched: false },
  { id: 21, name: "leaf", icon: Leaf, flipped: false, matched: false },
  { id: 22, name: "lock", icon: Lock, flipped: false, matched: false },
  { id: 23, name: "magnet", icon: Magnet, flipped: false, matched: false },
  { id: 24, name: "map", icon: Map, flipped: false, matched: false },
  { id: 25, name: "palette", icon: Palette, flipped: false, matched: false },
  {
    id: 26,
    name: "paperclip",
    icon: Paperclip,
    flipped: false,
    matched: false,
  },
  { id: 27, name: "shield", icon: Shield, flipped: false, matched: false },
  {
    id: 28,
    name: "shopping-cart",
    icon: ShoppingCart,
    flipped: false,
    matched: false,
  },
  { id: 29, name: "thumbs-up", icon: ThumbsUp, flipped: false, matched: false },
  { id: 30, name: "watch", icon: Watch, flipped: false, matched: false },
];

type IconItem = {
  id: number;
  name: string;
  icon: ElementType;
  flipped: boolean;
  matched: boolean;
};

type ModalityOption = {
  name: "easy" | "medium" | "hard" | "impossible";
  cardNumber: number;
  time: string;
  col: string;
};

type MatchStatusOption = {
  name: "win" | "lose" | "progress";
};

type MemoryGameStore = {
  shuffledIcons: IconItem[];
  flippedCardsInTurn: IconItem[];
  setShuffledIcons: () => void;
  flipCard: (id: number) => void;
  checkMatchCard: () => void;
  canFlip: boolean;
  reShuffleBoard: () => void;
  point: number;
  win: number;
  lose: number;
  activeBalls: number;
  time: string;
  setTime: (time: string, resetInterval?: boolean) => void;
  matchStatus: MatchStatusOption;
  setMatchStatus: (name: string) => void;
  modality: ModalityOption;
  setModality: (name: string) => void;
  countdownIntervalId: any;
};

export const Modalities: ModalityOption[] = [
  { name: "easy", cardNumber: 6, time: "0:10", col: "3" },
  { name: "medium", cardNumber: 12, time: "1:30", col: "4" },
  { name: "hard", cardNumber: 18, time: "1:50", col: "6" },
  { name: "impossible", cardNumber: 30, time: "1:70", col: "10" },
];

export const MatchStatuses: MatchStatusOption[] = [
  { name: "progress" },
  { name: "win" },
  { name: "lose" },
];
// Funzione per mischiare un array
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Funzione helper per formattare i secondi in "MM:SS"
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // Aggiungi uno zero iniziale se il numero è < 10
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Creazione dello store Zustand ,set setta lo stato , get  restituisce il valore
export const useMemoryGameStore = create<MemoryGameStore>((set, get) => ({
  shuffledIcons: [],
  flippedCardsInTurn: [],
  canFlip: true,
  point: 0,
  win: 0,
  lose: 0,
  activeBalls: 10,
  time: "00:00",
  modality: Modalities[0],
  matchStatus: MatchStatuses[0],
  countdownIntervalId: null,

  setModality: (name) => {
    const { setShuffledIcons, setTime, modality, countdownIntervalId } = get();
    const selectModality = Modalities.find((modality) =>
      modality.name == name ? modality : null
    );
    set({
      modality: selectModality,
    });
    setShuffledIcons();
    setTime(selectModality?.time ? selectModality?.time : modality.time);
  },

  setTime: (selectTime, resetInterval) => {
    const { countdownIntervalId, setMatchStatus } = get();

    // 1. Pulisci qualsiasi intervallo precedente per evitare più timer contemporanei
    if (countdownIntervalId || resetInterval) {
      clearInterval(countdownIntervalId);
      set({ countdownIntervalId: null }); // Resetta l'ID nello stato
    }
    // 2. Converti la stringa "MM:SS" in secondi totali
    const parts = selectTime.split(":");
    let totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

    // ✅ Memorizza il tempo iniziale del countdown (per il calcolo dei pallini)
    const initialCountdownSeconds = totalSeconds;
    const numberOfBalls = 10; // Il numero totale di pallini

    // ✅ Calcola ogni quanti secondi un pallino deve spegnersi
    // Usiamo Math.max(1, ...) per evitare divisioni per zero o intervalli troppo piccoli
    // se il tempo iniziale è molto breve. Ogni pallino non si spengera' piu' velocemente di 1 secondo.
    const secondsPerBall =
      initialCountdownSeconds > 0
        ? Math.max(1, Math.ceil(initialCountdownSeconds / numberOfBalls))
        : 0; // Se il tempo iniziale è 0, non ci sono secondi per pallino.

    // Imposta immediatamente il tempo iniziale e tutti i pallini accesi
    set({
      time: formatTime(totalSeconds),
      activeBalls: numberOfBalls, // Tutti i pallini accesi all'inizio
    });

    // 4. Avvia il countdown
    const newIntervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1; // Decrementa di un secondo

        // ✅ Nuova logica per aggiornare i pallini
        let currentActiveBalls = numberOfBalls;

        if (secondsPerBall > 0) {
          // Calcola quanti blocchi di tempo sono trascorsi
          const elapsedBlocks = Math.floor(
            (initialCountdownSeconds - totalSeconds) / secondsPerBall
          );
          currentActiveBalls = Math.max(0, numberOfBalls - elapsedBlocks);
        } else if (totalSeconds === 0) {
          // Caso speciale per tempo iniziale 0
          currentActiveBalls = 0;
        }

        set({
          time: formatTime(totalSeconds),
          activeBalls: currentActiveBalls, // Aggiorna il numero di pallini attivi
        });
      } else {
        // 5. Tempo scaduto!
        set({ canFlip: false });

        //permette di leggere lo stato corrente del tuo store al di fuori della funzione set.
        const checkshuffledIcons = get().shuffledIcons;
        // Allo scadere del tempo appena trova una card con match a a flse imposta la partita a lose
        for (const card of checkshuffledIcons) {
          if (!card.matched) {
            setMatchStatus("lose");
            break;
          }
        }

        clearInterval(newIntervalId); // Ferma il timer
        set({
          countdownIntervalId: null, // Resetta l'ID del timer
          time: "00:00", // Assicurati che il tempo finale sia 00:00
          activeBalls: 0, // Tutti i pallini spenti
        });
      }
    }, 1000); // Esegui ogni 1000 millisecondi (1 secondo)

    set({ countdownIntervalId: newIntervalId });
  },

  setMatchStatus: (name) => {
    const { setShuffledIcons } = get();

    switch (name) {
      case "progress":
        set({
          matchStatus: MatchStatuses[0],
        });
        setShuffledIcons();
        break;
      case "win":
        set((state) => ({
          win: state.win + 1,
        }));
        break;
      case "lose":
        set((state) => ({
          lose: state.lose + 1,
        }));
        break;
    }
    set({
      matchStatus: MatchStatuses.find((matchStatus) =>
        matchStatus.name == name ? matchStatus : null
      ),
    });
  },

  setShuffledIcons: () => {
    const { modality, setTime } = get();
    const modalityTime = modality.time;
    setTime(modalityTime);
    const cardNumber = modality.cardNumber / 2;
    const selected = shuffle(baseIcons).slice(0, cardNumber);
    const duplicated = [...selected, ...selected].map((item, index) => ({
      ...item,
      id: index + 1, // Assegna ID univoci da 1 a 12
      flipped: false,
      matched: false,
    }));
    const shuffled = shuffle(duplicated);
    set({
      shuffledIcons: shuffled,
      flippedCardsInTurn: [],
      canFlip: true,
    });
  },

  flipCard: (id) => {
    const { shuffledIcons, canFlip, checkMatchCard } = get();

    // Impedisci di girare se non permesso (es. durante il ritardo del confronto)
    if (!canFlip) {
      console.log("Non puoi girare: stai controllando la corrispondenza.");
      return;
    }

    // Trova la carta da girare
    const cardToFlip = shuffledIcons.find((card: IconItem) => card.id == id);

    // Se la carta non è trovata, o è già girata, o è già abbinata, non fare nulla
    if (!cardToFlip || cardToFlip.flipped || cardToFlip.matched) {
      console.log(
        "La carta non può essere girata (già girata/abbinata o non trovata)."
      );
      return;
    }

    set((state) => {
      // 1. Contrassegna la carta selezionata come girata nell'array principale shuffledIcons
      const newShuffledIcons = state.shuffledIcons.map((card) =>
        card.id == id ? { ...card, flipped: true } : card
      );

      // 2. Aggiunge la carta appena girata all'array temporaneo flippedCardsInTurn
      const newFlippedCardsInTurn = [
        ...state.flippedCardsInTurn,
        { ...cardToFlip, flipped: true },
      ];

      // Restituisci lo stato aggiornato
      return {
        shuffledIcons: newShuffledIcons,
        flippedCardsInTurn: newFlippedCardsInTurn,
      };
    });

    // Dopo l'aggiornamento dello stato, controlla il numero di carte girate nel turno
    // Questa parte viene eseguita dopo che la chiamata `set` completa il suo aggiornamento.

    // get(): Questa è una funzione che ti permette di leggere lo stato corrente del tuo store al di fuori della funzione set.
    const updatedFlippedCardsInTurn = get().flippedCardsInTurn;

    if (updatedFlippedCardsInTurn.length === 2) {
      // Se due carte sono girate, disabilita temporaneamente la possibilità di girare altre carte
      set({ canFlip: false });
      // Chiama checkForMatch dopo un breve ritardo per permettere all'utente di vedere la seconda carta
      setTimeout(() => {
        checkMatchCard();
      }, 600); // Ritardo di 0.6 secondo per l'effetto visivo
    }
  },

  checkMatchCard: () => {
    const {
      flippedCardsInTurn,
      reShuffleBoard,
      setMatchStatus,
      setShuffledIcons,
      setTime,
    } = get();

    if (flippedCardsInTurn.length !== 2) {
      console.error(
        "checkForMatch chiamato con meno/più di 2 carte in flippedCardsInTurn. Resetto."
      );
      set({ flippedCardsInTurn: [], canFlip: true }); // Resetta in caso di errore e riabilita il flip
      return;
    }

    const [card1, card2] = flippedCardsInTurn;

    if (card1.name === card2.name) {
      // È una corrispondenza!
      set((state) => ({
        shuffledIcons: state.shuffledIcons.map((card) =>
          card.id === card1.id || card.id === card2.id
            ? { ...card, matched: true } // Contrassegna entrambe le carte come abbinate
            : card
        ),
        flippedCardsInTurn: [], // Pulisce l'array temporaneo
        canFlip: true,
        point: state.point + 1,
      }));
      console.log(`Corrispondenza trovata: ${card1.name}`);
    } else {
      // Nessuna corrispondenza. Girale di nuovo a faccia in giù.
      set((state) => ({
        shuffledIcons: state.shuffledIcons.map((card) =>
          card.id === card1.id || card.id === card2.id
            ? { ...card, flipped: false } // Girale di nuovo a faccia in giù
            : card
        ),
        flippedCardsInTurn: [], // Pulisce l'array temporaneo
        canFlip: true,
      }));
      console.log(`Nessuna corrispondenza: ${card1.name} vs ${card2.name}`);
    }

    // Step 2: Ottieni lo stato aggiornato dopo il primo 'set'
    // Questo è importante per avere la visione più recente delle carte abbinate
    const currentShuffledIconsAfterFlip = get().shuffledIcons;
    const unmatchedCards = currentShuffledIconsAfterFlip.filter(
      (card) => !card.matched
    );

    // Step 3: Controlla se rimangono esattamente 2 carte non abbinate
    if (unmatchedCards.length === 2) {
      console.log(
        "Rimanenti solo 2 carte non abbinate. Le abbino automaticamente."
      );
      // Forza l'abbinamento e la visualizzazione delle ultime due carte
      set((state) => ({
        shuffledIcons: state.shuffledIcons.map((card) =>
          // Se la carta non è ancora abbinata, la flippa e la marca come abbinata
          !card.matched ? { ...card, flipped: true, matched: true } : card
        ),
        point: state.point + 1,
        // Non è necessario toccare flippedCardsInTurn o canFlip qui,
        // sono già stati gestiti dal set precedente e il gioco è quasi finito.
      }));

      //permette di leggere lo stato corrente del tuo store al di fuori della funzione set.
      const checkshuffledIcons = get().shuffledIcons;
      // Allo scadere del tempo appena trova una card con match a a flse imposta la partita a lose
      const allMatched = checkshuffledIcons.every((card) => card.matched);
      if (allMatched) {
        setMatchStatus("win");
        setTime("00:00", true);
      }
    } else {
      // setTimeout(() => {
      //   reShuffleBoard();
      // }, 450);
      // Ritardo di 0.5 secondo per l'effetto visivo
    }
  },

  reShuffleBoard: () => {
    set((state) => {
      const currentShuffledIcons = state.shuffledIcons;
      const newShuffledIconsArray = Array<IconItem>(
        currentShuffledIcons.length
      );
      const unmatchedCardsToShuffle: IconItem[] = [];
      const unmatchedIndices: number[] = [];

      // ciclo su tutto l' array
      currentShuffledIcons.forEach((card, index) => {
        // Se la card e in match la riposizione nel suo indice
        if (card.matched) {
          newShuffledIconsArray[index] = card;
        } else {
          unmatchedCardsToShuffle.push(card);
          unmatchedIndices.push(index);
        }
      });

      // Rimescola solo le carte non abbinate
      const shuffledUnmatchedCards = shuffle(unmatchedCardsToShuffle);

      // Ciclo sugli indice originali e vado a posizionare una card nuova
      unmatchedIndices.forEach((originalIndex, i) => {
        newShuffledIconsArray[originalIndex] = shuffledUnmatchedCards[i];
      });

      return {
        shuffledIcons: newShuffledIconsArray,
        canFlip: true,
      };
    });
  },
}));
