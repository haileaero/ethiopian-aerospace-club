# Ethiopian Aerospace Club (EAC)

React + Vite website for the proposed Ethiopian Aerospace Club under the Aerospace Engineering Department, College of Engineering, Ethiopian Defence University.

## Included website sections

- Home
- About EAC
- Technical Divisions
- UAV & Drone Laboratory
- Projects & Research
- Opportunities
- News & Events
- Membership
- Contact

## Source-based UAV content

The UAV Laboratory page incorporates planning and training content from the supplied EAC documents:

- 12-week UAV Design-to-Piloting Training Program
- UAV Laboratory Inventory and Readiness Assessment
- UAV Practical Laboratory Manual — Weeks 1–6
- UAV Design-to-Piloting Practical Laboratory Manual — Weeks 7–12
- UAV Training Laboratory Prioritized Purchase Plan

The website preserves the source documents' distinction between proposed/planned activities and verified operational capabilities. Inventory condition, compatibility and airworthiness are not presented as confirmed facts.

## Run locally

```bash
npm install
npm run dev
```

## Build for deployment

```bash
npm run build
```

The production output is generated in `dist/` and can be deployed to Vercel or another static hosting provider.

## Contact form

Set `VITE_CONTACT_EMAIL` in the deployment environment if the FormSubmit contact and membership forms are to be enabled.
