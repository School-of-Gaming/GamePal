import { LogOut } from "lucide-react";
import type { Parent } from "../App";

type ParentNavProps = {
  parent: Parent;
  onLogout: () => void;
};

export function ParentNav({ parent, onLogout }: ParentNavProps) {
  return (
    <nav className="bg-gray-100 shadow-sm border-b w-full">
      <div className="px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="text-3xl">👨‍👩‍👧‍👦</div>
          <div>
            <h2 className="text-purple-700 text-xl font-bold">GamerPal</h2>
            <p className="text-gray-600 text-sm">Welcome, {parent.name}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2  text-sm font-semibold text-gray-700  bg-transparent  px-3 py-2 rounded-lg hover:bg-[#faa901] hover:text-black transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>
    </nav>
  );
}
