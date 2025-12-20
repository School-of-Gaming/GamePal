import { useState } from "react";
import { Check, X, Calendar, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "./ParentNav";
import type { Parent } from "../../App";

type Match = {
  id: string;
  childName: string;
  childAge: number;
  avatar: string;
  parentName: string;
  parentEmail: string;
  commonTags: string[];
};

type PotentialMatchesProps = {
  parent: Parent;
  onBack: () => void;
};

export function PotentialMatches({ parent, onBack }: PotentialMatchesProps) {
  const [matches] = useState<Match[]>([
    {
      id: "1",
      childName: "Jordan",
      childAge: 9,
      avatar: "🦊",
      parentName: "Lisa Johnson",
      parentEmail: "lisa.johnson@email.com",
      commonTags: ["Minecraft", "English", "Gaming", "Co-op"],
    },
    {
      id: "2",
      childName: "Alex",
      childAge: 10,
      avatar: "🐱",
      parentName: "John Smith",
      parentEmail: "john.smith@email.com",
      commonTags: ["Roblox", "Fantasy", "Creative", "English"],
    },
  ]);

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  // Notification state
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

    console.log("Scheduled Meeting:", {
      date: meetingDate,
      time: meetingTime,
      parentName: selectedMatch?.parentName,
      parentEmail: selectedMatch?.parentEmail,
      childName: selectedMatch?.childName,
      notes: meetingNotes,
    });

    closeModal();

    // Show notification
    setNotification(
      `Meeting with ${selectedMatch?.parentName} (${selectedMatch?.childName}) scheduled successfully!`
    );
    setTimeout(() => setNotification(null), 4000); // Hide after 4 seconds
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white relative">
      <ParentNav parent={parent} />

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#faa901] text-black px-6 py-3 rounded-xl shadow-lg animate-slide-down">
          {notification}
        </div>
      )}

      <main className="flex-1 p-6 overflow-auto bg-[#f8f6fb]">
        {/* Back Button */}
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
        <div className="max-w-3xl mx-auto mb-6">
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

        {/* Match Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {matches.map((match) => (
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
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Parent Contact
                      </p>
                      <p className="text-sm font-medium text-gray-700">
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
                        {match.commonTags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-[#faa901] text-black font-medium px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold">
                      Awaiting approval
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 font-bold flex gap-2">
                    <Check className="w-5 h-5" />
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-5 font-bold flex gap-2"
                  >
                    <X className="w-5 h-5" />
                    Decline
                  </Button>

                  <Button
                    variant="ghost"
                    className="border border-gray-200 rounded-xl py-5 font-bold flex gap-2 text-white-700"
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

        {/* Schedule Meeting Modal */}
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
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Schedule a Meetup
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Set up a meeting with {selectedMatch.parentName} and{" "}
                {selectedMatch.childName}.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    min="1900-01-01"
                    max="2099-12-31"
                    className="w-full border-2 border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full border-2 border-purple-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Add any notes for the meeting..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  className="mt-2 w-full bg-[#faa901] text-black hover:bg-[#f4b625]"
                  onClick={handleScheduleMeeting}
                >
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
