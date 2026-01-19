import { useState } from "react";
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


// --- Dummy Data for Selectable Options ---
const gamesOptions = [
  "Minecraft", "Roblox", "Fortnite", "Among Us", "Pokemon", "Animal Crossing",
  "Mario Kart", "Zelda", "Splatoon", "Rocket League", "Fall Guys", "Subway Surfers",
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Mandarin", "Japanese", "Korean", "Arabic", "Hindi", "Russian",
  "Dutch", "Polish", "Swedish",
];

const hobbyOptions = [
  "Drawing", "Reading", "Sports", "Music", "Crafts", "Cooking",
  "Dancing", "Coding", "YouTube", "Writing", "Photography", "Singing",
  "Building", "Collecting", "Puzzles",
];

const interestOptions = [
  "Adventure", "Animals", "Science", "Space", "Nature", "Technology",
  "Art", "History", "Movies", "Anime", "Comics", "Magic",
  "Dragons", "Dinosaurs", "Robots",
];

const playStyleOptions = ["Competitive", "Casual", "Creative", "Co-op", "Solo", "Team Play"];

const gameThemeOptions = [
  "Fantasy", "Sci-Fi", "Mystery", "Action", "Puzzle", "Survival",
  "Building", "Racing", "Sports", "Adventure", "Horror", "Platformer",
  "Simulation", "RPG", "Sandbox", "Exploration", "Strategy", "Fast-Paced", "Relaxing",
];

const avatarOptions = ["🧒", "🦁", "🦄", "🐶", "🐱", "🐼", "🐸", "🐵", "🐰", "👾", "🤖", "🧙‍♂️"];

const availabilityOptions = [ "Weekdays (After School)", "Weekdays (Evening)", "Weekends", "Morning", "Afternoon", "Evening", "Flexible", "Short Sessions"];


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
  const [editedChild, setEditedChild] = useState<EditableChild>({
  id: child.id,
  name: child.name || "",
  age: child.age || 0,
  avatar: child.avatar || "🧒",
  bio: child.bio || "",
  games: child.games || [],
  language: child.language || [],
  hobbies: child.hobbies || [],
  interests: child.interests || [],
  playType: child.playType || [],
  theme: child.theme || [],
  availability: child.availability || [],
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

  let data, error;

  if (editedChild.id) {
    // Existing child → update
    ({ data, error } = await supabase
      .from("children")
      .update({
        name: editedChild.name,
        age: editedChild.age,
        avatar: editedChild.avatar,
        bio: editedChild.bio,
        games: editedChild.games,
        language: editedChild.language,
        hobbies: editedChild.hobbies,
        interests: editedChild.interests,
        play_type: editedChild.playType || [],
        theme: editedChild.theme || [],
        availability: editedChild.availability,
      })
      .eq("id", editedChild.id)
      .select()
      .single());
  } else {
    // New child → insert
    ({ data, error } = await supabase
      .from("children")
      .insert({
        ...editedChild,
        parent_id: parent.id,
        play_type: editedChild.playType,
        theme: editedChild.theme,
      })
      .select()
      .single());
  }

  setLoading(false);

  if (error) {
    alert("Error saving child: " + error.message);
    return;
  }

  onSave({
    id: data.id!,
    name: data.name!,
    age: data.age!,
    avatar: data.avatar || "🧒",
    bio: data.bio || "",
    games: data.games || [],
    language: data.language || [],
    hobbies: data.hobbies || [],
    interests: data.interests || [],
    playType: data.play_type || [],
    theme: data.theme || [],
    availability: data.availability || [],
  });

  onClose();
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
                    value={editedChild.age}
                    onChange={(e) =>
                        handleTextChange("age", parseInt(e.target.value) || 0)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-white-800 font-medium focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Age"
                    />
                </div>

                {/* Avatar */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Avatar</h4>

                    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                        <div className="text-5xl">{editedChild.avatar}</div>
                        <p className="text-gray-600">Selected Avatar</p>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                        {avatarOptions.map((av) => (
                        <button
                            key={av}
                            type="button"
                            onClick={() => handleTextChange("avatar", av)}
                            className={`text-3xl p-2 rounded-lg border transition-colors ${
                            editedChild.avatar === av
                                ? "border-purple-600 bg-purple-100"
                                : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                            }`}
                        >
                            {av}
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
              Favorite Games (Selected: {editedChild.games.length})
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {gamesOptions.map((game) => (
                <SelectableTag
                  key={game}
                  label={game}
                  isSelected={editedChild.games.includes(game)}
                  onClick={() =>
                    handleTextChange(
                      "games",
                      toggleSelection(editedChild.games, game)
                    )
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
                value={editedChild.bio}
                onChange={(e) => handleTextChange("bio", e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-right text-xs text-gray-500">
                {editedChild.bio.length}/200 characters
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Languages 🗣️ (Selected: {editedChild.language.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {languageOptions.map((lang) => (
                  <SelectableTag
                    key={lang}
                    label={lang}
                    isSelected={editedChild.language.includes(lang)}
                    onClick={() =>
                      handleTextChange(
                        "language",
                        toggleSelection(editedChild.language, lang)
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Hobbies 🎨 (Selected: {editedChild.hobbies.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {hobbyOptions.map((hobby) => (
                  <SelectableTag
                    key={hobby}
                    label={hobby}
                    isSelected={editedChild.hobbies.includes(hobby)}
                    onClick={() =>
                      handleTextChange(
                        "hobbies",
                        toggleSelection(editedChild.hobbies, hobby)
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Interests 🚀 (Selected: {editedChild.interests.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <SelectableTag
                    key={interest}
                    label={interest}
                    isSelected={editedChild.interests.includes(interest)}
                    onClick={() =>
                      handleTextChange(
                        "interests",
                        toggleSelection(editedChild.interests, interest)
                      )
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
                Play Style (Selected: {editedChild.playType.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {playStyleOptions.map((style) => (
                  <SelectableTag
                    key={style}
                    label={style}
                    isSelected={editedChild.playType.includes(style)}
                    onClick={() =>
                      handleTextChange(
                        "playType",
                        toggleSelection(editedChild.playType, style)
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Game Themes (Selected: {editedChild.theme.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {gameThemeOptions.map((theme) => (
                  <SelectableTag
                    key={theme}
                    label={theme}
                    isSelected={editedChild.theme.includes(theme)}
                    onClick={() =>
                      handleTextChange(
                        "theme",
                        toggleSelection(editedChild.theme, theme)
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Availability ⏰ (Selected: {editedChild.availability?.length || 0})
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {availabilityOptions.map((slot) => (
                  <SelectableTag
                    key={slot}
                    label={slot}
                    isSelected={editedChild.availability?.includes(slot)}
                    onClick={() =>
                      handleTextChange(
                        "availability",
                        toggleSelection(editedChild.availability || [], slot)
                      )
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
