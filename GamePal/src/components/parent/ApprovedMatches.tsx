import { useState } from "react";
import { Calendar, Info, X } from "lucide-react";
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
  parentName: string;
  parentEmail: string;
  commonTags: string[];
};

type ApprovedMatchesProps = {
  parent: Parent;
  onBack: () => void;
};

export function ApprovedMatches({ parent, onBack }: ApprovedMatchesProps) {
  const [approvedMatches] = useState<Match[]>([
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
      parentName: "Lisa Johnson",
      parentEmail: "lisa.johnson@email.com",
      commonTags: ["Minecraft", "English", "Gaming", "Co-op"],
    },
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
      parentName: "John Smith",
      parentEmail: "john.smith@email.com",
      commonTags: ["Roblox", "Fantasy", "Creative", "English"],
    },
  ]);

const [viewChild, setViewChild] = useState<Match | null>(null);

  // Modal + scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [timeFormat, setTimeFormat] = useState<"24" | "12">("24");
  const [ampm, setAmPm] = useState<"AM" | "PM">("AM");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const openModal = (match: Match) => {
    setSelectedMatch(match);
    setShowScheduleModal(true);
  };

  const closeModal = () => {
    setShowScheduleModal(false);
    setSelectedMatch(null);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingNotes("");
  };

  const handleScheduleMeeting = () => {
    if (!meetingDate || !meetingTime) {
      alert("Please select both date and time");
      return;
    }

     const formattedTime =
      timeFormat === "24"
        ? meetingTime
        : meetingTime +
          " " +
          ampm;

    closeModal();

    setNotification(
      `Meeting with ${selectedMatch?.childName} scheduled on ${meetingDate} at ${formattedTime}!`
    );
    setTimeout(() => setNotification(null), 5000);
  };

  // Helper to convert 24-hour to 12-hour for display
   const convert24To12 = (time24: string) => {
    if (!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    let period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    setAmPm(period);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white relative">
      <ParentNav parent={parent} />

      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#faa901] text-black px-6 py-3 rounded-xl shadow-lg">
          {notification}
        </div>
      )}

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
            Approved Matches
          </h1>
          <p className="text-gray-700">
            These matches are mutually approved
          </p>
        </div>

        {/* Safety Banner */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-[#FFFCEB] border border-[#FFF5B8] rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-[#857000] mt-1" />
            <div>
              <h3 className="text-lg font-bold text-[#857000] mb-1">
                You’re Connected 🎉
              </h3>
              <p className="text-sm text-[#857000]/80 font-medium">
                You can now contact parents and schedule meetups.
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {approvedMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Info */}
                <div className="flex gap-5 flex-1">
                  <div className="text-5xl p-4 bg-purple-50 rounded-full">
                    {match.avatar}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {match.childName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Age {match.childAge}
                      </p>
                    </div>

                    {/* Parent Contact */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Parent Contact
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        👤 {match.parentName}
                      </p>
                      <p className="text-sm font-medium text-purple-600">
                        ✉️ {match.parentEmail}
                      </p>
                    </div>

                    {/* Common Tags */}
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

                    <span className="inline-block bg-green-50 border border-green-200 text-green-700 px-4 py-1 rounded-full text-xs font-bold">
                      Approved Match
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 font-bold flex gap-2"
                    onClick={() => setViewChild(match)} 
                    >
                    View Details
                    </Button>

                  <Button
                    variant="ghost"
                    className="border border-gray-200 text-white hover:text-[#faa901] rounded-xl py-5 font-bold flex gap-2"
                    onClick={() => openModal(match)}
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Modal */}
         {showScheduleModal && selectedMatch && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
                
              <button
                className="absolute top-3 right-3 bg-red-600 text-white-700 hover:text-gray-900"
                onClick={closeModal}
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-black" />
                Schedule a Meetup
              </h2>

              <div className="space-y-4">
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full border-2 border-purple-400 rounded-lg px-4 py-2"
                />

                <select
                  value={timeFormat}
                  onChange={(e) => {
                    const newFormat = e.target.value as "12" | "24";
                    setTimeFormat(newFormat);

                    if (newFormat === "12") convert24To12(meetingTime);
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="24">24-hour format</option>
                  <option value="12">12-hour format (AM/PM)</option>
                </select>

                <div className="flex gap-2 items-center">
                  <input
                    type="time"
                    value={
                      timeFormat === "24"
                        ? meetingTime
                        : convert24To12(meetingTime)
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (timeFormat === "24") {
                        setMeetingTime(val);
                      } else {
                        const [h, m] = val.split(":").map(Number);
                        const hours24 = ampm === "PM" ? (h % 12) + 12 : h % 12;
                        setMeetingTime(
                          `${hours24.toString().padStart(2, "0")}:${m
                            .toString()
                            .padStart(2, "0")}`
                        );
                      }
                    }}
                    className="flex-1 border-2 border-purple-400 rounded-lg px-4 py-2"
                  />

                  {timeFormat === "12" && (
                    <select
                      value={ampm}
                      onChange={(e) => {
                        const newAmPm = e.target.value as "AM" | "PM";
                        setAmPm(newAmPm);
                        const [hours, minutes] = meetingTime
                          .split(":")
                          .map(Number);
                        const newHours =
                          newAmPm === "PM" ? (hours % 12) + 12 : hours % 12;
                        setMeetingTime(
                          `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(
                            2,
                            "0"
                          )}`
                        );
                      }}
                      className="border-2 border-purple-400 rounded-lg px-3 py-2"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full border bg-gray-50 rounded-lg px-4 py-2"
                  placeholder="Add notes..."
                />
              </div>

              <Button
                className="mt-6 w-full bg-[#faa901] text-black hover:bg-[#f4b625]"
                onClick={handleScheduleMeeting}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        )}

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
