import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import type { Child, Parent } from "../../App";
import { supabase } from "../../supabase/client";

type EditChildProfileProps = {
  child: Partial<Child>;
  parent: Parent;
  onClose: () => void;
  onSave: (updatedChild: Child) => void;
  loading?: boolean;
};


// Reusable Button/Tag Component
const SelectableTag = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium text-sm transition-colors
      ${
        isSelected
          ? "bg-purple-600 text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
      }
    `}
  >
    {label}
  </button>
);

// Helper to toggle array selections
const toggleSelection = (list: string[], item: string) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

type EditableChild = Omit<Child, "id"> & { id?: string };

export function EditChildProfile({ child, parent, onClose, onSave }: EditChildProfileProps) {
  const [activeTab, setActiveTab] = useState<"Basic Info" | "Games" | "Profile" | "Preferences">("Basic Info");

  // Lookup data state (NEW: fetch from Supabase)
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

    fetchLookups();
  }, []);


  const [editedChild, setEditedChild] = useState<EditableChild>({
    id: child.id,
    parent_id: child.parent_id || parent.id,
    name: child.name || "",
    age: child.age ?? 5,
    bio: child.bio || "",
    games_ids: child.games_ids || [],
    language_ids: child.language_ids || [],
    hobbies_ids: child.hobbies_ids || [],
    interests_ids: child.interests_ids || [],
    play_type_ids: child.play_type_ids || [],
    theme_ids: child.theme_ids || [],
    availability_ids: child.availability_ids || [],
    avatar_id: child.avatar_id || undefined,
  });

  const [loading, setLoading] = useState(false);

  const handleTextChange = <K extends keyof Child>(
    field: K,
    value: Child[K]
  ) => {
    setEditedChild((prev) => ({ ...prev, [field]: value }));
  };

   const handleSave = async () => {
    setLoading(true);
    let childRecord;

    try {
      //  Insert or update the child
      if (editedChild.id) {
        const { data, error } = await supabase
          .from("children")
          .update({
            parent_id: parent.id,
            name: editedChild.name,
            age: editedChild.age,
            bio: editedChild.bio ?? "",
            avatar_id: editedChild.avatar_id,
          })
          .eq("id", editedChild.id)
          .select()
          .single();

        if (error) throw error;
        childRecord = data;
      } else {
        const { data, error } = await supabase
          .from("children")
          .insert({
            parent_id: parent.id,
            name: editedChild.name,
            age: editedChild.age,
            bio: editedChild.bio ?? "",
            avatar_id: editedChild.avatar_id,
          })
          .select()
          .single();

        if (error) throw error;
        childRecord = data;
      }

      const childId = childRecord.id;

      
      const syncJoinTable = async (table: string, col: string, ids: string[]) => {

        await supabase.from(table).delete().eq("child_id", childId);
  
        if (ids.length > 0) {
          const insertPayload = ids.map((id) => ({
            child_id: childId,
            [col]: id,
          }));
          await supabase.from(table).insert(insertPayload);
        }
      };

    
      await syncJoinTable("child_games", "game_id", editedChild.games_ids || []);
      await syncJoinTable("child_languages", "language_id", editedChild.language_ids || []);
      await syncJoinTable("child_hobbies", "hobby_id", editedChild.hobbies_ids || []);
      await syncJoinTable("child_interests", "interest_id", editedChild.interests_ids || []);
      await syncJoinTable("child_play_types", "play_type_id", editedChild.play_type_ids || []);
      await syncJoinTable("child_themes", "theme_id", editedChild.theme_ids || []);
      await syncJoinTable("child_availability", "availability_id", editedChild.availability_ids || []);

    
      onSave({
        id: childId,
        parent_id: childRecord.parent_id!,
        name: childRecord.name!,
        age: childRecord.age!,
        bio: childRecord.bio ?? "",
        avatar_id: childRecord.avatar_id || undefined,
        games_ids: editedChild.games_ids || [],
        language_ids: editedChild.language_ids || [],
        hobbies_ids: editedChild.hobbies_ids || [],
        interests_ids: editedChild.interests_ids || [],
        play_type_ids: editedChild.play_type_ids || [],
        theme_ids: editedChild.theme_ids || [],
        availability_ids: editedChild.availability_ids || [],
      });

      onClose();
    } catch (err: any) {
      alert("Error saving child: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Info":
        return (
            <div className="space-y-6">
                {/* Name */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Name</h4>
                    <input
                    type="text"
                    value={editedChild.name}
                    onChange={(e) => handleTextChange("name", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-white-800 font-medium focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Child's name"
                    />
                </div>

                {/* Age */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Age</h4>
                    <input
                    type="number"
                    min={5}
                    value={editedChild.age}
                    onChange={(e) =>
                        handleTextChange("age", parseInt(e.target.value) || 5)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-white-800 font-medium focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Age"
                    />
                </div>

                {/* Avatar */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Avatar</h4>

                    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                        <div className="text-5xl">{lookups.avatars.find(a => a.id === editedChild.avatar_id)?.emoji || "🧒"}</div>
                        <p className="text-gray-600">Selected Avatar</p>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                        {lookups.avatars.map((av) => (
                        <button
                            key={av.id}
                            type="button"
                            onClick={() => handleTextChange("avatar_id", av.id)}
                            className={`text-3xl p-2 rounded-lg border transition-colors ${
                            editedChild.avatar_id === av.id
                                ? "border-purple-600 bg-purple-100"
                                : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                            }`}
                        >
                            {av.emoji}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
       
    
        );


      case "Games":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Favorite Games (Selected: {editedChild.games_ids?.length || 0})
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {lookups.games.map((game) => (
                <SelectableTag
                  key={game.id}
                  label={game.name}
                  isSelected={editedChild.games_ids?.includes(game.id)}
                  onClick={() =>
                    setEditedChild(prev => ({
                      ...prev,
                      games_ids: toggleSelection(prev.games_ids || [], game.id)
                    }))
                  }
                />
              ))}
            </div>
          </div>
        );

      case "Profile":
        return (
          <div className="space-y-6">
             {/* WARNING */}
              <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-bold">⚠️ Important Safety Warning</p>
                <p className="text-sm">
                  Never include personal information such as your home address, phone number, school name, or other identifying details in this section. Sharing such information could put you at serious risk. Keep your profile safe and general!
                </p>
              </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                About Me
              </h4>
              <textarea
                value={editedChild.bio ?? ""}
                onChange={(e) => handleTextChange("bio", e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-right text-xs text-gray-500">
                {(editedChild.bio ?? "").length}/200 characters
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Languages 🗣️ (Selected: {editedChild.language_ids?.length || 0})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {lookups.languages.map((lang) => (
                  <SelectableTag
                    key={lang.id}
                    label={lang.name}
                    isSelected={editedChild.language_ids?.includes(lang.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        language_ids: toggleSelection(prev.language_ids || [], lang.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Hobbies 🎨 (Selected: {editedChild.hobbies_ids?.length || 0})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {lookups.hobbies.map((hobby) => (
                  <SelectableTag
                    key={hobby.id}
                    label={hobby.name}
                    isSelected={editedChild.hobbies_ids?.includes(hobby.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        hobbies_ids: toggleSelection(prev.hobbies_ids || [], hobby.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Interests 🚀 (Selected: {editedChild.interests_ids?.length || 0})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {lookups.interests.map((interest) => (
                  <SelectableTag
                    key={interest.id}
                    label={interest.name}
                    isSelected={editedChild.interests_ids?.includes(interest.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        interests_ids: toggleSelection(prev.interests_ids || [], interest.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "Preferences":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Play Style (Selected: {editedChild.play_type_ids?.length || 0})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {lookups.playTypes.map((style) => (
                  <SelectableTag
                    key={style.id}
                    label={style.name}
                    isSelected={editedChild.play_type_ids?.includes(style.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        play_type_ids: toggleSelection(prev.play_type_ids || [], style.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Game Themes (Selected: {editedChild.theme_ids?.length || 0})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {lookups.themes.map((theme) => (
                  <SelectableTag
                    key={theme.id}
                    label={theme.name}
                    isSelected={editedChild.theme_ids?.includes(theme.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        theme_ids: toggleSelection(prev.theme_ids || [], theme.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Availability ⏰ (Selected: {editedChild.availability_ids?.length || 0})
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {lookups.availability.map((slot) => (
                  <SelectableTag
                    key={slot.id}
                    label={slot.name}
                    isSelected={editedChild.availability_ids?.includes(slot.id)}
                    onClick={() =>
                      setEditedChild(prev => ({
                        ...prev,
                        availability_ids: toggleSelection(prev.availability_ids || [], slot.id)
                      }))
                    }
                  />
                ))}
              </div>
            </div>

          </div>
        );
    }
  };

  const tabs = ["Basic Info", "Games", "Profile", "Preferences"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Edit Child Profile
          </h2>
          <div className="flex space-x-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-white-500 hover:text-purple-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>

        <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`text-white ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {loading ? "Saving..." : "Save Changes ✨"}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white-600 hover:text-[#faa901]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
