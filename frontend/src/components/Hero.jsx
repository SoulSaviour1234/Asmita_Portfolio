import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import SakuraScene from "@/components/SakuraScene";

const Hero = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.09, delayChildren: 0.25 },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 110, damping: 18 },
        },
    };

    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative pt-32 md:pt-36 pb-20 px-6 md:px-12"
        >
            <div className="mx-auto max-w-7xl grid lg:grid-cols-5 gap-12 items-center">
                {/* LEFT — 60% (3/5 cols) */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="lg:col-span-3 relative z-10"
                >
                    {/* Pill badge */}
                    <motion.div variants={item}>
                        <span
                            data-testid="hero-badge"
                            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-sakura-inkSoft"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-sakura-pink opacity-75 animate-ping" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sakura-pink" />
                            </span>
                            Available for collaborations · India
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={item}
                        data-testid="hero-headline"
                        className="font-display mt-6 text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.98] font-bold text-sakura-ink tracking-tight"
                    >
                        Hi, I'm{" "}
                        <span className="relative inline-block">
                            <span
                                className="relative z-10"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(120deg, #FF4785 0%, #FF7EB3 50%, #FFB997 100%)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                Asmita
                            </span>
                            <span
                                aria-hidden
                                className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-full blur-3xl opacity-60"
                                style={{
                                    background:
                                        "radial-gradient(closest-side, rgba(255,71,133,0.55), transparent 70%)",
                                }}
                            />
                        </span>
                        <span className="font-serif-accent italic font-normal text-sakura-ink/80">
                            {" "}
                            Mishra.
                        </span>
                    </motion.h1>

                    {/* Sub headline */}
                    <motion.p
                        variants={item}
                        data-testid="hero-subheadline"
                        className="mt-7 max-w-xl text-lg md:text-xl text-sakura-inkSoft leading-relaxed"
                    >
                        Computer Science Engineer crafting{" "}
                        <span className="text-sakura-ink font-medium">
                            intelligent architectures
                        </span>{" "}
                        and{" "}
                        <span className="text-sakura-ink font-medium">
                            beautiful web experiences
                        </span>
                        .
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={item}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <motion.a
                            href="#projects"
                            data-testid="hero-cta-primary"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{
                                type: "spring",
                                stiffness: 320,
                                damping: 18,
                            }}
                            className="group relative inline-flex items-center gap-2 rounded-full px-7 py-4 text-white font-semibold text-sm md:text-base"
                            style={{
                                background:
                                    "linear-gradient(120deg, #FF4785 0%, #FF7EB3 55%, #FFB997 100%)",
                                boxShadow:
                                    "0 20px 50px -12px rgba(255,71,133,0.65), 0 8px 28px -10px rgba(255,126,179,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
                            }}
                        >
                            <span>See my work</span>
                            <motion.span
                                aria-hidden
                                initial={{ x: 0, y: 0 }}
                                animate={{ x: 0, y: 0 }}
                                whileHover={{ x: 4, y: -4 }}
                                className="inline-flex"
                            >
                                <ArrowUpRight size={18} />
                            </motion.span>
                            <span
                                aria-hidden
                                className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background:
                                        "radial-gradient(120px 60px at var(--x,50%) 0%, rgba(255,255,255,0.45), transparent 70%)",
                                }}
                            />
                        </motion.a>

                        <motion.a
                            href="/resume.pdf"
                            download
                            data-testid="hero-cta-secondary"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{
                                type: "spring",
                                stiffness: 320,
                                damping: 18,
                            }}
                            className="inline-flex items-center gap-2 glass rounded-full px-6 py-4 font-semibold text-sm md:text-base text-sakura-ink"
                        >
                            <Download size={17} />
                            Download résumé
                        </motion.a>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        variants={item}
                        data-testid="hero-stats"
                        className="mt-14 grid grid-cols-3 gap-6 max-w-lg"
                    >
                        {[
                            { k: "20+", v: "Projects shipped" },
                            { k: "8.9", v: "CGPA · CSE" },
                            { k: "3y", v: "Building since" },
                        ].map((s) => (
                            <div key={s.v}>
                                <div className="font-display text-3xl md:text-4xl font-bold text-sakura-ink tracking-tight">
                                    {s.k}
                                </div>
                                <div className="text-xs md:text-sm text-sakura-inkSoft/80 mt-1">
                                    {s.v}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* RIGHT — 40% (2/5 cols) — WebGL Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 70,
                        damping: 18,
                        delay: 0.35,
                    }}
                    className="lg:col-span-2 relative h-[420px] sm:h-[520px] lg:h-[640px] w-full"
                    data-testid="hero-canvas-wrapper"
                >
                    {/* Backlit pink/peach radial glow */}
                    <div
                        aria-hidden
                        className="absolute inset-0 animate-pulse-glow"
                        style={{
                            background:
                                "radial-gradient(60% 60% at 50% 50%, rgba(255,71,133,0.55) 0%, rgba(255,185,151,0.35) 35%, transparent 70%)",
                            filter: "blur(28px)",
                        }}
                    />
                    {/* Glass frame */}
                    <div className="relative h-full w-full rounded-[2.5rem] glass-pink overflow-hidden">
                        {/* WebGL Canvas Injection Point */}
                        <SakuraScene />

                        {/* Decorative corner labels */}
                        <div className="absolute top-5 left-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sakura-inkSoft/70">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sakura-pink" />
                            sakura.crystal
                        </div>
                        <div className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[0.22em] text-sakura-inkSoft/70">
                            v · 1.0
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
