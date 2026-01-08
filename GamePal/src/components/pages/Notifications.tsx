import { Button } from "../ui/button";
import { ParentNav } from "../Nav";
import { Heart, UserPlus, CheckCircle } from "lucide-react";
import type { Parent } from "../../App";

type NotificationsProps = {
  parent: Parent;
  onBack: () => void;
};

export function Notifications({ parent, onBack }: NotificationsProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav parent={parent} />

      <main className="flex-1 p-6 overflow-auto bg-[#f8f6fb]">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-white hover:text-[#faa901]"
        >
          &larr; Back
        </Button>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-700">Your recent messages and updates</p>
        </div>

        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-4 bg-[#FFFCEB] border border-[#FFF5B8] px-6 py-4 rounded-xl shadow">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-black text-base">
              Meeting with Jordan scheduled on 2026-01-01 at 15:00!
            </span>
          </div>

          <div className="flex items-center gap-4 bg-[#FFFCEB] border border-[#FFF5B8] px-6 py-4 rounded-xl shadow">
            <Heart className="w-6 h-6 text-pink-600" />
            <span className="text-black text-base">You liked Lia's profile!</span>
          </div>

          <div className="flex items-center gap-4 bg-[#FFFCEB] border border-[#FFF5B8] px-6 py-4 rounded-xl shadow">
            <UserPlus className="w-6 h-6 text-orange-600" />
            <span className="text-black text-base">
              Alex liked your child and is awaiting your approval!
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
