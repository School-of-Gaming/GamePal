import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "./Nav";
import type { Parent } from "../../App";
import type { Child } from "../../App";
import { ChildDetailsModal } from "../child/ChildDetailsModal";

type Match = {
  id: string;
  childName: string;
  childAge: number;
  avatar: string;
  bio?: string;
  games?: string[];
  language?: string[];
  hobbies?: string[];
  interests?: string[];
  playType?: string[];
  theme?: string[];
  commonTags: string[];
  availability: string[];
};

type PotentialMatchesProps = {
  parent: Parent;
  onBack: () => void;
};

export function PotentialMatches({ parent, onBack }: PotentialMatchesProps) {
  const [outgoingLikes] = useState<Match[]>([
    {
      id: "1",
      childName: "Jordan",
      childAge: 9,
      avatar: "🦊",
      bio: "Loves Minecraft and drawing.",
      games: ["Minecraft", "Roblox"],
      language: ["English"],
      hobbies: ["Drawing", "Gaming"],
      interests: ["Adventure", "Animals"],
      playType: ["Co-op", "Casual"],
      theme: ["Fantasy"],
      commonTags: ["Minecraft", "English", "Gaming", "Co-op"],
      availability: ["Morning", "Afternoon"],
    }
  ]);

  const [incomingLikes, setIncomingLikes] = useState<Match[]>([
    {
      id: "2",
      childName: "Alex",
      childAge: 10,
      avatar: "🐱",
      bio: "Enjoys Roblox and creative games.",
      games: ["Roblox", "Fortnite"],
      language: ["English", "Spanish"],
      hobbies: ["Building", "Gaming"],
      interests: ["Fantasy", "Creative"],
      playType: ["Single Player", "Co-op"],
      theme: ["Adventure"],
      commonTags: ["Roblox", "Fantasy", "Creative", "English"],
      availability: ["Morning", "Afternoon"],
    },
  ]);

  const [viewChild, setViewChild] = useState<Child | null>(null);

  const handleApprove = (id: string) => {
    setIncomingLikes(prev => prev.filter(m => m.id !== id));
  };

  const handleDecline = (id: string) => {
    setIncomingLikes(prev => prev.filter(m => m.id !== id));
  };

  const matchToChild = (match: Match): Child => ({
  id: match.id,
  name: match.childName,
  age: match.childAge,
  avatar: match.avatar,
  bio: match.bio ?? "",
  games: match.games ?? [],
  language: match.language ?? [],
  hobbies: match.hobbies ?? [],
  interests: match.interests ?? [],
  playType: match.playType ?? [],
  theme: match.theme ?? [],
  availability: match.availability ?? [],
});


  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} />

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
            Potential Matches
          </h1>
          <p className="text-gray-700">
            Review compatible playmates for your children
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

            {outgoingLikes.map(match => (
              <div
                key={match.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex gap-5">
                  <div className="text-5xl p-4 bg-purple-50 rounded-full">
                    {match.avatar}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {match.childName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Age {match.childAge}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setViewChild(matchToChild(match))}
                      >
                        View Details
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Common with your child:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.commonTags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#faa901] text-black font-medium px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">
                      Awaiting their approval
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-800"></div>


           {/* RIGHT — THEY LIKED YOU */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              ✅ Awaiting Your Approval
            </h2>

            {incomingLikes.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex gap-5 flex-1 flex-col">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {match.childName}
                      </h3>
                      <p className="text-sm text-gray-500">Age {match.childAge}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Common with your child:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.commonTags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#faa901] text-black font-medium px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-3 lg:mt-0 min-w-[200px]">
                    <Button
                      size="sm"
                      className="bg-[#faa901] text-black hover:bg-[#f4b625] rounded-xl py-5 font-bold flex gap-2 w-full"
                      onClick={() => setViewChild(matchToChild(match))}
                    >
                      View Details
                    </Button>

                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 font-bold flex gap-2 w-full"
                      onClick={() => handleApprove(match.id)}
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </Button>

                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-5 font-bold flex gap-2 w-full"
                      onClick={() => handleDecline(match.id)}
                    >
                      <X className="w-5 h-5" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
