"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header>
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
          <a
            href="/"
            className={`mx-1.5 sm:mx-6 border-b-2 transition-colors duration-300 transform ${
              pathname === "/"
                ? "border-blue-500 text-gray-800 dark:text-gray-200"
                : "border-transparent hover:border-blue-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Home
          </a>
          <a
            href="/memory-game"
            className={`mx-1.5 sm:mx-6 border-b-2 transition-colors duration-300 transform ${
              pathname === "/memory-game"
                ? "border-blue-500 text-gray-800 dark:text-gray-200"
                : "border-transparent hover:border-blue-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Memory Game
          </a>
        </div>
      </nav>
    </header>
  );
}
