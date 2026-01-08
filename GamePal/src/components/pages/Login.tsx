import { useState } from "react";
import { Button } from "../ui/button";
import type { Parent } from "../../App";

type LoginProps = {
  onLogin: (parent: Parent) => void;
  onBack: () => void;
  onGoToSignup: () => void;
};

export function Login({ onLogin, onBack, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parent: Parent = {
      id: "p" + Date.now(),
      name: "Alice Smith",
      email,
      children: [],
    };

    onLogin(parent);
  };

  return (
     <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl w-96 shadow-2xl flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-purple-600 text-center">Welcome Back! 👋</h1>
      <h3 className="text-gray-700 text-center">Login to your GamerPal account</h3>

      <input
        type="email"
        placeholder="Email"
        className="border rounded-md p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border rounded-md p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        Login
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
