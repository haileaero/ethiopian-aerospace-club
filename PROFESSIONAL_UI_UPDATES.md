# EAC Professional Responsive UI Update

This version keeps the existing EAC functionality and content while improving the responsive presentation.

## Header stability
- Desktop header uses a stable document-flow shell with a fixed visual header.
- Desktop upper institutional rows collapse smoothly after scrolling.
- The navigation remains stable at the top without switching between sticky/fixed positioning during scroll.
- Mobile keeps a compact EAC header permanently available.
- Mobile navigation opens as an independent scrollable panel.
- Desktop/mobile header states are separated so mobile does not receive the desktop scroll-collapse state.
- Route changes return to the top without an additional smooth-scroll animation that can compete with the header transition.

## Page layout
- Reduced excessive vertical section spacing.
- Reduced oversized visual blocks while preserving visual hierarchy.
- Improved responsive spacing for desktop, tablet, and phones.
- Long sections use more compact rhythm so pages are easier to scan.

## Cards
- Project, opportunity, news, member, and related cards use more compact dimensions.
- Reduced card padding and excessive internal whitespace.
- Reduced large project artwork height.
- Preserved hover and interaction states while keeping the visual treatment professional.

## Existing functionality
The source structure, routes, authentication/member pages, Supabase integration, admin/member functionality, and existing EAC content are preserved.

## Installation
After extracting the ZIP:

```bash
npm install
npm run dev
```

For production:

```bash
npm run build
```
