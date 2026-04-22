# 🧒 GamerPal (Safe Parent-Controlled Social Matching Platform)

A secure, parent-managed web platform that helps parents connect their children with compatible friends or pen pals based on shared interests, games, and availability — while maintaining full control, privacy, and safety.

---

# 🚀 Project Description

GamerPal is designed to solve a real-world problem:

> How can children build friendships online safely without exposing them to unsafe or unmoderated communication?

This platform allows parents to:

- Create and manage child profiles 👨‍👩‍👧
- Define interests, games, and availability 🎮
- Find compatible matches based on shared preferences 🔍
- Approve or reject connection requests 🤝
- Control all communication and data sharing 🔐

Key Rule:
Children never interact directly with the platform and all actions are parent-controlled.

---

# 🏗 Architecture Overview

React Frontend → Supabase Backend (Auth + Database)

Flow:

1. Parent creates an account (18+ only)
2. Parent creates child profile(s)
3. Profile data is stored in Supabase database
4. Matching system filters compatible profiles
5. Parents can like or approve matches
6. Mutual approval reveals limited contact information
7. Optional small messaging triggers notifications

---

# 🧠 Technical Choices

## ⚛️ Frontend (React)
- React for component-based UI development
- TypeScript for type safety and maintainability
- Tailwind CSS for fast and responsive styling
- shadcn/ui for prebuilt accessible components
- CVA (Class Variance Authority) for UI variants
- Lucide React for icon system
- cn utility for conditional class handling

## 🐘 Backend (Supabase)
- Supabase Authentication (secure login + magic links)
- PostgreSQL database for structured data storage
- Row-level security for data protection
- Real-time ready architecture

---

# ⚙️ Setup and Running Instructions

1. Clone the repository:

git clone https://github.com/School-of-Gaming/GamePal.git
cd GamePal

2. Install dependencies:

npm install

3. Create a .env file in the root directory and add:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run the development server:

npm run dev

5. Open the application:

http://localhost:5173

---

# 🔐 Safety & Security Design

- Only users 18 years or older can register (parents only)
- Children do not create accounts or access the platform directly
- All interactions are parent-controlled
- Mutual approval is required before any connection is made
- Contact information is only revealed after approval from both sides
- Notifications are used for messaging
- Privacy-first design is enforced throughout the system

---

# ✨ Key Features

- Parent-managed child profiles
- Interest-based compatibility matching (games, hobbies, availability, language, theme, playtype, interest)
- Like and approval system between parents
- Privacy-controlled contact sharing
- Magic link authentication system
- Notifications for matches and updates
- Optional messaging via email

---

# ⚙️ Functionalities

- Parent authentication using Supabase
- Magic link login and recovery system
- Create, edit, and delete child profiles
- Compatibility-based filtering system
- Like, unlike, and match approval workflow
- Conditional disclosure of sensitive information
- Notification system for updates
- Dashboard-based navigation system

---

# 🧭 Pages Overview

Public Pages:
- Home Page (platform overview and safety information)
- Login / Sign-up page (18+ restriction enforced)

Parent Dashboard:
- Dashboard overview
- Kids manager (profile management)
- Find matches (browse and filter profiles)
- Potential matches (pending likes)
- Approved matches (mutual connections)
- Notifications center
- Settings page

---

# 💡 Expected Outcome

GamerPal provides a safe, structured, and privacy-focused environment where parents can help their children build friendships based on shared interests without exposing them to unsafe online interactions.

It combines social matching logic, strong privacy controls, a parent-first design philosophy, and a modern full-stack architecture.

---

# 👨‍💻 Author

Built as a full-stack web project focused on safe social interaction design, parent-controlled systems, modern React + Supabase architecture, and privacy-first engineering principles.

---

