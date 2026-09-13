# 🌿 Life RPG — Cozy Study Sanctuary

Turn your real-life tasks into a peaceful RPG. Complete quests, level up your character, grow your attributes, and decorate a personal 3D study room — all backed by a real database, so nothing you earn is ever lost.

> Traditional to-do apps feel like chores. Life RPG borrows the instant feedback loops of video games — XP bars, level-ups, streaks, and a room you get to decorate — to make daily productivity actually feel rewarding.

**Live App:** https://client-ten-mauve-91.vercel.app/
**Demo Video:** https://life-rpg-mh8f.onrender.com
---

## ✨ Features

- **Secure Auth** — email/password signup and login via Supabase Auth, with full session persistence across refreshes.
- **Quest System** — create, edit, complete, and delete quests (tasks), each tied to a character attribute.
- **Non-Linear Progression Engine** — XP required per level scales with `100 * level^1.5`, calculated entirely server-side to prevent tampering. Supports multi-level-ups from a single quest.
- **Character Attributes** — Focus, Discipline, Vitality, and Creativity each level independently based on the type of quest you complete.
- **Streak Tracking** — timezone-safe (UTC) consecutive-day tracking with a running longest-streak record.
- **Cozy Study Emporium (Shop)** — spend earned Cozy Coins on decor, companions, and badges.
- **3D Study Sanctuary** — an interactive low-poly 3D room (React Three Fiber) where your equipped decor and companion actually appear, with orbit controls and spring-animated item placement.
- **Fully Responsive & Accessible** — keyboard-navigable, screen-reader-friendly (ARIA labels, semantic HTML, focus trapping in modals), tested at mobile/tablet/desktop breakpoints.
- **Robust Error Handling** — error boundaries, offline detection, optimistic UI with rollback, and graceful empty/invalid states throughout.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), TailwindCSS, Framer Motion |
| 3D Rendering | React Three Fiber, @react-three/drei |
| Backend | Node.js, Express |
| Database & Auth | Supabase (PostgreSQL + Row Level Security, Supabase Auth) |
| Hosting | Vercel (frontend), Render (backend) |

---

## 🏗️ Architecture Overview

```
life-rpg/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # QuestList, ShopCatalog, Dashboard, Room, CelebrationModal, Toast
│   │   ├── context/       # Auth/session context
│   │   └── lib/           # Supabase client
│   └── .env.example
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/        # quests.js, items.js, inventory.js, auth middleware
│   │   └── middleware/    # JWT verification
│   └── .env.example
└── README.md
```

**Security model:** every API route verifies the Supabase JWT server-side and scopes all database operations to the authenticated user's ID — never trusting a client-submitted `user_id`. Row Level Security policies on every table provide a second layer of protection at the database level, so even a direct database query can't read or modify another user's data.

---

## 🎮 Core Systems Explained

### Progression Engine
XP and level calculations happen entirely on the server inside the quest-completion endpoint. The formula `xp_to_next_level = round(100 * level^1.5)` means each level costs progressively more XP, so early levels feel fast and later levels feel earned. A single quest completion can trigger multiple level-ups if the XP reward is large enough.

### Streaks
Completion dates are compared in UTC to avoid timezone edge cases. Completing a quest the day after your last completion increments your streak; skipping a day resets it; completing multiple quests on the same day doesn't inflate it.

### Economy
Completing quests earns Cozy Coins alongside XP. Coins are spent in the Study Emporium on decor, a companion, or badges — all of which persist to your account and can be equipped/unequipped from the Scholar's Trunk panel in the 3D room.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account/project

### 1. Clone the repo
```bash
git clone [YOUR REPO URL]
cd life-rpg
```

### 2. Set up the database
- Create a new Supabase project.
- Run the SQL migration files found in `/server/migrations` (or paste them into the Supabase SQL Editor) to create the `characters`, `quests`, `streaks`, `items`, and `inventory` tables with RLS policies and seed data.

### 3. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in .env with your Supabase URL, service role key, and database URL
npm start
```

### 4. Frontend setup
```bash
cd client
npm install
cp .env.example .env
# Fill in .env with your Supabase URL, anon key, and the backend API URL
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) with the API at `http://localhost:5000` (or whatever port you configured).

---

## 🔑 Environment Variables

### `/server/.env.example`
```
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_supabase_postgres_connection_string
```

### `/client/.env.example`
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🌐 Deployment

- **Frontend:** deployed to Vercel, root directory `client`, auto-deploys on push to `main`.
- **Backend:** deployed to Render, root directory `server`, auto-deploys on push to `main`.
- **Database:** managed Supabase Postgres instance with Row Level Security enabled on all user-data tables.

---

## ♿ Accessibility

- Full keyboard navigation for all interactive elements outside the 3D canvas (the 3D room's placement actions are also available via keyboard-operable buttons in the side panel, so no functionality requires a mouse).
- ARIA labels on icon-only buttons, `role="progressbar"` on XP bars, `role="status"`/`"alert"` on toasts.
- Focus trapping and Escape-to-close on modals.
- WCAG AA color contrast verified on the core palette.
- Responsive from 375px mobile up through desktop.

---

## 🎥 Demo Video

The demo video (90–180s) shows: signup, adding a quest, completing it, the leveling-up celebration, and a page refresh to demonstrate real database persistence.

[ADD YOUR VIDEO LINK HERE]

---

## 📄 License

This project was built for [HACKATHON NAME] and is available under the MIT License.