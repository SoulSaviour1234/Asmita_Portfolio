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
- **Hero**: gradient "Asmita" name with backlit pink glow, glowing CTA buttons (spring scale on hover), stats strip
- **3D Crystal**: drei `MeshTransmissionMaterial` icosahedron with frosted glass + glowing pink core + floating petals + soft OrbitControls auto-rotation
- **Bento Grid**: 9 stack items (C++, React, Python, Node.js, SQL, Tailwind, DSA, Git, Figma) with varied col/row spans, gradient icon plates, and mouse-driven 3D tilt
- **Project Cards**: 4 realistic CSE projects, edge-to-edge images, dark-pink translucent overlay sliding up via spring physics on hover, with Live + Code CTAs
- **Connect Section**: massive "Let's engineer the future." gradient headline + frosted-glass form (name, email, message) with rose-glow focus rings + EmailJS-ready submit handler + socials & direct email
- **Floating Nav**: top-center pill, underline-reveal nav links, mobile hamburger menu (animated)
- **Global Aesthetic**: aurora blobs, custom pink scrollbar, custom selection color, Bricolage Grotesque + Instrument Serif + Manrope fonts
- **Responsive**: tested at 1920px and 412px viewports — stacks gracefully on mobile
- **Compile-time fix**: custom craco patch that disables the visual-edits babel plugin specifically for `SakuraScene.jsx` so R3F primitives (lowercase JSX) don't receive `x-line-number` props

## EmailJS Integration (Placeholder)
The submit handler is fully wired with `emailjs.sendForm`. To activate, add to `/app/frontend/.env`:
```
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=
REACT_APP_EMAILJS_PUBLIC_KEY=
```
Form fields are named `name`, `email`, `message` — match these in your EmailJS template.

## Backlog / Next Steps (P1)
- Real-user content swap: replace placeholder project text, image URLs, social links, resume PDF
- Replace `hi@asmita.dev` with real email and add a real resume PDF link to the "Download résumé" button
- Add scroll-snap for sections (optional)
- Add a small "blog" or "writing" section (optional)

## Future / Stretch (P2)
- Smooth route transitions if multi-page added later
- Replace icosahedron with a custom sakura-petal mesh / GLTF model
- Light/dark mode toggle (currently single luminous theme by design)
- Page transitions when scrolling between sections
