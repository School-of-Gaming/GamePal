import type { Parent } from "../../App";
import { ParentNav } from "../Nav";
import { Users, Search, Heart, CheckCircle, Bell, UserCog } from "lucide-react";

type ParentDashboardProps = {
  parent: Parent;
  onGoToKidsManager: () => void;
  onGoToMatchmaking: () => void;
  onGoToPotentialMatches: () => void;
  onGoToApprovedMatches: () => void;
  onGoToNotifications: () => void;
  onGoToSettings: () => void;
  onLogout: () => void;
};

export function ParentDashboard({ parent, onGoToKidsManager , onGoToMatchmaking, onGoToPotentialMatches, onGoToApprovedMatches, onGoToNotifications,  onGoToSettings, onLogout,}: ParentDashboardProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} onLogout={onLogout}/>

      <main className="flex-1 w-full p-6 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-700">
            Manage your children's profiles and matches
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div
            onClick={onGoToKidsManager}
            className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <Users className="w-8 h-8 mb-3 text-purple-700" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Kids Manager</h3>
            <p className="text-gray-700">
              {parent.children.length} {parent.children.length === 1 ? "child" : "children"} registered
            </p>
          </div>

          <div
            onClick={onGoToMatchmaking}   
            className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <Search className="w-8 h-8 mb-3 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Find Matches</h3>
            <p className="text-gray-700">Browse potential Playdates</p>
          </div>

          <div
            onClick={onGoToPotentialMatches}
            className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <Heart className="w-8 h-8 mb-3 text-pink-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Playdate Request</h3>
            <p className="text-gray-700">Incoming and outgoing playdates requests awaiting approval</p>
          </div>


          <div
            onClick={onGoToApprovedMatches}
            className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-8 h-8 mb-3 text-green-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Approved Matches
            </h3>
            <p className="text-gray-700">
              View confirmed friendships
            </p>
          </div>

          <div 
           onClick={onGoToNotifications}
           className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
            <Bell className="w-8 h-8 mb-3 text-orange-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Notifications</h3>
            <p className="text-gray-700">Stay updated on activities</p>
          </div>

          <div 
            onClick={onGoToSettings}
            className="p-6 rounded-2xl shadow-md bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
            <UserCog className="w-8 h-8 mb-3 text-gray-700" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Settings</h3>
            <p className="text-gray-700">Manage your profile</p>
          </div>
        </div>
      </main>
    </div>
  );
}
