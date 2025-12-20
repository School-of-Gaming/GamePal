import { useState, useEffect } from "react"; 
import type { Parent, Child } from "../../App";
import { ParentNav } from "./ParentNav";
import { Button } from "../ui/button";

type MatchmakingProps = {
  parent: Parent;
  onBack: () => void;
};

export function Matchmaking({ parent, onBack }: MatchmakingProps) {
  const [selectedChildId, setSelectedChildId] = useState(parent.children[0]?.id);
  const selectedChild = parent.children.find(c => c.id === selectedChildId);

  const [filters, setFilters] = useState({
    ageMin: 3,
    ageMax: 12,
    game: "",
    language: "",
    hobby: "",
    interest: "",
    playType: "",
    theme: "",
  });

  // Dummy matched kids
  const matchedKids: Child[] = [
    {
      id: "m1",
      name: "Lia",
      age: 8,
      avatar: "🐱",
      bio: "Love building in Minecraft and catching Pokémon!",
      commonTags: ['Roblox', 'English', 'Gaming'],
      games: ['Minecraft', 'Roblox', 'Pokémon'],
      language: ['English', 'Spanish'],
      hobbies: ['Drawing', 'Gaming', 'Reading'],
      interests: ['Adventure', 'Animals', 'Technology'],
      playType: ['Co-op', 'Creative', 'Casual'],
      theme: ["Fantasy"]
    },
    {
      id: "m2",
      name: 'Jordan',
      age: 9,
      avatar: '🦊',
      bio: 'Looking for friends to play Animal Crossing with!',
      commonTags: ['English', 'Gaming'],
      games: ['Animal Crossing', 'Minecraft'],
      language: ['English'],
      hobbies: ['Collecting', 'Gaming'],
      interests: ['Nature', 'Art'],
      playType: ['Co-op', 'Casual'],
      theme: ['horror']
    },
    {
      id: "m3",
      name: 'Sam',
      age: 10,
      avatar: '🐼',
      bio: 'Nintendo fan! Love adventure games.',
      commonTags: ['English', 'Gaming', 'Fantasy'],
      games: ['Mario', 'Zelda'],
      language: ['English'],
      hobbies: ['Gaming', 'Reading'],
      interests: ['Fantasy', 'Adventure'],
      playType: ['Single Player', 'Casual'],
      theme: ["Fantasy"] 
    }
  ];

  // State
  const [viewChild, setViewChild] = useState<Child | null>(null);
  const [likedKids, setLikedKids] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const toggleLike = (kidId: string) => {
    const liked = likedKids.includes(kidId);
    setLikedKids(prev =>
      liked ? prev.filter(id => id !== kidId) : [...prev, kidId]
    );

    setToastMessage(
      liked ? "Removed like" : `You liked ${matchedKids.find(k => k.id === kidId)?.name}!`
    );
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

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
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Find Matches</h1>
          <p className="text-gray-700 mb-4">Find out a pal that match for your children</p>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-purple-600 text-2xl">🔍</span> Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Finding Matches For */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Finding matches for</label>
            <select
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
                {parent.children.map((child) => (
                <option key={child.id} value={child.id}>
                    {child.avatar} {child.name}
                </option>
                ))}
            </select>
            </div>

            {/* Age Range */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Age Range</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Ages</option>
                <option>5–7</option>
                <option>8–10</option>
                <option>11–13</option>
            </select>
            </div>

            {/* Game Interest */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Game Interest</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Games</option>
                <option>Minecraft</option>
                <option>Roblox</option>
            </select>
            </div>

            {/* Language */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Language</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
            </select>
            </div>

            {/* Hobbies */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Hobbies</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Hobbies</option>
                <option>Drawing</option>
                <option>Outdoor Play</option>
                <option>Building</option>
            </select>
            </div>

            {/* Interests */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Interests</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Interests</option>
                <option>Animals</option>
                <option>Science</option>
            </select>
            </div>

            {/* Play Type */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Play Type</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Play Types</option>
                <option>Creative</option>
                <option>Casual</option>
                <option>Co-op</option>
            </select>
            </div>

            {/* Theme */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Theme</label>
            <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option>All Themes</option>
                <option>Fantasy</option>
                <option>Adventure</option>
            </select>
            </div>
        </div>
        </div>

        {/* MATCH RESULTS */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">
            Found {matchedKids.length} potential matches for {selectedChild?.name}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matchedKids.map((kid) => (
              <div
                key={kid.id}
                className="p-4 pt-6 bg-white rounded-2xl shadow-lg relative border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-2 text-black">
                  <div className="text-4xl">{kid.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold">{kid.name}</h3>
                    <p className="text-sm text-gray-500">Age {kid.age}</p>
                  </div>
                </div>

                <p className="text-sm text-black mb-3 line-clamp-2 h-10">
                  {kid.bio}
                </p>

                <p className="text-xs font-semibold text-gray-500 mb-2">Common with {selectedChild?.name}:</p>
                <div className="flex flex-wrap gap-2">
                  {kid.commonTags?.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs bg-[#faa901] text-black font-medium px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  size="sm"
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setViewChild(kid)}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="mt-2 w-full bg-[#faa901] text-black hover:bg-[#f4b625]"
                  onClick={() => toggleLike(kid.id)}
                >
                  {likedKids.includes(kid.id) ? "Liked 💜" : "Like ❤️"}
                </Button>

              </div>
            ))}
          </div>
        </section>

        {/* VIEW DETAILS PANEL */}
        {viewChild && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-6xl">{viewChild.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-black">{viewChild.name}</h2>
                  <p className="text-base text-gray-500">Age: {viewChild.age}</p>
                </div>
              </div>

              {/* About Section */}
              <h3 className="text-lg font-bold mb-1 border-b pb-1 text-black">About</h3>
              <p className="text-sm text-gray-700 mb-4">{viewChild.bio}</p>

              {/* Interest Sections */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">Games:</strong>
                  {viewChild.games.map((item, index) => (
                    <span key={index} className="text-xs bg-purple-100 text-purple-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">Languages:</strong>
                  {viewChild.language.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">Hobbies:</strong>
                  {viewChild.hobbies.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">General Interests:</strong>
                  {viewChild.interests.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">Play Type:</strong>
                  {viewChild.playType.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm w-full text-black">Theme:</strong>
                  {viewChild.theme.map((item, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setViewChild(null)}
              >
                  Close
              </Button>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
}
