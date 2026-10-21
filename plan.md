# AARAMBH local website plan

## Product approach

Build a plain-local React + Vite website with React Router and Three.js. The site will have ten direct routes, a reusable header/footer, a procedural Three.js centerpiece on the homepage, semantic text outside the canvas for crawlability, and an honest email-based join flow because no submission backend is available.

## Design

Three possible directions considered: Quiet editorial sculpture (0.06), kinetic neon launchpad (0.08), and soft founder-led notebook (0.05). Chosen: **Quiet editorial sculpture**.

- **Design movement:** premium editorial web design with restrained motion and a tactile, sculptural center.
- **Core principles:** beginning over bravado; negative space over clutter; motion with narrative purpose; factual content over invented proof.
- **Color philosophy:** warm paper and ink create trust and editorial calm; acid lime marks the first spark and the moments where a visitor can act.
- **Layout paradigm:** asymmetric chapters with oversized type, chapter markers, and an evolving center object rather than a conventional card grid.
- **Signature elements:** lime seed geometry, mono chapter coordinates, and serif italic emphasis for the human side of ambition.
- **Interaction philosophy:** scroll changes the scene’s rotation, scale, and color; links are explicit and focusable; the visual layer remains secondary to readable content.
- **Animation:** slow continuous rotation, eased scroll response, limited particle density, reduced-motion support, and no interaction trap.
- **Typography:** Manrope for body and UI; DM Mono for metadata; Playfair Display italic for reflective emphasis.
- **Brand essence:** the first-step community for curious people moving toward entrepreneurship; open, considered, alive.
- **Voice:** direct and invitational. Example lines: “Start with a question.” and “Find your people. Make something real.”
- **Wordmark & logo:** the current A monogram is a clearly replaceable placeholder until the official logo arrives.
- **Signature brand color:** acid lime `#d8f45a`, used as the visual signal for action and emergence.

## Project structure

- `src/main.jsx`: routes, page content, header/footer, form behavior, Three.js scene.
- `src/styles.css`: responsive design tokens, layout, accessibility states, and motion rules.
- `public/manus-routes.json`: public route manifest.
- `public/robots.txt` and `public/sitemap.xml`: search setup with a configurable domain placeholder.

## Asset constraint

The workspace did not contain the official logo or founder photograph. The implementation uses a replaceable monogram and a text-only founder-photo placeholder, never a generated or stock likeness.
