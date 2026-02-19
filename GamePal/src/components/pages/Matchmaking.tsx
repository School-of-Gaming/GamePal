import { useState, useEffect } from "react"; 
import type { Parent, Child } from "../../App";
import { ParentNav } from "../Nav";
import { Button } from "../ui/button";
import { ChildDetailsModal } from "../child/ChildDetailsModal";
import { supabase } from "../../supabase/client";

type MatchmakingProps = {
  parent: Parent;
  onBack: () => void;
};

export type MatchChild = {
  id: string;
  parent_id: string; 
  name: string;
  age: number;
  bio?: string;
  avatar?: string;              
  matchPercentage: number;
  games: string[];
  languages: string[];
  hobbies: string[];
  interests: string[];
  play_types: string[];
  themes: string[];
  availability: string[];
  matched_attributes: Record<string, string[]>; 
};

type ChildLike = {
  like_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
  type: "pending_sent" | "pending_received" | "approved_match";
  my_child_id: string;
  other_child_id: string;
  other_child_name: string;
  other_child_age: number;
  other_child_bio?: string;
  other_child_avatar?: string;
};


export function Matchmaking({ parent, onBack }: MatchmakingProps) {
  const [selectedChildId, setSelectedChildId] = useState(parent.children[0]?.id);
  const selectedChild = parent.children.find(c => c.id === selectedChildId);
   

  const [filters, setFilters] = useState({
    ageMin: 5,
    ageMax: 13,
    game: "",
    language: "",
    hobby: "",
    interest: "",
    playType: "",
    theme: "",
    availability: "",
  });

  const [ageOptions] = useState([
    { min: 5, max: 7 },
    { min: 8, max: 10 },
    { min: 11, max: 13 },
  ]);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);
  const [hobbyOptions, setHobbyOptions] = useState<string[]>([]);
  const [interestOptions, setInterestOptions] = useState<string[]>([]);
  const [playTypeOptions, setPlayTypeOptions] = useState<string[]>([]);
  const [themeOptions, setThemeOptions] = useState<string[]>([]);
  const [availabilityOptions, setAvailabilityOptions] = useState<string[]>([]);

  const [matchedKids, setMatchedKids] = useState<MatchChild[]>([]);

  // ------------------- FETCH FILTER -------------------
  useEffect(() => {
    const fetchOptions = async (
      table: string,
      setter: (v: string[]) => void
    ) => {
      const { data, error } = await supabase
        .from(table)
        .select("name");

      if (!error && data) {
        setter(data.map((d: any) => d.name));
      }
    };

    fetchOptions("games", setGameOptions);
    fetchOptions("languages", setLanguageOptions);
    fetchOptions("hobbies_lookup", setHobbyOptions);
    fetchOptions("interests_lookup", setInterestOptions);
    fetchOptions("play_types", setPlayTypeOptions);
    fetchOptions("game_themes", setThemeOptions);
    fetchOptions("availability_options", setAvailabilityOptions);
  }, []);

  // ------------------- FETCH MATCHES -------------------
   useEffect(() => {
    if (!selectedChildId) return;

    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("child_match_results")
        .select("*")
        .eq("child_a_id", selectedChildId)
        .order("match_percentage", { ascending: false });

      if (error) {
        console.error("Match fetch error:", error);
        return;
      }

        let formatted: MatchChild[] = (data || []).map((row: any) => ({
        id: row.child_b_id,
        parent_id: row.child_b_parent_id,
        name: row.child_b_name,
        age: row.child_b_age,
        bio: row.child_b_bio,
        avatar: row.child_b_avatar,
        matchPercentage: row.match_percentage,

        games: row.games || [],
        languages: row.languages || [],
        hobbies: row.hobbies || [],
        interests: row.interests || [],
        play_types: row.play_types || [],
        themes: row.themes || [],
        availability: row.availability || [],

        matched_attributes: row.matched_attributes || {},
      }));

      // ------------------- APPLY FILTERS -------------------
      formatted = formatted.filter((kid) => {
        if (kid.age < filters.ageMin || kid.age > filters.ageMax) return false;
        if (filters.game && !kid.games?.includes(filters.game)) return false;
        if (filters.language && !kid.languages?.includes(filters.language)) return false;
        if (filters.hobby && !kid.hobbies.includes(filters.hobby)) return false;
        if (filters.interest && !kid.interests.includes(filters.interest)) return false;
        if (filters.playType && !kid.play_types.includes(filters.playType)) return false;
        if (filters.theme && !kid.themes.includes(filters.theme)) return false;
        if (filters.availability && !kid.availability.includes(filters.availability))
          return false;
        return true;
      });

      setMatchedKids(formatted);
    };

    fetchMatches();
  }, [selectedChildId, filters]);

  // View / likes State
  const [viewChild, setViewChild] = useState<Child | MatchChild | null>(null);
  
  const [childLikes, setChildLikes] = useState<ChildLike[]>([]);

  useEffect(() => {
  if (!selectedChildId) return;

  const fetchLikes = async () => {
    const { data } = await supabase
      .from("child_likes_dashboard")
      .select("*")
      .eq("my_child_id", selectedChildId);
    setChildLikes(data ?? []);
  };

  fetchLikes();

  const subscription = supabase
    .channel("child_likes_channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "child_likes" },
      () => fetchLikes()
    )
    .subscribe();

  return () => {
    // sync cleanup wrapper
    void (async () => {
      await supabase.removeChannel(subscription);
    })();
  };
}, [selectedChildId]);


  // ------------------- TOGGLE LIKE -------------------
  const toggleLike = async (kidId: string) => {
    if (!selectedChildId) return;
    const alreadyLiked = childLikes.some(like => like.other_child_id === kidId);

    if (alreadyLiked) {
      await supabase.from("child_likes").delete().eq("from_child", selectedChildId).eq("to_child", kidId);
    } else {
      await supabase.from("child_likes").insert({ from_child: selectedChildId, to_child: kidId, status: "pending" });
    }

    // Re-fetch
    const { data } = await supabase.from("child_likes_dashboard").select("*").eq("my_child_id", selectedChildId);
    setChildLikes(data ?? []);
  };

  // ------------------- LIKED PROFILES -------------------
  const likedProfiles = matchedKids.filter(kid =>
    childLikes.some(like => like.other_child_id === kid.id)
  );

  // ------------------- TOAST -------------------
  const [toastMessage, setToastMessage] = useState("");
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />

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
          <p className="text-gray-700 mb-4">Find out a playdate that matches with your children</p>
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
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
                {parent.children.map((child) => (
                <option key={child.id} value={child.id}>
                    {child.name}
                </option>
                ))}
            </select>
            </div>

            {/* Age Range */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Age Range</label>
            <select 
              value={`${filters.ageMin}-${filters.ageMax}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
                setFilters({ ...filters, ageMin: min, ageMax: max });
              }}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="5-13">All Ages</option>
                {ageOptions.map((r) => (
                <option key={`${r.min}-${r.max}`} value={`${r.min}-${r.max}`}>
                  {r.min}–{r.max}
                </option>
              ))}
            </select>
            </div>

            {/* Game Interest */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Game Interest</label>
            <select 
              value={filters.game}
              onChange={(e) => setFilters({ ...filters, game: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Games</option>
                {gameOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
            </select>
            </div>

            {/* Language */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Language</label>
            <select 
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Languages</option>
                {languageOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
            </select>
            </div>

            {/* Hobbies */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Hobbies</label>
            <select 
              value={filters.hobby}
              onChange={(e) => setFilters({ ...filters, hobby: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Hobbies</option>
                {hobbyOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
            </select>
            </div>

            {/* Interests */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Interests</label>
            <select 
              value={filters.interest}
              onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Interests</option>
                {interestOptions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
            </select>
            </div>

            {/* Play Type */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Play Type</label>
            <select 
              value={filters.playType}
              onChange={(e) => setFilters({ ...filters, playType: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Play Types</option>
                {playTypeOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
            </div>

            {/* Theme */}
            <div>
            <label className="text-sm font-semibold text-gray-700">Theme</label>
            <select 
              value={filters.theme}
              onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500">
                <option value="">All Themes</option>
                {themeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Any Time</option>
                {availabilityOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

        </div>
        </div>

        {/* LIKED PROFILES */}
        {likedProfiles.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              💜 Profiles You Liked
            </h2>

            <div className="flex flex-wrap gap-4">
              {likedProfiles.map(kid => (
                <div
                  key={kid.id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border"
                >
                  <div
                    onClick={() => setViewChild(kid)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-3xl">{kid.avatar}</span>
                    <div>
                      <p className="font-bold text-gray-900">{kid.name}</p>
                      <p className="text-sm text-gray-500">Age {kid.age}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLike(kid.id)}
                    className="text-sm text-red-500 font-semibold hover:underline"
                  >
                    Unlike
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                {/* Compatibility Badge */}
                <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  {kid.matchPercentage}% Match
                </div>
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
                  {Object.values(kid.matched_attributes).flat().map((tag, idx) => (
                    <span
                      key={idx}
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
                  {childLikes.some(l => l.other_child_id === kid.id) ? "Liked 💜" : "Like ❤️"}
                </Button>

              </div>
            ))}
          </div>
        </section>

        {/* VIEW DETAILS PANEL */}
        {viewChild && (
          <ChildDetailsModal
            child={viewChild}
            onClose={() => setViewChild(null)}
          />
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
