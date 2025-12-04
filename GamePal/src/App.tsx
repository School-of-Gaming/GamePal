import { useState } from "react";
import { ParentDashboard } from "./components/parent/ParentDashboard";
import { KidsManager } from "./components/parent/KidsManager";
import type { Parent } from "./App";

export type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
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
        name: "Bob",
        age: 8,
        avatar: "🦁",
        games: ["Minecraft"],
        bio: "Loves building castles",
        language: ["English"],
        hobbies: ["Drawing"],
        interests: ["Animals"],
        playType: ["Creative"],
        theme: ["Fantasy"],
      },
    ],
  });

  const [currentPage, setCurrentPage] = useState<"dashboard" | "kids">("dashboard");

  return (
    <>
      {currentPage === "dashboard" && (
        <ParentDashboard
          parent={parent}
          onGoToKidsManager={() => setCurrentPage("kids")}
        />
      )}

      {currentPage === "kids" && (
        <KidsManager
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
          onUpdateParent={setParent} 
        />
      )}
    </>
  );
}
