import { useState } from "react";
import { Button } from "../ui/button";
import type { Parent } from "../../App";
import { loginWithPassword, loginWithEmail } from "../../supabase/auth";
import { supabase } from "../../supabase/client";

type LoginProps = {
  onLogin: (parent: Parent) => void;
  onBack: () => void;
  onGoToSignup: () => void;
};

export function Login({ onLogin, onBack, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async () => {
    setLoading(true);
    const { data, error, success } = await loginWithPassword(email, password);
    if (!success || !data.user) {
      alert(error?.message || "Login failed");
      setLoading(false);
      return;
    }

    // Fetch profile from Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      alert("Profile not found!");
      setLoading(false);
      return;
    }

    setLoading(false);
    onLogin({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      children: profile.children || [],
    });
  };

  const handleMagicLink = async () => {
    setLoading(true);
    const { success, error } = await loginWithEmail(email);
    if (!success) {
      alert(error?.message || "Magic link failed");
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
     <form
      onSubmit={e => { e.preventDefault(); handlePasswordLogin(); }}
      className="bg-white p-8 rounded-2xl w-96 shadow-2xl flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-purple-600 text-center">Welcome Back! 👋</h1>
      <h3 className="text-gray-700 text-center">Login to your GamerPal account</h3>

      <input
        type="email"
        placeholder="Email"
        className="border rounded-md p-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border rounded-md p-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
      <Button type="button" className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={handleMagicLink} disabled={loading}>
        {loading ? "Sending link..." : "Login via Magic Link / OTP"}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        No account?{" "}
        <button type="button" onClick={onGoToSignup} className="text-purple-600 underline">
          Sign up
        </button>
      </p>

      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        ← Back
      </Button>
    </form>
  );
}
