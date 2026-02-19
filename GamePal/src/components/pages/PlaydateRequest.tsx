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
  from_child_name?: string;
  from_child_age?: number;
  from_child_bio?: string;
  from_child_avatar?: string;
  to_child_name?: string;
  to_child_age?: number;
  to_child_bio?: string;
  to_child_avatar?: string;
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
    const childIds = parent.children.map(c => c.id);

    const orCondition = childIds
      .map(id => `from_child.eq.${id}`)
      .concat(childIds.map(id => `to_child.eq.${id}`))
      .join(",");

    const { data, error } = await supabase
      .from("child_likes_dashboard")
      .select("*")
      .or(orCondition)
      .order("created_at", { ascending: false });

    if (!error) setMatches(data ?? []);
    else console.error("Error fetching matches:", error);

    setLoading(false);
  };

  useEffect(() => {
  fetchMatches();

  const subscription = supabase
    .channel("public:child_likes_dashboard")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "child_likes" },
      () => fetchMatches()
    )
    .subscribe();

  return () => {
    // synchronous cleanup wrapper
    void (async () => {
      await supabase.removeChannel(subscription);
    })();
  };
}, [parent.children]);

  // ------------------- APPROVE / DECLINE -------------------
  const handleApprove = async (like_id: string) => {
    const { error } = await supabase
      .from("child_likes")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", like_id);
    if (error) console.error(error);
    else fetchMatches();
  };

  const handleDecline = async (like_id: string) => {
    const { error } = await supabase
      .from("child_likes")
      .update({ status: "rejected" })
      .eq("id", like_id);
    if (error) console.error(error);
    else fetchMatches();
  };

  const childIds = parent.children.map(c => c.id);

  const outgoingLikes = matches.filter(
    m => m.status === "pending" && childIds.includes(m.from_child)
  );

  const incomingLikes = matches.filter(
    m => m.status === "pending" && childIds.includes(m.to_child)
  );

  const matchToChild = (match: Match, outgoing: boolean): Child => {
    return outgoing
      ? {
          id: match.to_child,
          parent_id: match.to_parent_id,
          name: match.to_child_name ?? "Unknown",
          age: match.to_child_age ?? 0,
          bio: match.to_child_bio ?? "",
          games_ids: [],
          language_ids: [],
          hobbies_ids: [],
          interests_ids: [],
          play_type_ids: [],
          theme_ids: [],
          availability_ids: [],
          avatar_id: match.to_child_avatar ?? "👶",
        }
      : {
          id: match.from_child,
          parent_id: match.from_parent_id,
          name: match.from_child_name ?? "Unknown",
          age: match.from_child_age ?? 0,
          bio: match.from_child_bio ?? "",
          games_ids: [],
          language_ids: [],
          hobbies_ids: [],
          interests_ids: [],
          play_type_ids: [],
          theme_ids: [],
          availability_ids: [],
          avatar_id: match.from_child_avatar ?? "👶",
        };
  };

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
              outgoingLikes.map(match => {
                const kid = matchToChild(match, true);
                return (
                  <div key={match.like_id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex gap-5 flex-1 items-center">
                        <div className="text-5xl p-4 bg-purple-50 rounded-full">{kid.avatar_id}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{kid.name}</h3>
                          <p className="text-sm text-gray-500">Age {kid.age}</p>
                          <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">
                            Awaiting their approval
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 mt-3 lg:mt-0 min-w-[200px]">
                        <Button
                        size="sm"
                        className="bg-[#faa901] text-black hover:bg-[#f4b625] rounded-xl py-5 font-bold w-full lg:w-40"
                        onClick={() => setViewChild(kid)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 text-white hover:bg-red-600 rounded-xl py-5 font-bold w-full lg:w-40"
                          onClick={() => handleDecline(match.like_id)} 
                        >
                          Unlike
                        </Button>
                      </div>
                      
                    </div>
                  </div>
                );
              })
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
              incomingLikes.map(match => {
                const kid = matchToChild(match, false);
                return (
                  <div key={match.like_id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex gap-5 flex-1 items-center">
                        <div className="text-5xl p-4 bg-purple-50 rounded-full">{kid.avatar_id}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{kid.name}</h3>
                          <p className="text-sm text-gray-500">Age {kid.age}</p>
                          <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">
                            Awaiting your approval
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 mt-3 lg:mt-0 min-w-[200px]">
                        <Button
                        size="sm"
                        className="bg-[#faa901] text-black hover:bg-[#f4b625] rounded-xl py-5 font-bold flex gap-2 w-full"
                        onClick={() => setViewChild(kid)}
                        >
                          View Details
                        </Button>
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
                );
              })
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
