import { useState  } from "react";
import type { Child, Parent } from "../../App";
import { EditChildProfile } from "./EditChildProfile";
//import { supabase } from "../../supabase/client";

// --- Props ---
type AddChildProfileProps = {
  parent: Parent;
  onClose: () => void;
  onSave: (newChild: Child) => void;
};

// --- Empty Child Template ---
const emptyChild: Omit<Child, "id"> = {
  parent_id: "",
  name: "",
  age: 5,
  bio: "",
  games_ids: [],
  language_ids: [],
  hobbies_ids: [],
  interests_ids: [],
  play_type_ids: [],
  theme_ids: [],
  availability_ids: [],
  avatar_id: undefined,
};

// --- Component ---
export function AddChildProfile({ parent, onClose, onSave }: AddChildProfileProps) {
  const [loading, setLoading] = useState(false);


  return (
    <EditChildProfile
      child={emptyChild}
      parent={parent}
      onClose={onClose}
      onSave={(newChild) => {
        onSave(newChild); 
      }}
      loading={loading}
    />
  );
}
