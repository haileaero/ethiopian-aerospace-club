# Ethiopian Aerospace Club — V4 Final Polish

Professional institutional React/Vite website for the Ethiopian Aerospace Club (EAC), designed around an aerospace-engineering identity and an institutional presentation style.

## Final V4 improvements
- Click-controlled desktop navigation dropdowns (no hover dependency)
- Only one navigation/search overlay can remain open at a time
- Clicking outside the header closes open menus
- Escape closes open menus
- Route changes close all navigation overlays and return the page to the top
- Mobile navigation opens below the header and is independently scrollable
- Mobile dropdowns open/close correctly
- Mobile menu closes after navigation and when clicking outside
- Removed the public-facing hero upload instruction
- Added a professional EAC Admin Control Center
- Admin can manage hero banners and images
- Admin can manage committee profile records and photos
- Admin can edit site settings and social links
- Added a back-to-top control
- Preserved EAC institutional wording and proposed-status language
- Preserved designer/developer credit for Haile Assefa Wube

## Important production note
This V4 package is a frontend CMS prototype. Hero images, committee records and settings are stored in the browser's localStorage. A production multi-user member/admin system still needs a backend database, real authentication, server-side role authorization, password hashing, email verification and password-reset email delivery.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
```

## Vercel

The repository is structured for a Vercel deployment from the project root. Keep the Vercel Root Directory empty / `./` unless your repository structure is changed.
