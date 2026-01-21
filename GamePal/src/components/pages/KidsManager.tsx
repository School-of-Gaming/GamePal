import type { Parent, Child } from "../../App"; 
import { ParentNav } from "../Nav";
import { Button } from "../ui/button";
import { Edit, Trash2, Plus } from "lucide-react"; 
import { useState, useEffect } from "react";
import { AddChildProfile } from "./AddChildProfile";
import { EditChildProfile } from "./EditChildProfile"; 
import { supabase } from "../../supabase/client";

type KidsManagerProps = {
  parent: Parent;
  onBack: () => void;
  onUpdateParent: (parent: Parent) => void;
};

export function KidsManager({ parent, onBack, onUpdateParent }: KidsManagerProps) {
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const [addingChild, setAddingChild] = useState(false);

  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [lookups, setLookups] = useState<{
    games: { id: string; name: string }[];
    languages: { id: string; name: string }[];
    hobbies: { id: string; name: string }[];
    interests: { id: string; name: string }[];
    playTypes: { id: string; name: string }[];
    themes: { id: string; name: string }[];
    availability: { id: string; name: string }[];
    avatars: { id: string; emoji: string }[];
  }>({
    games: [],
    languages: [],
    hobbies: [],
    interests: [],
    playTypes: [],
    themes: [],
    availability: [],
    avatars: [],
  });

   useEffect(() => {
    const fetchLookups = async () => {
      const { data: games } = await supabase.from("games").select("*");
      const { data: languages } = await supabase.from("languages").select("*");
      const { data: hobbies } = await supabase.from("hobbies_lookup").select("*");
      const { data: interests } = await supabase.from("interests_lookup").select("*");
      const { data: playTypes } = await supabase.from("play_types").select("*");
      const { data: themes } = await supabase.from("game_themes").select("*");
      const { data: availability } = await supabase.from("availability_options").select("*");
      const { data: avatars } = await supabase.from("avatars").select("*");

      setLookups({
        games: games || [],
        languages: languages || [],
        hobbies: hobbies || [],
        interests: interests || [],
        playTypes: playTypes || [],
        themes: themes || [],
        availability: availability || [],
        avatars: avatars || [],
      });
    };

    const fetchChildren = async () => {
      const { data: children } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", parent.id);

      if (!children) return;

      const enrichedChildren: Child[] = await Promise.all(
        children.map(async (c) => {
          const [
            { data: games },
            { data: languages },
            { data: hobbies },
            { data: interests },
            { data: playTypes },
            { data: themes },
            { data: availability },
          ] = await Promise.all([
            supabase.from("child_games").select("game_id").eq("child_id", c.id),
            supabase.from("child_languages").select("language_id").eq("child_id", c.id),
            supabase.from("child_hobbies").select("hobby_id").eq("child_id", c.id),
            supabase.from("child_interests").select("interest_id").eq("child_id", c.id),
            supabase.from("child_play_types").select("play_type_id").eq("child_id", c.id),
            supabase.from("child_themes").select("theme_id").eq("child_id", c.id),
            supabase.from("child_availability").select("availability_id").eq("child_id", c.id),
          ]);

          return {
            ...c,
            games_ids: games?.map(g => g.game_id) || [],
            language_ids: languages?.map(l => l.language_id) || [],
            hobbies_ids: hobbies?.map(h => h.hobby_id) || [],
            interests_ids: interests?.map(i => i.interest_id) || [],
            play_type_ids: playTypes?.map(p => p.play_type_id) || [],
            theme_ids: themes?.map(t => t.theme_id) || [],
            availability_ids: availability?.map(a => a.availability_id) || [],
          };
        })
      );

      setChildrenData(enrichedChildren);
    };

    fetchLookups();
    fetchChildren();
  }, [parent.id]);


  const startEditing = (child: Child) => {
    setEditingChild(child);
  };
  
  const handleSave = (updatedChild: Child) => {
    const updatedChildren = childrenData.map((c) =>
      c.id === updatedChild.id ? updatedChild : c
    );
    setChildrenData(updatedChildren);
    onUpdateParent({ ...parent, children: updatedChildren });
    setEditingChild(null); 
  };

  const handleClose = () => {
    setEditingChild(null); 
  };
  
  
  const deleteChild = async (childId: string) => {
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId);

  if (error) {
    alert("Error deleting child: " + error.message);
    return;
  }

  const updatedChildren = childrenData.filter((c) => c.id !== childId);
  setChildrenData(updatedChildren);
  onUpdateParent({ ...parent, children: updatedChildren });
};



  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav 
        parent={parent} 
        onLogout={() => {
          console.log("Parent logged out");
        }} 
      />


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
                    <div className="text-4xl p-2 bg-purple-50 rounded-full">{lookups.avatars.find(a => a.id === child.avatar_id)?.emoji || "🧒"}</div>
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
                  {child.games_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Games:</span>
                      {child.games_ids.map(id => {
                        const name = lookups.games.find(g => g.id === id)?.name || id;
                        return <span key={id} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Languages Tags */}
                  {child.language_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Languages:</span>
                      {child.language_ids.map(id => {
                        const name = lookups.languages.find(l => l.id === id)?.name || id;
                        return <span key={id} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Hobbies Tags */}
                  {child.hobbies_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Hobbies:</span>
                      {child.hobbies_ids.map(id => {
                        const name = lookups.hobbies.find(h => h.id === id)?.name || id;
                        return <span key={id} className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Interests Tags */}
                  {child.interests_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Interests:</span>
                      {child.interests_ids.map(id => {
                        const name = lookups.interests.find(i => i.id === id)?.name || id;
                        return <span key={id} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Play Style Tags */}
                  {child.play_type_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Play Style:</span>
                      {child.play_type_ids.map(id => {
                        const name = lookups.playTypes.find(p => p.id === id)?.name || id;
                        return <span key={id} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Game Themes Tags */}
                  {child.theme_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">Game Themes:</span>
                      {child.theme_ids.map(id => {
                        const name = lookups.themes.find(t => t.id === id)?.name || id;
                        return <span key={id} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
                    </div>
                  )}

                  {/* Availability / Timezone Tags */}
                  {child.availability_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-semibold text-sm text-gray-600">
                        Availability:
                      </span>
                       {child.availability_ids.map(id => {
                        const name = lookups.availability.find(a => a.id === id)?.name || id;
                        return <span key={id} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">{name}</span>;
                      })}
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
            const updatedChildren = [...childrenData, newChild];
            setChildrenData(updatedChildren);
            onUpdateParent({ ...parent, children: updatedChildren });
            setAddingChild(false);
          }}
        />
      )}

    </div>
  );
}