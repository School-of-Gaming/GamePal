import { useState, useEffect  } from "react";
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
import { supabase } from './supabase/client';

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
  const handleLogin = async (parentData?: Parent) => {
    if (parentData) {
      // Login called with full Parent object (from Login.tsx or Signup.tsx)
      setParent(parentData);
      setCurrentPage("dashboard");
      return;
    }

    // Otherwise, try auto-login (magic link / already signed in)
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;

    // Fetch parent profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!profile) return;

    // Fetch children
    const { data: childrenData } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", profile.id);

    setParent({
      id: profile.id,
      name: profile.full_name,
      email: user.email || "",
      children: (childrenData || []).map(c => ({
        id: c.id,
        name: c.name,
        age: c.age,
        avatar: c.avatar || "🧒",
        bio: c.bio || "",
        games: c.games || [],
        language: c.language || [],
        hobbies: c.hobbies || [],
        interests: c.interests || [],
        playType: c.play_type ? [c.play_type] : [],
        theme: c.theme ? [c.theme] : [],
        availability: c.availability || [],
      }))
    });

    setCurrentPage("dashboard");
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = async (parentData: Parent) => {
    // parentData comes from Signup.tsx after Supabase signup & profile creation
    setParent(parentData);
    setCurrentPage("dashboard");
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setParent(null);
    setCurrentPage("home");
  };

  // ---------------- MAGIC LINK / AUTO LOGIN ----------------
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") handleLogin();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------------- Render ----------------
  if (!parent) {
    if (currentPage === "home") {
      return (
        <Home
          onLogin={() => setCurrentPage("login")}
          onSignup={() => setCurrentPage("signup")}
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
