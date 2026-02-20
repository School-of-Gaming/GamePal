import { useState, useEffect } from "react";
import { Calendar, Info, X } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "../Nav";
import type { Parent } from "../../App";
import type { Child } from "../../App";
import { ChildDetailsModal } from "../child/ChildDetailsModal";
import { supabase } from "../../supabase/client";

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
  availability: string[];
};

type ApprovedMatchesProps = {
  parent: Parent;
  onBack: () => void;
};

export function ApprovedMatches({ parent, onBack }: ApprovedMatchesProps) {
  const [approvedMatches, setApprovedMatches] = useState<Match[]>([]);
  const [viewChild, setViewChild] = useState<Child | null>(null);

  // Modal + scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [timeFormat, setTimeFormat] = useState<"24" | "12">("24");
  const [ampm, setAmPm] = useState<"AM" | "PM">("AM");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // FETCH APPROVED MATCHES FROM VIEW
  useEffect(() => {
    fetchApprovedMatches();
  }, []);

  const fetchApprovedMatches = async () => {
    const { data, error } = await supabase
      .from("approved_matches_dashboard")
      .select("*")
      .order("approved_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved matches:", error);
      return;
    }

    // Convert DB rows into your existing Match structure
    const formatted: Match[] =
      data?.map((row: any) => ({
        id: row.match_id,
        childName: row.other_child_name,
        childAge: row.other_child_age,
        avatar: row.other_child_avatar ?? "🧒",
        bio: row.other_child_bio ?? "",
        games: [],
        language: [],
        hobbies: [],
        interests: [],
        playType: [],
        theme: [],
        parentName: row.other_parent_name,
        parentEmail: row.other_parent_email,
        commonTags: [],
        availability: [],
      })) ?? [];

    setApprovedMatches(formatted);
  };

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

    let formattedTime = "";
    if (timeFormat === "24") {
      formattedTime = meetingTime;
    } else {
      // Convert 12-hour + AM/PM to 24-hour internally
      let [h, m] = meetingTime.split(":").map(Number);
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      formattedTime = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
    }

    closeModal();

    setNotification(
      `Meeting with ${selectedMatch?.childName} scheduled on ${meetingDate} at ${formattedTime}!`
    );

    setTimeout(() => setNotification(null), 5000);
  };

    const matchToChild = (match: Match): Child => ({
    id: match.id,
    parent_id: "", 
    name: match.childName,
    age: match.childAge,
    bio: match.bio ?? "",
    games_ids: [],       
    language_ids: [],    
    hobbies_ids: [],
    interests_ids: [],
    play_type_ids: [],
    theme_ids: [],
    availability_ids: [],
    avatar_id: match.avatar ?? undefined, 
    });

  return (
    <div className="flex flex-col h-screen w-screen bg-white relative">
      <ParentNav parent={parent}
      onLogout={() => {
      window.location.reload();
      }} />

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
              <h3 className="text-lg font-bold text-[#857000] mb-1 flex items-center gap-2">
                <span className="text-xl">🦉</span> You’re Connected 🎉
              </h3>
              <p className="text-sm text-[#857000]/80 font-medium">
                You can schedule a meeting with the child's guardian. Always meet with the guardian together with their child before pursuing further interactions. 
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

                    <span className="inline-block bg-green-50 border border-green-200 text-green-700 px-4 py-1 rounded-full text-xs font-bold">
                      Approved Match
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 font-bold flex gap-2"
                    onClick={() => setViewChild(matchToChild(match))} 
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
                  onChange={(e) => setTimeFormat(e.target.value as "12" | "24")}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="24">24-hour format</option>
                  <option value="12">12-hour format (AM/PM)</option>
                </select>

                {/* --------- FIX START: Proper 24/12-hour input handling --------- */}
                <div className="flex gap-2 items-center">
                  {timeFormat === "24" ? (
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="flex-1 border-2 border-purple-400 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={meetingTime ? Number(meetingTime.split(":")[0]) : ""}
                        onChange={(e) => {
                          const h = Math.min(12, Math.max(1, Number(e.target.value) || 1));
                          const m = meetingTime ? meetingTime.split(":")[1] : "00";
                          setMeetingTime(`${h.toString().padStart(2, "0")}:${m}`);
                        }}
                        className="w-16 border-2 border-purple-400 rounded-lg px-2 py-1 text-center"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={meetingTime ? Number(meetingTime.split(":")[1]) : ""}
                        onChange={(e) => {
                          const m = Math.min(59, Math.max(0, Number(e.target.value) || 0));
                          const h = meetingTime ? meetingTime.split(":")[0] : "12";
                          setMeetingTime(`${h.padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
                        }}
                        className="w-16 border-2 border-purple-400 rounded-lg px-2 py-1 text-center"
                      />
                      <select
                        value={ampm}
                        onChange={(e) => setAmPm(e.target.value as "AM" | "PM")}
                        className="border-2 border-purple-400 rounded-lg px-3 py-1"
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </>
                  )}
                </div>
                {/* --------- FIX END --------- */}

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
          <ChildDetailsModal
            child={viewChild}
            onClose={() => setViewChild(null)}
          />
        )}


      </main>
    </div>
  );
}
