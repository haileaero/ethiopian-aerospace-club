# Ethiopian Aerospace Club — Institutional V4

A Vite + React institutional-style website for the Ethiopian Aerospace Club.

## Features
- EDU-inspired institutional header/navigation pattern
- Full-width hero carousel with editable slides
- Search panel
- Dropdown navigation
- EAC academic/technical sections
- UAV laboratory, research, projects, opportunities, news/events and membership pages
- Responsive mobile layout
- Permanent website designer/developer credit: Haile Assefa Wube
- Admin dashboard at `/admin`
- Hero image upload and content editing through browser local storage

## Deploy to Vercel
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- If importing the GitHub repository, set Root Directory to the folder containing this `package.json`.

## Admin
Open `/admin` after deployment. Hero slide edits and uploaded images are stored in the browser's local storage. This is intentionally a lightweight first CMS layer; a shared database/authentication backend can be added later without changing the public site structure.

## EAC identity
The website uses EAC branding and describes the Ethiopian Defence University relationship as a proposed academic context. It does not claim official university approval or recognition unless that is formally confirmed.
