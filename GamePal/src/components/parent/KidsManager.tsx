import type { Parent, Child } from "../../App"; 
import { ParentNav } from "./ParentNav";
import { Button } from "../ui/button";
import { Edit, Trash2, Plus } from "lucide-react"; 
import { useState } from "react";
import { AddChildProfile } from "./AddChildProfile";
import { EditChildProfile } from "./EditChildProfile"; 

type KidsManagerProps = {
  parent: Parent;
  onBack: () => void;
  onUpdateParent: (parent: Parent) => void;
};

export function KidsManager({ parent, onBack, onUpdateParent }: KidsManagerProps) {
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const [addingChild, setAddingChild] = useState(false);

  const startEditing = (child: Child) => {
    setEditingChild(child);
  };
  
  const handleSave = (updatedChild: Child) => {
    const updatedChildren = parent.children.map((c) =>
      c.id === updatedChild.id ? updatedChild : c
    );
    onUpdateParent({ ...parent, children: updatedChildren });
    setEditingChild(null); 
  };

  const handleClose = () => {
    setEditingChild(null); 
  };
  
  
  const deleteChild = (childId: string) => {
    const updatedChildren = parent.children.filter((c) => c.id !== childId);
    onUpdateParent({ ...parent, children: updatedChildren });
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} />


      <main className="flex-1 w-full p-6 overflow-auto bg-[#f8f6fb]"> 
        
        
        <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-white hover:text-[#faa901]"
        >
            &larr; Back
        </Button>

        
        <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Kids Manager</h1>
              <p className="text-gray-700">Manage your kid's profile</p>
            </div>

            <Button
              onClick={() => setAddingChild(true)}
              className="mt-2 flex items-center bg-[#faa901] text-black hover:bg-[#f4b625] rounded-full px-4 py-2 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Child
            </Button>

          </div>


        {/* Child Profiles */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parent.children.length === 0 ? (
            <div className="p-6 rounded-2xl shadow-inner bg-white text-center border border-gray-100">
              <p className="text-gray-500">No children added yet.</p>
            </div>
          ) : (
            parent.children.map((child) => (
              <div key={child.id} className="p-6 rounded-xl shadow-lg bg-white text-left transform hover:scale-[1.02] transition-transform duration-300">
                
                {/* Avatar & Name & Action Buttons */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl p-2 bg-purple-50 rounded-full">{child.avatar}</div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-500">Age {child.age}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {/* Edit Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(child)}
                        className="text-purple-500 hover:bg-purple-100 rounded-full"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    {/* Delete Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteChild(child.id)}
                        className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* About/Bio */}
                <p className="text-gray-700 mb-4 italic line-clamp-2">
                  {child.bio || "No profile bio added yet."}
                </p>
                
                {/* Tags Section (Games, Languages, Hobbies, Interests, Play Style, Themes) */}
                <div className="space-y-2">
                  {/* Games Tags */}
                  {child.games.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Games:</span>
                      {child.games.map((game) => (
                        <span
                          key={game}
                          className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Languages Tags */}
                  {child.language.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Languages:</span>
                      {child.language.map((lang) => (
                        <span
                          key={lang}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hobbies Tags */}
                  {child.hobbies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Hobbies:</span>
                      {child.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interests Tags */}
                  {child.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Interests:</span>
                      {child.interests.map((interest) => (
                        <span
                          key={interest}
                          className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Play Style Tags */}
                  {child.playType.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Play Style:</span>
                      {child.playType.map((pt) => (
                        <span
                          key={pt}
                          className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Game Themes Tags */}
                  {child.theme.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Game Themes:</span>
                      {child.theme.map((theme) => (
                        <span
                          key={theme}
                          className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </main>

      
      {editingChild && (
        <EditChildProfile
          child={editingChild}
          parent={parent} 
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
      {addingChild && (
        <AddChildProfile
          parent={parent}
          onClose={() => setAddingChild(false)}
          onSave={(newChild) => {
            // Add new child to parent's children array
            onUpdateParent({
              ...parent,
              children: [...parent.children, newChild],
            });
            setAddingChild(false);
          }}
        />
      )}

    </div>
  );
}