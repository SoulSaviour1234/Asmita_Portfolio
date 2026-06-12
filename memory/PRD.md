# PRD — Asmita Mishra · Developer Portfolio

## Original Problem Statement
Build the complete frontend scaffolding for a premium, ultra-modern Developer Portfolio for a Computer Science Engineer (Asmita Mishra). Aesthetic: **Luminous Sakura Glassmorphism** — bright off-white/blush background, vibrant pink → peach gradients, heavy frosted-glass, soft glowing diffused pink shadows.

## Tech Stack
- **Framework**: React 19 (functional components, hooks)
- **Styling**: Tailwind CSS v3 + custom CSS variables for the Sakura theme
- **Animation**: Framer Motion (spring physics, scroll-triggered reveals)
- **Icons**: lucide-react
- **3D**: @react-three/fiber + @react-three/drei + three.js
- **Contact form**: @emailjs/browser (placeholders ready for env injection)
- **Build**: CRA + Craco (with a custom patch that excludes `SakuraScene.jsx` from the visual-edits babel plugin to avoid R3F prop conflicts)

## Architecture
```
/app/frontend/src/
├── App.js                 # Page assembler + ambient aurora blobs
├── index.css              # Sakura theme tokens, glassmorphism utilities
├── tailwind.config.js     # Custom sakura colors, fonts, shadows
└── components/
    ├── FloatingNav.jsx        # Pill-shaped frosted-glass nav + mobile menu
    ├── Hero.jsx               # Headline + CTA + 3D canvas (60/40 split)
    ├── SakuraScene.jsx        # @react-three/fiber: rotating sakura crystal + petals
    ├── TechArsenal.jsx        # Asymmetric Bento grid w/ 3D tilt cards (9 stack items)
    ├── FeaturedProjects.jsx   # 2-col project cards w/ dark-pink slide-up overlay
    └── ConnectFooter.jsx      # Massive headline + glass contact form + socials
```

## Implemented (Jan 12, 2026)
- **Hero**: gradient "Asmita" name with backlit pink glow, glowing CTA buttons (spring scale on hover), stats strip; "Download résumé" now points to `/resume.pdf` (placeholder shipped in `public/`)
- **3D Sakura Cluster** *(replaces icosahedron)*: procedural 5-petal sakura blossom with a V-notched petal shape via `THREE.Shape` + `ExtrudeGeometry`, golden pistil + pollen specks, plus two smaller floating blossoms. Gentle Y-wobble + Z-tilt animation, mouse parallax, restricted OrbitControls.
- **Bento Grid**: 9 stack items (C++, React, Python, Node.js, SQL, Tailwind, DSA, Git, Figma) with varied col/row spans, gradient icon plates, and mouse-driven 3D tilt
- **Project Cards**: 4 CSE projects with refreshed CSE-themed Unsplash imagery (AI art, algorithm formulas, e-commerce, IoT), edge-to-edge images, dark-pink translucent overlay sliding up via spring physics on hover, with Live + Code CTAs
- **Connect Section**: massive "Let's engineer the future." gradient headline + frosted-glass form with rose-glow focus rings + **EmailJS wired to real keys** (Service `service_0jhfx4f`, Template `template_ldmb6sp`) — submissions go to `mishraasmita885@gmail.com`
- **Social links**: GitHub (`mishraasmita885-gif`), LinkedIn (`asmita-mishra-0427b5368`), Email (`mishraasmita885@gmail.com`). Twitter removed.
- **Floating Nav**: top-center pill, underline-reveal nav links, mobile hamburger menu (animated)
- **Global Aesthetic**: aurora blobs, custom pink scrollbar, custom selection color, Bricolage Grotesque + Instrument Serif + Manrope fonts
- **Responsive**: tested at 1920px and 412px viewports — stacks gracefully on mobile
- **Compile-time fix**: custom craco patch that disables the visual-edits babel plugin specifically for `SakuraScene.jsx` so R3F primitives (lowercase JSX) don't receive `x-line-number` props

## EmailJS Integration (LIVE)
Configured with real credentials in `/app/frontend/.env`:
```
REACT_APP_EMAILJS_SERVICE_ID=service_0jhfx4f
REACT_APP_EMAILJS_TEMPLATE_ID=template_ldmb6sp
REACT_APP_EMAILJS_PUBLIC_KEY=kPwk_WVqQqtPkiTZz
```
Form field names sent to EmailJS template: `name`, `email`, `message`. Make sure the EmailJS template uses these variable names.

## Backlog / Next Steps (P1)
- Replace `/public/resume.pdf` placeholder with the real résumé PDF
- Test the live EmailJS form end-to-end (submit a real message to confirm delivery)
- Add Open Graph / favicon assets (currently using default)

## Future / Stretch (P2)
- Smooth route transitions if multi-page added later
- Replace icosahedron with a custom sakura-petal mesh / GLTF model
- Light/dark mode toggle (currently single luminous theme by design)
- Page transitions when scrolling between sections
