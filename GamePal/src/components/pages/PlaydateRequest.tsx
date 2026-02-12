import { useState, useEffect } from "react";
import { Check, X, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "../Nav";
import type { Parent } from "../../App";
import type { Child } from "../../App";
import { ChildDetailsModal } from "../child/ChildDetailsModal";
import { supabase } from "../../supabase/client";

type Match = {
  like_id: string;
  from_child: string;
  to_child: string;
  from_parent_id: string;   
  to_parent_id: string; 
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at?: string;
  child_b_name?: string;
  child_b_age?: number;
  child_b_bio?: string;
  child_b_avatar?: string;
};

type PotentialMatchesProps = {
  parent: Parent;
  onBack: () => void;
};

export function PotentialMatches({ parent, onBack }: PotentialMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewChild, setViewChild] = useState<Child | null>(null);

   const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("child_likes_dashboard")
      .select("*")
      .or(`from_parent_id.eq.${parent.id},to_parent_id.eq.${parent.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      setMatches(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
  const loadMatches = async () => {
    await fetchMatches();
  };

  loadMatches();

  // subscribe to real-time updates
  const subscription = supabase
    .channel("public:child_likes_dashboard")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "child_likes" },
      () => fetchMatches()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription); 
  };
}, [parent.id]);



  // ------------------- APPROVE / DECLINE -------------------
  const handleApprove = async (like_id: string) => {
    const { error } = await supabase
      .from("child_likes")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", like_id);

    if (error) console.error("Error approving like:", error);
    else fetchMatches();
  };

  const handleDecline = async (like_id: string) => {
    const { error } = await supabase
      .from("child_likes")
      .update({ status: "rejected" })
      .eq("id", like_id);

    if (error) console.error("Error declining like:", error);
    else fetchMatches();
  };

  // ------------------- FILTER MATCHES -------------------
  const outgoingLikes = matches.filter(
    m => m.from_parent_id === parent.id && m.status === "pending"
  );
  const incomingLikes = matches.filter(
    m => m.to_parent_id === parent.id && m.status === "pending"
  );
  //const approvedMatches = matches.filter(m => m.status === "approved");

  // ------------------- MAP TO CHILD -------------------
  const matchToChild = (match: Match): Child => ({
    id: match.to_child || match.from_child,
    parent_id: parent.id,
    name: match.child_b_name ?? "Unknown",
    age: match.child_b_age ?? 0,
    bio: match.child_b_bio ?? "",
    games_ids: [],
    language_ids: [],
    hobbies_ids: [],
    interests_ids: [],
    play_type_ids: [],
    theme_ids: [],
    availability_ids: [],
    avatar_id: match.child_b_avatar ?? "",
  });


  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />

      <main className="flex-1 p-6 overflow-auto bg-[#f8f6fb]">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-white hover:text-[#faa901]"
        >
          &larr; Back
        </Button>

        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Playdate Request
          </h1>
          <p className="text-gray-700">
            Incoming and outgoing playdates requests awaiting approval
          </p>
        </div>

        {/* Safety Banner */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-[#FFFCEB] border border-[#FFF5B8] rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-[#857000] mt-1" />
            <div>
              <h3 className="text-lg font-bold text-[#857000] mb-1">
                Safety First
              </h3>
              <p className="text-sm text-[#857000]/80 font-medium leading-relaxed">
                We recommend a video call with the other parent before approving
                a match.
              </p>
            </div>
          </div>
        </div>

        {/* TWO COLUMNS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative">

          {/* LEFT — YOU LIKED */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              ❤️ Pending Their Approval
            </h2>

            {loading ? <p>Loading...</p> :
              outgoingLikes.length === 0 ? <p>No outgoing likes.</p> :
              outgoingLikes.map(match => (
                <div key={match.like_id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex gap-5 flex-1 items-center">
                      <div className="text-5xl p-4 bg-purple-50 rounded-full">
                        {match.child_b_avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {match.child_b_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Age {match.child_b_age}
                        </p>
                        <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">
                          Awaiting their approval
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#faa901] text-black hover:bg-[#f4b625] rounded-xl py-5 font-bold w-full lg:w-40"
                      onClick={() => setViewChild(matchToChild(match))}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>


          {/* Divider */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-800"></div>


           {/* RIGHT — THEY LIKED YOU */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              ✅ Awaiting Your Approval
            </h2>

            {loading ? <p>Loading...</p> :
              incomingLikes.length === 0 ? <p>No incoming likes.</p> :
              incomingLikes.map(match => (
                <div key={match.like_id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex gap-5 flex-1 items-center">
                      <div className="text-5xl p-4 bg-purple-50 rounded-full">
                        {match.child_b_avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {match.child_b_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Age {match.child_b_age}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 lg:mt-0 min-w-[200px]">
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 font-bold flex gap-2 w-full"
                        onClick={() => handleApprove(match.like_id)}
                      >
                        <Check className="w-5 h-5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-5 font-bold flex gap-2 w-full"
                        onClick={() => handleDecline(match.like_id)}
                      >
                        <X className="w-5 h-5" /> Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        


        </div>

        {/* VIEW DETAILS PANEL */}
        {viewChild && (
          <ChildDetailsModal
            child={viewChild}
            onClose={() => setViewChild(null)}
          />
        )}

      </main>
    </div>
  );
}
