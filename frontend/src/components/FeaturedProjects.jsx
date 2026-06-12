import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe } from "lucide-react";

const PROJECTS = [
    {
        title: "Neural Notes",
        category: "AI · NLP",
        description:
            "An AI study companion that summarises lecture transcripts, generates flashcards, and answers questions over PDFs using RAG.",
        stack: ["Python", "FastAPI", "OpenAI", "Pinecone"],
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80",
    },
    {
        title: "Algo Atlas",
        category: "Data Structures",
        description:
            "Interactive visualiser for 30+ algorithms — from Dijkstra to Red-Black trees — with step-through animations and complexity insights.",
        stack: ["React", "TypeScript", "D3", "Framer Motion"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    },
    {
        title: "Petal Commerce",
        category: "Full-stack Web",
        description:
            "A boutique e-commerce platform with realtime inventory, Stripe checkout, and a CMS-driven storefront for indie florists.",
        stack: ["Next.js", "Node", "MongoDB", "Stripe"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80",
    },
    {
        title: "Sonar IoT",
        category: "Embedded · Cloud",
        description:
            "An IoT dashboard for tracking 50+ sensor nodes in real-time over MQTT — with anomaly alerts and historical trend analytics.",
        stack: ["C++", "MQTT", "React", "InfluxDB"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    },
];

const ProjectCard = ({ p, idx }) => {
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
            whileHover="hover"
            data-testid={`project-card-${idx}`}
            className="group relative overflow-hidden rounded-[2rem] glass cursor-pointer"
            style={{ aspectRatio: "4 / 3" }}
        >
            {/* Edge-to-edge image */}
            <motion.img
                src={p.image}
                alt={p.title}
                variants={{
                    hover: { scale: 1.08 },
                }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="absolute inset-0 h-full w-full object-cover"
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
                <span className="glass rounded-full h-9 w-9 flex items-center justify-center text-sakura-ink">
                    <ArrowUpRight size={16} />
                </span>
            </div>

            {/* Dark-pink translucent overlay (slides up on hover) */}
            <motion.div
                variants={{
                    hover: { y: 0, opacity: 1 },
                }}
                initial={{ y: "55%", opacity: 0.96 }}
                transition={{ type: "spring", stiffness: 110, damping: 20 }}
                className="absolute inset-x-0 bottom-0 p-6 md:p-8 glass-dark-pink rounded-t-[2rem]"
                data-testid={`project-overlay-${idx}`}
            >
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {p.title}
                </h3>
                <p className="mt-3 text-white/85 text-sm md:text-[15px] leading-relaxed max-w-prose">
                    {p.description}
                </p>

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
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white text-sakura-pink font-semibold text-sm px-4 py-2 hover:scale-[1.03] transition"
                    >
                        <Globe size={14} /> Live
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white font-semibold text-sm px-4 py-2 border border-white/25 hover:bg-white/20 transition"
                    >
                        <Github size={14} /> Code
                    </button>
                </div>
            </motion.div>
        </motion.article>
    );
};

const FeaturedProjects = () => {
    return (
        <section
            id="projects"
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
                        className="max-w-sm text-sakura-inkSoft text-base leading-relaxed"
                    >
                        Four projects spanning AI, systems, full-stack, and IoT — each
                        shipped end-to-end. Hover for the story.
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
