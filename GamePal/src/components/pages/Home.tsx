import { useState } from "react";
import { Button } from "../ui/button";
import { Sparkles, Users, Zap, Heart, Shield, CheckCircle, Star, Badge } from "lucide-react";
import { Login } from "./Login"; 
import { Signup } from "./Signup";
import type { Parent } from "../../App";

type HomeProps = {
  onLogin: (parent: Parent) => void;
  onSignup: (parent: Parent) => void;
};

export function Home({ onLogin, onSignup }: HomeProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-auto bg-gradient-to-br from-purple-600 to-yellow-400">
      {/* Floating decorative emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🎮</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce">🎯</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce">🌟</div>
        <div className="absolute bottom-10 right-40 text-6xl animate-bounce">🚀</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce">⭐</div>
        <div className="absolute top-1/3 right-1/3 text-5xl animate-bounce">🎪</div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">GamerPal</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowLogin(true)}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Login
          </Button>
          <Button
            onClick={() => setShowSignup(true)}
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-white text-5xl md:text-7xl mb-4 animate-bounce">
          Welcome to GamerPal! 🎮
        </h1>
        <p className="text-white/95 text-2xl md:text-3xl max-w-3xl mx-auto">
          The safest place for kids to find gaming friends!
        </p>
        <p className="text-white/90 text-xl max-w-2xl mx-auto mt-2">
          Parents connect, kids play – it's that simple!
        </p>
      </main>

      {/* Info Sections */}
      <div className={`relative z-10 px-6 pb-12 space-y-16 transition-all duration-300 ${showLogin || showSignup ? "filter blur-sm pointer-events-none select-none" : ""}`}>

        {/* About */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-purple-600 text-3xl">What is GamerPal?</h2>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              GamerPal is a <strong>parent-supervised matchmaking platform </strong> 
              where kids can find friends who love the same games, interest, hobbies, etc. Basically a pen-pal where they can have fun with! 
              Parents stay in control while kids discover amazing buddies their age.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[{
            icon: Users, title: "1. Guardian Create Profiles", text: "Set up your child's profile with their favorite games, hobbies, likes, playtypes, themes and interests!", color: "purple"
          },{
            icon: Zap, title: "2. Smart Matching", text: "Our algorithm finds perfect buddies based on age, games, hobbies, playtypes, themes, language, interests and their availabilities!", color: "orange"
          },{
            icon: Heart, title: "3. Parents Connect", text: "Both guardians approve the match, then connect. They can also schedule meeting time and date through us!", color: "green"
          }].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform`}>
                <div className={`bg-gradient-to-br from-${item.color}-500 to-${item.color}-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-${item.color}-600 text-xl mb-2`}>{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            )
          })}
        </div>

        {/* Safety First */}
        <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-orange-500 p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-10 h-10 text-orange-600" />
              <h2 className="text-orange-600 text-3xl">Safety First! 🛡️</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto">
              {[
                {title: "Parent-Only Control", text: "Only parents can create accounts and manage matches. Complete oversight guaranteed!"},
                {title: "Dual Approval System", text: "Both parents must approve before contact information is shared."},
                {title: "No Direct Kid Contact", text: "Kids never chat with strangers. Parents connect via email or whatever medium they prefer first!"},
                {title: "Verification Encouraged", text: "We recommend video calls before any in-person meetups."}
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg mb-1 text-gray-900">{item.title}</h4>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Star className="w-10 h-10 text-purple-600" />
              <h2 className="text-purple-600 text-3xl">Community Guidelines 📜</h2>
            </div>
            <div className="text-left max-w-3xl mx-auto space-y-4">
              {[
                {title:"Be Respectful", desc:"Treat other families with kindness and respect."},
                {title:"Verify First", desc:"Always verify identities via video call before meeting in person."},
                {title:"Supervise Play", desc:"Parents should supervise gaming sessions, especially for younger children."},
                {title:"Report Issues", desc:"If something doesn't feel right, report it immediately."},
                {title:"Public First Meetups", desc:"First meetups should always be in public places."}
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Badge className="bg-purple-600 text-white text-lg px-3 py-1 mt-1">{i+1}</Badge>
                  <p className="text-gray-700 flex-1"><strong>{item.title}:</strong> {item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons Above Footer */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button
            onClick={() => setShowSignup(true)}
            size="lg"
            className="px-12 py-6 rounded-full text-xl bg-white hover:bg-white/90 text-purple-600"
          >
            Get Started Free!
          </Button>
          <Button
            onClick={() => setShowLogin(true)}
            size="lg"
            variant="outline"
            className="px-12 py-6 rounded-full text-xl bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Already a Member? Login
          </Button>
        </div>

      </div>

      {/* Login Modal */}
        {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
            <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
                ✕
            </button>
            <Login
                onLogin={(parent) => { setShowLogin(false); onLogin(parent); }}  // <--- pass Parent up
                onBack={() => setShowLogin(false)}
                onGoToSignup={() => { setShowLogin(false); setShowSignup(true); }}
            />
            </div>
        </div>
        )}

        {/* Signup Modal */}
        {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
            <button
                onClick={() => setShowSignup(false)}
                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
                ✕
            </button>
             <Signup
              onSignup={(parent) => { setShowSignup(false); onSignup(parent); }}  // <--- pass Parent up
              onBack={() => setShowSignup(false)}
              onGoToLogin={() => { setShowSignup(false); setShowLogin(true); }}
            />
            </div>
        </div>
        )}


      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/80">
        <p>Made with ❤️ for safe pen-pal friendships</p>
        <p className="text-sm mt-2">© 2026 GamerPal</p>
      </footer>
    </div>
  );
}
