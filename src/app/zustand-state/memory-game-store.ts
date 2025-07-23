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
  isActive: boolean;
};

type MatchStatusOption = {
  name: "win" | "lose" | "progress";
  isActive: boolean;
};

type MemoryGameStore = {
  shuffledIcons: IconItem[];
  flippedCardsInTurn: IconItem[]; // controlla a turni le 2 card dell utente
  setShuffledIcons: () => void;
  flipCard: (id: number) => void;
  checkMatchCard: () => void; // Controlla se le due carte girate corrispondono
  canFlip: boolean;
  reShuffleBoard: () => void;

  point: number;
  win: number;
  lose: number;
  time: string;
  matchStatus: MatchStatusOption;
  setMatchStatus: () => void;
  modality: ModalityOption;
  setModality: () => void;
};

// Funzione per mischiare un array
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Creazione dello store Zustand ,set setta lo stato , get  restituisce il valore
export const useMemoryGameStore = create<MemoryGameStore>((set, get) => ({
  shuffledIcons: [],
  flippedCardsInTurn: [],
  canFlip: true,
  point: 0,
  win: 0,
  lose: 0,
  time: "3:20",
  modality: { name: "easy", isActive: false },
  matchStatus: { name: "progress", isActive: false },

  setMatchStatus: () => {},
  setModality: () => {},

  setShuffledIcons: () => {
    const selected = shuffle(baseIcons).slice(0, 6);
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

  // quando si trova una coppia di card con lo stesso nome si segna a true flipped
  flipCard: (id) => {
    const { shuffledIcons, flippedCardsInTurn, canFlip, checkMatchCard } =
      get();

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
      }, 800); // Ritardo di 0.8 secondo per l'effetto visivo
    }
  },

  checkMatchCard: () => {
    const { flippedCardsInTurn, reShuffleBoard, shuffledIcons } = get();

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
        // Non è necessario toccare flippedCardsInTurn o canFlip qui,
        // sono già stati gestiti dal set precedente e il gioco è quasi finito.
      }));
    } else {
      setTimeout(() => {
        reShuffleBoard();
      }, 500); // Ritardo di 0.5 secondo per l'effetto visivo
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
