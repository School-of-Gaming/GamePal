import { useState } from "react";
import type { Child, Parent } from "../../App";
import { EditChildProfile } from "./EditChildProfile";
import { supabase } from "../../supabase/client";

// --- Props ---
type AddChildProfileProps = {
  parent: Parent;
  onClose: () => void;
  onSave: (newChild: Child) => void;
};

// --- Empty Child Template ---
const emptyChild: Omit<Child, "id"> = {
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
  const [loading, setLoading] = useState(false);

  const handleSave = async (child: Omit<Child, "id">) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("children")
      .insert({
        ...child,
        parent_id: parent.id,
        play_type: child.playType[0] || null, 
        theme: child.theme[0] || null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert("Error saving child: " + error.message);
      return;
    }

    onSave({
      id: data.id,
      name: data.name,
      age: data.age,
      avatar: data.avatar || "🧒",
      bio: data.bio || "",
      games: data.games || [],
      language: data.language || [],
      hobbies: data.hobbies || [],
      interests: data.interests || [],
      playType: data.play_type ? [data.play_type] : [],
      theme: data.theme ? [data.theme] : [],
      availability: data.availability || [],
    });

    onClose();
  };

  return (
    <EditChildProfile
      child={{ ...emptyChild, id: "" }}
      parent={parent}
      onClose={onClose}
      onSave={handleSave}
      loading={loading}
    />
  );
}
