import { useState } from "react";
import { ParentDashboard } from "./components/parent/ParentDashboard";
import { KidsManager } from "./components/parent/KidsManager";
import { Matchmaking } from "./components/parent/Matchmaking";
import type { Child, Parent } from "./App";

export type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  commonTags?: string[];
  games: string[];
  bio: string;
  language: string[];
  hobbies: string[];
  interests: string[];
  playType: string[];
  theme: string[];
};

export type Parent = {
  id: string;
  name: string;
  email: string;
  children: Child[];
};


export default function App() {
  const [parent, setParent] = useState<Parent>({
    id: "p1",
    name: "Alice",
    email: "alice@example.com",
    children: [
      {
        id: "c1",
        name: "Taylor",
        age: 8,
        avatar: "🦁",
        bio: "Competitive gamer who loves team play!",
        games: ['Roblox', 'Fortnite'],
        language: ["English"],
        hobbies: ['Sports', 'Gaming'],
        interests: ['Competition', 'Technology'],
        playType: ['Competitive'],
        theme: ["Fantasy"],
      },
    ],
  });

  const [currentPage, setCurrentPage] = useState<"dashboard" | "kids" | "matchmaking">("dashboard");

  return (
    <>
      {currentPage === "dashboard" && (
        <ParentDashboard
          parent={parent}
          onGoToKidsManager={() => setCurrentPage("kids")}
          onGoToMatchmaking={() => setCurrentPage("matchmaking")}
        />
      )}

      {currentPage === "kids" && (
        <KidsManager
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
          onUpdateParent={setParent} 
        />
      )}

      {currentPage === "matchmaking" && (
        <Matchmaking
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
        />
      )}
    </>
  );
}
