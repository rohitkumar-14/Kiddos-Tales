# Kiddos Tales

Kiddos Tales is a magical AI-powered children’s story generator built with React and Vite. It lets parents and kids create personalized storybooks, save generated tales, listen to audio narration, export printable coloring books, and track achievements in a playful dashboard.

---

## 🚀 Key Features

- AI-powered story generation using Google Generative AI (`gemini-2.0-flash` with fallback to `gemini-1.5-flash`)
- Custom story settings:
  - child name
  - subject/topic
  - story type
  - age group
  - tone
  - theme
  - length
  - language
  - hero character traits
- Persistent story library stored in browser `localStorage`
- Interactive book-style reader with page flip animation
- Text-to-speech narration and read-aloud controls
- Printable coloring book export using `html2pdf.js`
- Magic link sharing for passing stories between users
- Parent dashboard with:
  - magic dust credits
  - achievement badges
  - story count
- Auto logout after 30 minutes of inactivity
- Animated magical cursor, confetti effects, sound effects, and rich UI motion

---

## 🧠 User Flow

- `/` - Home page / hero section
- `/login` - Login screen to begin using the app
- `/create` - Story generator interface (requires login)
- `/explore` - Library of generated stories and shared magic stories
- `/dashboard` - Parent dashboard for credits, achievements, and story overview

---

## 💻 Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- React PageFlip
- React Hot Toast
- canvas-confetti
- html2pdf.js
- use-sound
- Google Generative AI SDK

---

## ⚙️ Installation

1. Install dependencies:

```bash
npm install
```

2. Create an environment file at the project root if you want to provide your own Google API key:

```bash
cp .env.example .env
```

3. Add your key to `.env`:

```env
VITE_GEMINI_API_KEY=your_google_generative_ai_api_key
```

> If no key is provided in `.env`, the app will still accept a key entered manually in the story generator.

4. Start the development server:

```bash
npm run dev
```

---

## 🧪 Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

---

## 📁 Project Structure

- `src/App.jsx` - Main application and route setup
- `src/components/StoryGenerator.jsx` - AI story creation UI and generation logic
- `src/components/GeneratedBooks.jsx` - Story library, pageflip reader, audio playback, and PDF export
- `src/components/Login.jsx` - Login form and flow
- `src/components/Dashboard.jsx` - Parent dashboard and achievement display
- `src/components/Navbar.jsx` - Navigation links and user controls
- `src/data/demoStories.js` - Demo story data fallback when no generated content exists

---

## 📌 Notes

- Generated stories and user data persist in the browser via `localStorage`.
- The app uses `use-sound` for playful audio cues and `canvas-confetti` for celebration effects.
- The story generator supports multilingual output and automatically unlocks language achievements.
- Images are generated via Pollinations prompts to create cover-style illustrations.

---

## 🌟 Want to Improve It?

Possible enhancements:

- add a true backend for user accounts and persistent story storage
- allow export of generated story PDFs
- add real authentication instead of localStorage-based login
- add true offline support or story templates

---

## License

This project is open for learning and enhancement.
