import { useState } from "react";
import type { Child, Parent } from "../../App";
import { EditChildProfile } from "./EditChildProfile";

// --- Props ---
type AddChildProfileProps = {
  parent: Parent;
  onClose: () => void;
  onSave: (newChild: Child) => void;
};

// --- Empty Child Template ---
const emptyChild: Child = {
  id: crypto.randomUUID(),
  name: "",
  age: 0,
  avatar: "🧒",
  bio: "",
  games: [],
  language: [],
  hobbies: [],
  interests: [],
  playType: [],
  theme: [],
  availability: [],
};

// --- Component ---
export function AddChildProfile({ parent, onClose, onSave }: AddChildProfileProps) {
  const [newChild, setNewChild] = useState<Child>(emptyChild);

  const handleSave = (child: Child) => {
    onSave(child);
    onClose();
  };

  return (
    <EditChildProfile
      child={newChild}
      parent={parent}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}
