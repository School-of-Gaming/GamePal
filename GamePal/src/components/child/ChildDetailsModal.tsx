import { Button } from "../ui/button";
import type { Child } from "../../App";
import type { MatchChild } from "../pages/Matchmaking"


type ChildDetailsModalProps = {
  child: Child | MatchChild;
  onClose: () => void;
};

export function ChildDetailsModal({ child, onClose }: ChildDetailsModalProps) {
  const games = "games" in child ? child.games : child.games_ids ?? [];
  const language = "languages" in child ? child.languages : child.language_ids ?? [];
  const hobbies = "hobbies" in child ? child.hobbies : child.hobbies_ids ?? [];
  const interests = "interests" in child ? child.interests : child.interests_ids ?? [];
  const playType = "play_types" in child ? child.play_types : child.play_type_ids ?? [];
  const theme = "themes" in child ? child.themes : child.theme_ids ?? [];
  const availability = "availability" in child ? child.availability : child.availability_ids ?? [];
  const avatar = "avatar" in child ? child.avatar : "emoji" in child ? (child as any).emoji : "🧒"; 
  const bio = "bio" in child ? child.bio : "";
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl relative max-h-[85vh] flex flex-col">

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1">

          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-black">{child.name}</h2>
              <p className="text-base text-gray-500">Age: {child.age}</p>
            </div>
          </div>

          {/* About */}
          <h3 className="text-lg font-bold mb-1 border-b pb-1 text-black">
            About
          </h3>
          <p className="text-sm text-gray-700 mb-4">{bio}</p>

          {/* Sections */}
          <div className="space-y-3">

            <Section title="Games" items={games} />
            <Section title="Languages" items={language} />
            <Section title="Hobbies" items={hobbies} />
            <Section title="Interests" items={interests} />
            <Section title="Play Type" items={playType} />
            <Section title="Theme" items={theme} />
            <Section title="Availability" items={availability} />

          </div>
        </div>

        {/* FOOTER */}
        <Button
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
          onClick={onClose}
        >
          Close
        </Button>

      </div>
    </div>
  );
}

/* 🔹 Small helper component */
function Section({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <strong className="text-sm w-full text-black">{title}:</strong>
      {items.map((item, index) => (
        <span
          key={index}
          className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
