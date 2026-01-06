import { Button } from "../ui/button";
import type { Child } from "../../App";

type ChildDetailsModalProps = {
  child: Child;
  onClose: () => void;
};

export function ChildDetailsModal({ child, onClose }: ChildDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl relative max-h-[85vh] flex flex-col">

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1">

          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{child.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-black">{child.name}</h2>
              <p className="text-base text-gray-500">Age: {child.age}</p>
            </div>
          </div>

          {/* About */}
          <h3 className="text-lg font-bold mb-1 border-b pb-1 text-black">
            About
          </h3>
          <p className="text-sm text-gray-700 mb-4">{child.bio}</p>

          {/* Sections */}
          <div className="space-y-3">

            <Section title="Games" items={child.games} />
            <Section title="Languages" items={child.language} />
            <Section title="Hobbies" items={child.hobbies} />
            <Section title="Interests" items={child.interests} />
            <Section title="Play Type" items={child.playType} />
            <Section title="Theme" items={child.theme} />
            <Section title="Availability" items={child.availability} />

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
