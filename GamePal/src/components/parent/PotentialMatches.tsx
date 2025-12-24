import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "./ParentNav";
import type { Parent } from "../../App";

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
    },
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
    },
  ]);

  const [viewChild, setViewChild] = useState<Match | null>(null);

  const handleApprove = (id: string) => {
    setIncomingLikes(prev => prev.filter(m => m.id !== id));
  };

  const handleDecline = (id: string) => {
    setIncomingLikes(prev => prev.filter(m => m.id !== id));
  };

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
                        onClick={() => setViewChild(match)}
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
                      onClick={() => setViewChild(match)}
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
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-6xl">{viewChild.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-black">{viewChild.childName}</h2>
                  <p className="text-base text-gray-500">Age: {viewChild.childAge}</p>
                </div>
              </div>

              {/* About Section */}
              {viewChild.bio && (
                <>
                  <h3 className="text-lg font-bold mb-1 border-b pb-1 text-black">About</h3>
                  <p className="text-sm text-gray-700 mb-4">{viewChild.bio}</p>
                </>
              )}

              {/* Interest Sections */}
              <div className="space-y-3">
                {viewChild.games && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">Games:</strong>
                    {viewChild.games.map((item, index) => (
                      <span key={index} className="text-xs bg-purple-100 text-purple-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {viewChild.language && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">Languages:</strong>
                    {viewChild.language.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {viewChild.hobbies && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">Hobbies:</strong>
                    {viewChild.hobbies.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {viewChild.interests && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">General Interests:</strong>
                    {viewChild.interests.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {viewChild.playType && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">Play Type:</strong>
                    {viewChild.playType.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {viewChild.theme && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm w-full text-black">Theme:</strong>
                    {viewChild.theme.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
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
      </main>
    </div>
  );
}
