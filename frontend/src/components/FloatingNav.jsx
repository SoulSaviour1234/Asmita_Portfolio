import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const LINKS = [
    { label: "Arsenal", id: "arsenal" },
    { label: "Deployments", id: "deployments" },
    { label: "Chronicle", id: "chronicle" },
    { label: "Writings", id: "writings" },
    { label: "Voices", id: "voices" },
    { label: "Connect", id: "connect" },
];

const FloatingNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <motion.nav
                data-testid="floating-nav"
                initial={{ y: -40, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 16,
                    delay: 0.1,
                }}
                className="fixed top-5 left-1/2 z-50 w-[92vw] max-w-[960px]"
            >
                <div
                    className={`glass rounded-full pl-6 pr-3 py-2.5 flex items-center justify-between transition-all duration-500 ${
                        scrolled
                            ? "shadow-glow-soft scale-[0.985]"
                            : "shadow-none"
                    }`}
                >
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            // Fallback to window.scrollTo just in case
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        data-testid="nav-logo"
                        className="flex items-center gap-2 group cursor-pointer hover:opacity-85 transition-opacity duration-300"
                    >
                        <motion.span
                            whileHover={{ rotate: 90 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 12,
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                            style={{
                                background:
                                    "conic-gradient(from 120deg, #FF4785, #FFB997, #FF7EB3, #FF4785)",
                            }}
                        >
                            <Sparkles
                                size={13}
                                className="text-white"
                                strokeWidth={2.5}
                                aria-hidden="true"
                            />
                        </motion.span>
                        <span className="font-display text-[17px] font-semibold tracking-tight text-sakura-ink">
                            asmita
                            <span className="font-serif-accent text-sakura-pink">
                                .
                            </span>
                            mishra
                        </span>
                    </button>

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {LINKS.map((l) => (
                            <button
                                key={l.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                data-testid={`nav-link-${l.label.toLowerCase()}`}
                                className="relative px-4 py-2 text-sm font-medium text-sakura-inkSoft hover:text-pink-500 transition-colors duration-300 group"
                            >
                                {l.label}
                                <span className="absolute left-4 right-4 bottom-[4px] h-[2px] bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                            </button>
                        ))}
                        <a
                            href="https://www.linkedin.com/in/asmita-mishra-0427b5368/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="nav-cta"
                            className="group relative ml-2 inline-flex items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,71,133,0.5)]"
                            style={{
                                background:
                                    "linear-gradient(120deg, #FF4785 0%, #FF7EB3 60%, #FFB997 100%)",
                                boxShadow:
                                    "0 12px 30px -8px rgba(255,71,133,0.55)",
                            }}
                        >
                            <span className="absolute -left-[100%] top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%]" />
                            <span className="relative">LinkedIn</span>
                            <span className="relative text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        data-testid="nav-mobile-toggle"
                        onClick={() => setMobileOpen((s) => !s)}
                        className="lg:hidden h-10 w-10 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-sakura-ink border border-white/70"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            className="lg:hidden mt-2 glass rounded-3xl p-3"
                            data-testid="nav-mobile-menu"
                        >
                            {LINKS.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMobileOpen(false);
                                        document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="w-full text-left block px-4 py-3 rounded-2xl text-sakura-inkSoft font-medium hover:bg-white/60 hover:text-pink-500 transition-colors"
                                >
                                    {l.label}
                                </button>
                            ))}
                            <a
                                href="https://www.linkedin.com/in/asmita-mishra-0427b5368/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                                className="group relative mt-2 w-full flex items-center justify-center overflow-hidden rounded-full px-4 py-3 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,71,133,0.5)]"
                                style={{
                                    background:
                                        "linear-gradient(120deg, #FF4785, #FF7EB3, #FFB997)",
                                }}
                            >
                                <span className="absolute -left-[100%] top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%]" />
                                <span className="relative">LinkedIn</span>
                                <span className="relative ml-1.5 text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default FloatingNav;
