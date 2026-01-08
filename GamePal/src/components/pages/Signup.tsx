import { useState } from "react";
import { Button } from "../ui/button";
import type { Parent } from "../../App";

type SignupProps = {
  onSignup: (parent: Parent) => void;
  onBack: () => void;
  onGoToLogin: () => void;
};

const countries = ["USA", "Canada", "UK", "Australia", "Other"]; // Example

export function Signup({ onSignup, onBack, onGoToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [showUnderage, setShowUnderage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof age === "number" && age < 18) {
      setShowUnderage(true);
      return;
    }

    const parent: Parent = {
      id: "p" + Date.now(),
      name,
      email,
      children: [],
    };

    onSignup(parent);
  };

  return (
    <>
      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-purple-600 text-center">Join GamerPal! 🎉</h1>
        <h3 className="text-gray-700 text-center">Create your account to get started</h3>

        <input
          type="text"
          placeholder="Full Name"
          className="border rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <select
          className="border rounded-md p-2"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="">Select your country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Your Age"
          className="border rounded-md p-2"
          min={5}
          max={120}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          required
        />

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Create Account
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <button type="button" onClick={onGoToLogin} className="text-purple-600 underline">
            Login
          </button>
        </p>

        <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
          ← Back
        </Button>
      </form>

      {/* Underage Dialog */}
      {showUnderage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowUnderage(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              ✕
            </button>
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl text-orange-600">
                Oops! You Need a Grown-Up! 🎈
              </h2>
              <p className="text-orange-900">
                GamerPal is super cool, but you need to be <strong>18 or older</strong> to create an account.
              </p>
              <p className="text-orange-900">
                <strong>No worries though!</strong> Ask your parent or guardian to sign up. They'll help you find awesome friends! 🌟
              </p>
              <Button
                onClick={() => setShowUnderage(false)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Got It! I'll Get My Guardian
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
