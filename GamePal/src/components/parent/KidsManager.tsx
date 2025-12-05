import type { Parent, Child } from "../../App";
import { ParentNav } from "./ParentNav";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";

type KidsManagerProps = {
  parent: Parent;
  onBack: () => void;
  onUpdateParent: (parent: Parent) => void;
};

export function KidsManager({ parent, onBack, onUpdateParent }: KidsManagerProps) {
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [bioInput, setBioInput] = useState("");

  const startEditing = (child: Child) => {
    setEditingChildId(child.id);
    setBioInput(child.bio);
  };

  const saveBio = (child: Child) => {
    const updatedChildren = parent.children.map((c) =>
      c.id === child.id ? { ...c, bio: bioInput } : c
    );
    onUpdateParent({ ...parent, children: updatedChildren });
    setEditingChildId(null);
    setBioInput("");
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} />

      <main className="flex-1 w-full p-6 overflow-auto">
        <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-white hover:text-[#faa901]"
            >
            &larr; Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Kids Manager</h1>
          <p className="text-gray-700 mb-4">Manage your children's profiles</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parent.children.length === 0 ? (
            <div className="p-6 rounded-2xl shadow-md bg-gray-200 text-center">
              <p className="text-gray-700">No children added yet.</p>
            </div>
          ) : (
            parent.children.map((child) => (
              <div key={child.id} className="p-6 rounded-2xl shadow-md bg-gray-200 text-left">
                {/* Avatar & Name */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{child.avatar}</div>
                    <h3 className="text-xl font-semibold text-gray-800">{child.name}</h3>
                  </div>
                  <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(child)}
                        className="text-white hover:text-[#faa901]"
                        >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    Age: {child.age}
                  </span>
                  {child.playType.map((pt) => (
                    <span key={pt} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {pt}
                    </span>
                  ))}
                  {child.theme.map((th) => (
                    <span key={th} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {th}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {child.games.map((game) => (
                    <span key={game} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      {game}
                    </span>
                  ))}
                  {child.hobbies.map((hobby) => (
                    <span key={hobby} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                      {hobby}
                    </span>
                  ))}
                  {child.interests.map((interest) => (
                    <span key={interest} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>

                {/* About */}
                {editingChildId === child.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      className="p-2 rounded-md border border-gray-300"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-[#faa901]"
                            onClick={() => saveBio(child)}
                            >
                            Save
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-[#faa901]"
                            onClick={() => setEditingChildId(null)}
                            >
                            Cancel
                        </Button>

                    </div>
                  </div>
                ) : (
                  child.bio && <p className="text-gray-700 mb-2 bg-white p-2 rounded-md">{child.bio}</p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
