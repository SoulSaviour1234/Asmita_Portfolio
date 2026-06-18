import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe } from "lucide-react";

const PROJECTS = [
    {
        title: "Dr. Brinjal",
        category: "AI · Multimodal",
        description:
            "An AI-driven system utilizing a CNN ensemble and multimodal analysis for the robust classification of eggplant leaf diseases.",
        stack: ["Python", "PyTorch", "OpenCV", "FastAPI"],
        image: "/dr-brinjal-card.png",
        status: "active",
        liveLink: "https://dr-brinjal.vercel.app/",
    },
    {
        title: "Project in Stealth",
        category: "In Development",
        description:
            "Architecture currently under construction. Deployment pending.",
        stack: [],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
        status: "placeholder",
    },
    {
        title: "Project in Stealth",
        category: "In Development",
        description:
            "Architecture currently under construction. Deployment pending.",
        stack: [],
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80",
        status: "placeholder",
    },
    {
        title: "Project in Stealth",
        category: "In Development",
        description:
            "Architecture currently under construction. Deployment pending.",
        stack: [],
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=80",
        status: "placeholder",
    },
];

const ProjectCard = ({ p, idx }) => {
    const isPlaceholder = p.status === "placeholder";

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                type: "spring",
                stiffness: 80,
                damping: 18,
                delay: idx * 0.08,
            }}
            data-testid={`project-card-${idx}`}
            className={`group relative overflow-hidden rounded-[2rem] glass aspect-[4/5] md:aspect-[4/3] ${isPlaceholder ? '' : 'cursor-pointer'}`}
        >
            {/* Edge-to-edge image */}
            <img
                src={p.image}
                alt={p.title}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                    isPlaceholder 
                    ? "filter blur-xl scale-125" 
                    : "group-hover:scale-105"
                }`}
            />

            {/* Soft light gradient on top by default */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(255,71,133,0.18) 100%)",
                }}
            />

            {/* Top meta strip */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-sakura-ink">
                    {p.category}
                </span>
                {!isPlaceholder && (
                    <a 
                        href={p.liveLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glass hover:bg-white/40 transition rounded-full h-9 w-9 flex items-center justify-center text-sakura-ink" 
                        aria-label={`Visit live deployment of ${p.title}`}
                    >
                        <ArrowUpRight size={16} />
                    </a>
                )}
            </div>

            {/* Dark-pink translucent overlay (slides up on hover for desktop, always visible on mobile) */}
            <div
                className={`absolute inset-x-0 bottom-0 p-6 md:p-8 rounded-t-[2rem] transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                    isPlaceholder
                    ? "bg-pink-600/70 backdrop-blur-md translate-y-0 opacity-100" 
                    : "glass-dark-pink translate-y-0 md:translate-y-[55%] md:opacity-95 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                }`}
                data-testid={`project-overlay-${idx}`}
            >
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {p.title}
                </h3>
                <p className="mt-3 text-white/85 text-sm md:text-[15px] leading-relaxed max-w-prose">
                    {p.description}
                </p>

                {!isPlaceholder && (
                    <>
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            {p.stack.map((s) => (
                                <span
                                    key={s}
                                    className="rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-medium text-white/95 backdrop-blur"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            {p.liveLink && (
                                <a
                                    href={p.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-pink-950 font-semibold text-sm px-4 py-2 hover:scale-[1.03] transition"
                                >
                                    <Globe size={14} aria-hidden="true" /> Live
                                </a>
                            )}
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white font-semibold text-sm px-4 py-2 border border-white/25 hover:bg-white/20 transition"
                            >
                                <Github size={14} aria-hidden="true" /> Code
                            </button>
                        </div>
                    </>
                )}
            </div>
        </motion.article>
    );
};

const FeaturedProjects = () => {
    return (
        <section
            id="deployments"
            data-testid="projects-section"
            className="relative px-6 md:px-12 py-24 md:py-32"
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-sakura-inkSoft"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-sakura-pink" />
                            Featured Deployments
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 90, damping: 18 }}
                            data-testid="projects-title"
                            className="font-display mt-5 text-4xl md:text-6xl font-bold tracking-tight text-sakura-ink leading-[1.02]"
                        >
                            Selected{" "}
                            <span className="font-serif-accent italic font-normal text-sakura-pink">
                                work
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
                        Highlighting my latest research in AI-driven agricultural analysis, alongside upcoming architectures currently in development.
                    </motion.p>
                </div>

                <div
                    id="work"
                    className="grid md:grid-cols-2 gap-5 md:gap-6"
                    data-testid="projects-grid"
                >
                    {PROJECTS.map((p, i) => (
                        <ProjectCard key={p.title} p={p} idx={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
