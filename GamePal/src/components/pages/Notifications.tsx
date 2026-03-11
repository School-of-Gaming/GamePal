import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ParentNav } from "../Nav";
import { Heart, UserPlus, CheckCircle, Eye } from "lucide-react";
import type { Parent } from "../../App";
import { supabase } from "../../supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
};

type NotificationsProps = {
  parent: Parent;
  onBack: () => void;
};

export function Notifications({ parent, onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // FETCH NOTIFICATIONS 
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", parent.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data ?? []);
  };

  useEffect(() => {
    fetchNotifications();

    //  REAL-TIME SUBSCRIPTION 
    const subscription = supabase
      .channel(`public:notifications_user_${parent.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${parent.id}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      void (async () => {
        await supabase.removeChannel(subscription);
      })();
    };
  }, [parent.id]);

  //  ICON MAPPING 
  const getIcon = (type: Notification) => {
    switch (type.type) {
      case "match_approved":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "match_rejected":
        return <Heart className="w-6 h-6 text-pink-600" />;
      case "message_received":
        return <UserPlus className="w-6 h-6 text-orange-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  //  MARK AS READ 
  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <ParentNav
        parent={parent}
        onLogout={() => {
          window.location.reload();
        }}
      />

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
          {notifications.length === 0 && (
            <p className="text-gray-500">No notifications yet.</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl shadow border ${
                n.is_read ? "bg-gray-50 border-gray-200" : "bg-[#FFFCEB] border-[#FFF5B8]"
              }`}
            >
              <div className="flex items-center gap-4">
                {getIcon(n)}
                <span className="text-black text-base">{n.body}</span>
              </div>

              {!n.is_read && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-400 text-gray-700 hover:bg-gray-100"
                  onClick={() => markAsRead(n.id)}
                >
                  <Eye className="w-4 h-4" /> Mark as Read
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}