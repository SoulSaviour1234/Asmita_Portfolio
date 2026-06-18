import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Atom,
    Database,
    Wind,
    Layers,
    Zap,
    Sparkles,
} from "lucide-react";

const STACK = [
    // Top-left massive block (2x2)
    { name: 'Next.js', subtitle: 'Full-Stack Architecture', proficiency: 95, icon: Layers, accent: "linear-gradient(135deg,#FF4785,#FF7EB3)", colSpan: 2, rowSpan: 2 },
    // Top-right stacked wides (2x1)
    { name: 'Gemini 2.5', subtitle: 'AI Integration', proficiency: 92, icon: Sparkles, accent: "linear-gradient(135deg,#E8B4B8,#FF4785)", colSpan: 2, rowSpan: 1 },
    { name: 'React 19', subtitle: 'UI Engineering', proficiency: 90, icon: Atom, accent: "linear-gradient(135deg,#FF7EB3,#FFB997)", colSpan: 2, rowSpan: 1 },
    // Bottom half: stacked wides on the left, side-by-side talls on the right
    { name: 'Tailwind v4', subtitle: 'Styling', proficiency: 88, icon: Wind, accent: "linear-gradient(135deg,#FF4785,#FFB997)", colSpan: 2, rowSpan: 1 },
    { name: 'FastAPI', subtitle: 'Async Backends', proficiency: 88, icon: Zap, accent: "linear-gradient(135deg,#FF4785,#E8B4B8)", colSpan: 1, rowSpan: 2 },
    { name: 'Supabase', subtitle: 'Database & Auth', proficiency: 85, icon: Database, accent: "linear-gradient(135deg,#FFB997,#FF7EB3)", colSpan: 1, rowSpan: 2 },
    { name: 'PostgreSQL', subtitle: 'Relational DB', proficiency: 80, icon: Database, accent: "linear-gradient(135deg,#FF7EB3,#FF4785)", colSpan: 2, rowSpan: 1 },
];

/* === Single Bento card with 3D tilt on mouse move === */
const BentoCard = ({ item, idx, isMobile }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // Add a Z-axis spring to simulate pressing down into water
    const z = useSpring(0, { stiffness: 300, damping: 20 });
    const rotateX = useSpring(useTransform(y, [-50, 50], [15, -15]), {
        stiffness: 300,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-50, 50], [-15, 15]), {
        stiffness: 300,
        damping: 20,
    });

    const onMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left - rect.width / 2;
        const py = e.clientY - rect.top - rect.height / 2;
        x.set((px / rect.width) * 100);
        y.set((py / rect.height) * 100);
        z.set(-15); // Press the card down into the "water" when hovered
    };
    const onLeave = () => {
        x.set(0);
        y.set(0);
        z.set(0); // Float back up smoothly
    };

    const Icon = item.icon;
    
    // Apply exact inline spans. Override dynamically to empty object on mobile.
    const dynamicStyle = isMobile ? {} : {
        gridColumn: `span ${item.colSpan} / span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan} / span ${item.rowSpan}`
    };

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
                ...dynamicStyle,
                rotateX,
                rotateY,
                z,
                transformPerspective: 800, // Reduced perspective to exaggerate the 3D tilt
                transformStyle: "preserve-3d",
            }}
            data-testid={`bento-card-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            // Removed transition-all to prevent CSS from fighting Framer Motion's 60fps 3D transforms
            className="group relative flex flex-col justify-between h-full min-h-[160px] bg-white/40 backdrop-blur-md border border-pink-300/50 rounded-[1.8rem] p-5 md:p-6 overflow-hidden cursor-default transition-[border-color,box-shadow] duration-300 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(255,113,161,0.3)]"
        >
            {/* Proficiency Number Watermark */}
            <div className="absolute bottom-2 right-4 text-6xl font-display font-black tracking-tighter text-slate-900/[0.08] select-none pointer-events-none z-0">
                {item.proficiency}%
            </div>

            {/* Decorative gradient halo */}
            <div
                aria-hidden
                className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-90 z-0"
                style={{ background: item.accent }}
            />

            {/* Icon */}
            <motion.div
                style={{ 
                    transform: "translateZ(40px)",
                    animationDelay: `${idx * 0.35}s` 
                }}
                className="relative z-10 text-pink-500 mb-4 drop-shadow-[0_0_12px_rgba(255,71,133,0.9)] drop-shadow-[0_0_35px_rgba(255,71,133,0.6)] animate-[pulse_2s_ease-in-out_infinite]"
            >
                <Icon size={36} className="relative" strokeWidth={2.5} />
            </motion.div>

            {/* Text */}
            <div
                style={{ transform: "translateZ(25px)" }}
                className="relative z-10 flex flex-col gap-1"
            >
                <div className="text-lg font-bold text-slate-900 tracking-tight truncate">
                    {item.name}
                </div>
                <div className="text-sm font-medium text-pink-500 line-clamp-2">
                    {item.subtitle}
                </div>
            </div>
        </motion.div>
    );
};

const TechArsenal = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check(); // run immediately
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

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
                        className="max-w-sm text-sakura-inkSoft text-base md:text-lg leading-relaxed md:text-right"
                    >
                        A curated stack — from high-performance web architectures to advanced AI integrations.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div
                    data-testid="bento-grid"
                    // Perfectly packed 4-column grid. Auto rows set to roughly equal column width for a square aesthetic.
                    className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] grid-flow-dense gap-4 md:gap-5"
                >
                    {STACK.map((item, i) => (
                        <BentoCard key={item.name} item={item} idx={i} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechArsenal;
