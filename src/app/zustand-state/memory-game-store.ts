import { create } from "zustand";
import { ReactNode, ElementType } from "react";
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
} from "lucide-react";

// Array base di icone
const baseIcons: IconItem[] = [
  { id: 1, name: "heart", icon: Heart, flipped: false },
  { id: 2, name: "star", icon: Star, flipped: false },
  { id: 3, name: "moon", icon: Moon, flipped: false },
  { id: 4, name: "sun", icon: Sun, flipped: false },
  { id: 5, name: "camera", icon: Camera, flipped: false },
  { id: 6, name: "bell", icon: Bell, flipped: false },
  { id: 7, name: "smile", icon: Smile, flipped: false },
  { id: 8, name: "cloud", icon: Cloud, flipped: false },
  { id: 9, name: "folder", icon: Folder, flipped: false },
  { id: 10, name: "globe", icon: Globe, flipped: false },
  { id: 11, name: "home", icon: Home, flipped: false },
  { id: 12, name: "rocket", icon: Rocket, flipped: false },
  { id: 13, name: "bow-arrow", icon: BowArrow, flipped: false },
  { id: 14, name: "sword", icon: Sword, flipped: false },
];

type IconItem = {
  id: number;
  name: string;
  icon: ElementType;
  flipped: boolean;
};

type MemoryGameStore = {
  shuffledIcons: IconItem[];
  setShuffledIcons: () => void;
  flipCard: (id: number) => void;
};

// Funzione per mischiare un array
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Creazione dello store Zustand
export const useMemoryGameStore = create<MemoryGameStore>((set) => ({
  shuffledIcons: [],
  setShuffledIcons: () => {
    const selected = shuffle(baseIcons).slice(0, 6);
    const duplicated = [...selected, ...selected].map((item, index) => ({
      ...item,
      id: index + 1, // Assegna ID univoci da 1 a 12
      flipped: false,
    }));
    const shuffled = shuffle(duplicated);
    set({ shuffledIcons: shuffled });
  },

  // quando si trova una coppia di card con lo stesso nome si segna a true flipped
  flipCard: (id) =>
    set((state) => ({
      shuffledIcons: state.shuffledIcons.map((card) =>
        card.id === id ? { ...card, flipped: !card.flipped } : card
      ),
    })),
}));
