# 🚀 StreamLite Enhancement Prompt (UI + Data + Fixes)

You are improving an already developed **microservice-based streaming platform (StreamLite)** built using:

- Frontend: React
- Backend: Node.js + Express (4 microservices)
- Services:
  - User Service
  - Catalog Service
  - Watchlist Service
  - Playback/History Service

Your task is to **enhance the UI, improve data handling, and fix any flaws**, while keeping the system simple and fully functional.

---

# 🎯 1. UI/UX IMPROVEMENT (Netflix-style Design)

Redesign the frontend to look like a **modern Netflix-style streaming UI**, but keep it simple.

## Requirements:

- Use **dark theme** (black/charcoal background)
- Use **clean, modern fonts**
- Add smooth hover effects and transitions
- Use card-based layout for movies

## Pages to improve:

### Home Page

- Display movies in **horizontal scroll rows**
- Rows can include:
  - Trending
  - Popular
  - Action
  - Comedy
- Movie cards should include:
  - Poster image
  - Title (on hover)
  - Slight zoom effect on hover

### Movie Details Page

- Large banner (hero section)
- Show:
  - Title
  - Description
  - Genre
  - Duration
- Buttons:
  - ▶ Play
  - - Add to Watchlist

### Watchlist Page

- Grid layout
- Show all saved movies
- Add remove button

### Player Page

- Simple video player
- Show title and progress

---

# 🎨 Styling Requirements

- Use **Tailwind CSS**
- Add:
  - smooth animations
  - hover scaling
  - soft shadows
  - rounded corners (2xl)
- Ensure **responsive design** (mobile + desktop)

---

# 🎬 2. REMOVE seed.js AND USE MOVIE API

Currently movies are inserted using `seed.js`.

## Change this to:

Use a **public movie API**

### Recommended:

- TMDB API (The Movie Database)

## Requirements:

- Fetch movies dynamically from API
- Store minimal data in Catalog Service if needed
- Map API response to your system format

## Data to extract:

- movieId
- title
- description
- poster image
- backdrop image
- genre
- rating
- trailer (if available)

## Backend Changes:

- Remove static seeding logic
- Add API integration in Catalog Service
- `/api/catalog` should fetch from external API
- Optional: cache results for performance

---

# 🔍 3. DISPLAY ALL MOVIES (IMPORTANT CHANGE)

Currently movies are only found using search.

## Modify behavior:

- On homepage → **display all movies by default**
- Search should still exist, but optional

## Requirements:

- Load movies automatically on page load
- Add category-based filtering (optional)
- Keep search bar functional

---

# 🔧 4. SYSTEM CHECK & BUG FIXES

Analyze the entire system and fix any issues.

## Things to check:

### API Issues

- Incorrect endpoints
- Missing error handling
- Wrong status codes

### Frontend Issues

- Broken UI components
- Poor responsiveness
- Missing loading states

### Integration Issues

- Services not communicating properly
- Incorrect data flow between services

### Security Issues

- Missing JWT validation
- Exposed sensitive data
- No input validation

---

# 🛡️ REQUIRED FIXES

Ensure:

- Proper error handling (try/catch everywhere)
- Meaningful API responses
- Input validation in all services
- Protected routes using JWT
- Environment variables for secrets
- Graceful handling of API failures

---

# 🔄 5. IMPROVE USER EXPERIENCE

Add:

- Loading spinners when fetching movies
- Empty states:
  - No movies
  - No watchlist items
- Toast notifications:
  - "Added to watchlist"
  - "Removed from watchlist"
- Better navigation between pages

---

# ⚡ 6. PERFORMANCE IMPROVEMENTS

- Lazy load images
- Optimize API calls
- Avoid duplicate requests
- Use caching where possible

---

# 📦 7. KEEP SYSTEM SIMPLE

IMPORTANT:

Do NOT add:

- Payment systems
- Recommendation engines
- AI features
- Chat systems
- Complex admin panels

Keep the system:
✔ Simple  
✔ Clean  
✔ Functional  
✔ Visually modern

---

# ✅ FINAL GOAL

The final system should:

- Look like a **modern streaming platform (Netflix-style)**
- Fetch **real movie data from API**
- Show **all movies by default**
- Have **smooth UI/UX**
- Have **no major bugs**
- Maintain **proper microservice architecture**

---

# 🎯 OUTPUT EXPECTATION

- Updated frontend (React + Tailwind)
- Updated Catalog Service (API-based)
- Bug-free integration across all 4 services
- Clean, responsive UI
- Improved user experience

---

Ensure the final system is **demo-ready, simple, and suitable for a university microservices assignment**.
