import { useState } from "react";
import { User, Lock, ShieldCheck, AlertTriangle, Save, RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { ParentNav } from "./ParentNav";
import type { Parent } from "../../App";

type ProfileSettingsProps = {
  parent: Parent;
  onBack: () => void;
};

export function ProfileSettings({ parent, onBack }: ProfileSettingsProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password validation 
  const passwordRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

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

        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-700">
              Manage your account, security, and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">Profile Information</h2>
                  <p className="text-sm text-gray-800">Update your account details</p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-800">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={parent.name}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="email"
                      defaultValue={parent.email}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
                    />
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex gap-2">
                  <Save size={18} />
                  Save Profile
                </Button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">Change Password</h2>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </div>

              <form className="space-y-4">
                {/* Current Password */}
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-sm text-white hover:text-[#faa901]"
                  >
                    {showCurrent ? "Hide" : "Show"}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-sm text-white hover:text-[#faa901]"
                  >
                    {showNew ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password Requirements */}
                <ul className="text-sm space-y-1 ml-2">
                  <li className={passwordRules.length ? "text-green-600" : "text-gray-500"}>
                    • Minimum 8 characters
                  </li>
                  <li className={passwordRules.uppercase ? "text-green-600" : "text-gray-500"}>
                    • At least one uppercase letter
                  </li>
                  <li className={passwordRules.lowercase ? "text-green-600" : "text-gray-500"}>
                    • At least one lowercase letter
                  </li>
                  <li className={passwordRules.number ? "text-green-600" : "text-gray-500"}>
                    • At least one number
                  </li>
                </ul>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-sm text-white hover:text-[#faa901]"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Match Indicator */}
                {confirmPassword && (
                  <p className={`text-sm ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                    {passwordsMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
                  </p>
                )}

                <Button className="w-full bg-[#faa901] text-black hover:bg-[#f4b625]">
                  <RefreshCw size={18} />
                  Change Password
                </Button>
              </form>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="font-bold text-lg mb-6 text-gray-700">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-400">Account ID</p>
                <p className="font-semibold text-gray-800">{parent.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Children Registered</p>
                <p className="font-semibold text-gray-800">
                  {parent.children.length} {parent.children.length === 1 ? "child" : "children"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-800">Demo Account</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
          </div>

          {/* Safety & Privacy */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <ShieldCheck size={20} />
                <h3 className="font-bold">Your Information is Safe</h3>
              </div>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Email shared only with matched parents</li>
                <li>• No third-party data sharing</li>
                <li>• Secure & encrypted data</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3 text-yellow-700">
                <AlertTriangle size={20} />
                <h3 className="font-bold">Important Reminders</h3>
              </div>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Verify parents before meetings</li>
                <li>• Monitor your child's interactions</li>
              </ul>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-100 p-8">
            <h2 className="font-bold text-lg text-red-600 mb-4">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-6">
              Deleting your account permanently removes all profiles and matches.
            </p>
            <Button variant="outline" className="border-red-200 text-red-600">
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
