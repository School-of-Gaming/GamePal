import { useState } from "react";
import { ParentDashboard } from "./components/pages/ParentDashboard";
import { KidsManager } from "./components/pages/KidsManager";
import { Matchmaking } from "./components/pages/Matchmaking";
import { PotentialMatches } from "./components/pages/PotentialMatches";
import { ApprovedMatches } from "./components/pages/ApprovedMatches";
import { Notifications } from "./components/pages/Notifications";
import { ProfileSettings } from "./components/pages/ProfileSettings";
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
  availability: string[];
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
    name: "Alice Smith",
    email: "alice.smith@example.com",
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
        availability: ['Weekdays (After School)' , 'Short Sessions'],
      },
    ],
  });

  const [currentPage, setCurrentPage] = useState<"dashboard" | "kids" | "matchmaking" | "potential-matches" | "approved-matches" | "notifications" | "settings">("dashboard");

  return (
    <>
      {currentPage === "dashboard" && (
        <ParentDashboard
          parent={parent}
          onGoToKidsManager={() => setCurrentPage("kids")}
          onGoToMatchmaking={() => setCurrentPage("matchmaking")}
          onGoToPotentialMatches={() => setCurrentPage("potential-matches")}
          onGoToApprovedMatches={() => setCurrentPage("approved-matches")}
          onGoToNotifications={() => setCurrentPage("notifications")}
          onGoToSettings={() => setCurrentPage("settings")}
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

      {currentPage === "potential-matches" && (
        <PotentialMatches
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
        />
      )}

      {currentPage === "approved-matches" && (
        <ApprovedMatches
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
        />
      )}

      {currentPage === "notifications" && (
        <Notifications 
          parent={parent}
          onBack={() => setCurrentPage("dashboard")} 
        />
      )}

      {currentPage === "settings" && (
        <ProfileSettings
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
        />
      )}




    </>
  );
}
