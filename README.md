# Verse - Streaming Platform

A production-ready Netflix clone built with modern web technologies. This application features a robust authentication system, multi-profile support with personalized avatars, integrated TMDB proxy for bypassing ad-blockers, and full responsive design.

## Features

- **Multi-Profile System**: Support for multiple profiles per account, complete with avatar selection (`.svg` based), and a dedicated Kids profile logic.
- **Firebase Authentication**: Secure Google OAuth and Email/Password login.
- **My List & Watch Tracking**: Persisted view events and saved lists utilizing Firestore.
- **TMDB API Integration**: Proxied requests via a backend server to ensure CORS compatibility, API Key security, and ad-blocker evasion.
- **Smart Analytics (Insights)**: Tracks watch time and favorite genres to categorize a user's streaming personality accurately.
- **Fully Responsive UI**: Mobile-first Tailwind CSS implementation matching premium streaming UI/UX.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts.
- **State Management**: Zustand (Persisted where needed).
- **Backend & APIs**: Express backend via `server.ts` & Vercel Serverless Functions (`api/tmdb.ts`).
- **Database**: Firebase (Authentication & Cloud Firestore).

## Getting Started

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Firebase and TMDB credentials.
   ```sh
   VITE_FIREBASE_API_KEY="..."
   VITE_TMDB_API_KEY="..."
   ```

3. **Development Server**:
   ```sh
   npm run dev
   ```

4. **Production Build**:
   ```sh
   npm run build
   npm start
   ```

## Design Decisions

- The project relies on custom SVG avatars which bypass unsplash rate-limits.
- Handled offline fallback and "graceful degraded mode" by wrapping Firestore sync queries in resilient fetch configurations.
- Used Vercel's standard deployment structure while keeping local Express serving identical via `dist/server.cjs`.

## License

MIT
