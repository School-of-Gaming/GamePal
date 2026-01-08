import { useState } from "react";
import { ParentDashboard } from "./components/pages/ParentDashboard";
import { KidsManager } from "./components/pages/KidsManager";
import { Matchmaking } from "./components/pages/Matchmaking";
import { PotentialMatches } from "./components/pages/PotentialMatches";
import { ApprovedMatches } from "./components/pages/ApprovedMatches";
import { Notifications } from "./components/pages/Notifications";
import { ProfileSettings } from "./components/pages/ProfileSettings";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { Signup } from "./components/pages/Signup";

// ---------------- Types ----------------
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

// ---------------- Demo Parent ----------------
const demoParent: Parent = {
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
      games: ["Roblox", "Fortnite"],
      language: ["English"],
      hobbies: ["Sports", "Gaming"],
      interests: ["Competition", "Technology"],
      playType: ["Competitive"],
      theme: ["Fantasy"],
      availability: ["Weekdays (After School)", "Short Sessions"],
    },
  ],
};

// ---------------- App Component ----------------
export default function App() {
  const [parent, setParent] = useState<Parent | null>(null);
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "login"
    | "signup"
    | "dashboard"
    | "kids"
    | "matchmaking"
    | "potential-matches"
    | "approved-matches"
    | "notifications"
    | "settings"
  >("home");

  // ---------------- Handlers ----------------
  const handleLogin = (parentData?: Parent) => {
    setParent(parentData || demoParent); 
    setCurrentPage("dashboard");
  };

  const handleSignup = (parentData?: Parent) => {
    setParent(parentData || demoParent);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setParent(null);
    setCurrentPage("home");
  };

  // ---------------- Render ----------------
  if (!parent) {
    if (currentPage === "home") {
      return (
        <Home
          onLogin={(parent) => handleLogin(parent)}
          onSignup={(parent) => handleSignup(parent)}
        />
      );
    }

    if (currentPage === "login") {
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => setCurrentPage("home")}
          onGoToSignup={() => setCurrentPage("signup")}
        />
      );
    }

    if (currentPage === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onBack={() => setCurrentPage("home")}
          onGoToLogin={() => setCurrentPage("login")}
        />
      );
    }
  }


  if (parent) {
    if (currentPage === "dashboard") {
      return (
        <ParentDashboard
          parent={parent}
          onLogout={handleLogout} 
          onGoToKidsManager={() => setCurrentPage("kids")}
          onGoToMatchmaking={() => setCurrentPage("matchmaking")}
          onGoToPotentialMatches={() => setCurrentPage("potential-matches")}
          onGoToApprovedMatches={() => setCurrentPage("approved-matches")}
          onGoToNotifications={() => setCurrentPage("notifications")}
          onGoToSettings={() => setCurrentPage("settings")}
        />
      );
    }

    if (currentPage === "kids") {
      return (
        <KidsManager
          parent={parent}
          onBack={() => setCurrentPage("dashboard")}
          onUpdateParent={setParent}
        />
      );
    }

    if (currentPage === "matchmaking") {
      return <Matchmaking parent={parent} onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "potential-matches") {
      return <PotentialMatches parent={parent} onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "approved-matches") {
      return <ApprovedMatches parent={parent} onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "notifications") {
      return <Notifications parent={parent} onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "settings") {
      return <ProfileSettings parent={parent} onBack={() => setCurrentPage("dashboard")} />;
    }
  }

  return null;
}
