import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Code2,
    Atom,
    Braces,
    GitBranch,
    Database,
    Wind,
    Figma,
    Binary,
    Hexagon,
    Layers,
} from "lucide-react";

const STACK = [
    {
        name: "C++",
        tag: "Systems · DSA",
        icon: Code2,
        span: "md:col-span-2 md:row-span-2",
        accent: "linear-gradient(135deg,#FF4785,#FF7EB3)",
    },
    {
        name: "React",
        tag: "UI engineering",
        icon: Atom,
        span: "md:col-span-2",
        accent: "linear-gradient(135deg,#FF7EB3,#FFB997)",
    },
    {
        name: "Python",
        tag: "ML · Scripting",
        icon: Braces,
        span: "md:col-span-1",
        accent: "linear-gradient(135deg,#FF4785,#E8B4B8)",
    },
    {
        name: "Node.js",
        tag: "Backend · APIs",
        icon: Hexagon,
        span: "md:col-span-1",
        accent: "linear-gradient(135deg,#FFB997,#FF7EB3)",
    },
    {
        name: "SQL",
        tag: "Data & queries",
        icon: Database,
        span: "md:col-span-1",
        accent: "linear-gradient(135deg,#E8B4B8,#FF4785)",
    },
    {
        name: "Tailwind",
        tag: "Utility-first CSS",
        icon: Wind,
        span: "md:col-span-2",
        accent: "linear-gradient(135deg,#FF7EB3,#FF4785)",
    },
    {
        name: "Data Structures",
        tag: "Algorithms · 800+ solved",
        icon: Binary,
        span: "md:col-span-2",
        accent: "linear-gradient(135deg,#FF4785,#FFB997)",
    },
    {
        name: "Git",
        tag: "Version control",
        icon: GitBranch,
        span: "md:col-span-1",
        accent: "linear-gradient(135deg,#FFB997,#E8B4B8)",
    },
    {
        name: "Figma",
        tag: "Design hand-off",
        icon: Figma,
        span: "md:col-span-1",
        accent: "linear-gradient(135deg,#FF7EB3,#E8B4B8)",
    },
];

/* === Single Bento card with 3D tilt on mouse move === */
const BentoCard = ({ item, idx }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-50, 50], [10, -10]), {
        stiffness: 150,
        damping: 18,
    });
    const rotateY = useSpring(useTransform(x, [-50, 50], [-10, 10]), {
        stiffness: 150,
        damping: 18,
    });

    const onMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left - rect.width / 2;
        const py = e.clientY - rect.top - rect.height / 2;
        x.set((px / rect.width) * 100);
        y.set((py / rect.height) * 100);
    };
    const onLeave = () => {
        x.set(0);
        y.set(0);
    };

    const Icon = item.icon;

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                delay: idx * 0.05,
            }}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
            }}
            data-testid={`bento-card-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`group relative ${item.span} min-h-[160px] glass-pink rounded-[1.8rem] p-6 md:p-7 overflow-hidden cursor-default`}
        >
            {/* Decorative gradient halo */}
            <div
                aria-hidden
                className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: item.accent }}
            />

            {/* Icon plate */}
            <motion.div
                style={{ transform: "translateZ(40px)" }}
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            >
                <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: item.accent,
                        boxShadow:
                            "0 12px 40px -10px rgba(255,71,133,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
                    }}
                />
                <Icon size={24} className="relative" strokeWidth={2.2} />
            </motion.div>

            {/* Text */}
            <div
                style={{ transform: "translateZ(25px)" }}
                className="relative mt-5"
            >
                <div className="font-display text-2xl md:text-3xl font-semibold text-sakura-ink tracking-tight">
                    {item.name}
                </div>
                <div className="text-sm text-sakura-inkSoft/85 mt-1">
                    {item.tag}
                </div>
            </div>

            {/* Hairline reveal */}
            <div className="absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-transparent via-sakura-pink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};

const TechArsenal = () => {
    return (
        <section
            id="arsenal"
            data-testid="arsenal-section"
            className="relative px-6 md:px-12 py-24 md:py-32"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-sakura-inkSoft"
                        >
                            <Layers size={12} />
                            Technical Arsenal
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 90, damping: 18 }}
                            data-testid="arsenal-title"
                            className="font-display mt-5 text-4xl md:text-6xl font-bold tracking-tight text-sakura-ink leading-[1.02]"
                        >
                            The tools{" "}
                            <span className="font-serif-accent italic font-normal text-sakura-pink">
                                I build with
                            </span>
                            .
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="max-w-sm text-sakura-inkSoft text-base leading-relaxed"
                    >
                        A curated stack — from low-level systems to pixel-perfect
                        interfaces. Hover any card for a closer look.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div
                    data-testid="bento-grid"
                    className="grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(160px,_1fr)] gap-4 md:gap-5"
                >
                    {STACK.map((item, i) => (
                        <BentoCard key={item.name} item={item} idx={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechArsenal;
