import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const LINKS = [
    { label: "Work", href: "#work" },
    { label: "Arsenal", href: "#arsenal" },
    { label: "Projects", href: "#projects" },
    { label: "Connect", href: "#connect" },
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
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 16,
                    delay: 0.1,
                }}
                className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[min(960px,92vw)]"
            >
                <div
                    className={`glass rounded-full pl-6 pr-3 py-2.5 flex items-center justify-between transition-all duration-500 ${
                        scrolled
                            ? "shadow-glow-soft scale-[0.985]"
                            : "shadow-none"
                    }`}
                >
                    {/* Logo */}
                    <a
                        href="#top"
                        data-testid="nav-logo"
                        className="flex items-center gap-2 group"
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
                            />
                        </motion.span>
                        <span className="font-display text-[17px] font-semibold tracking-tight text-sakura-ink">
                            asmita
                            <span className="font-serif-accent text-sakura-pink">
                                .
                            </span>
                            mishra
                        </span>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                data-testid={`nav-link-${l.label.toLowerCase()}`}
                                className="nav-link px-4 py-2 text-sm font-medium"
                            >
                                {l.label}
                            </a>
                        ))}
                        <a
                            href="#connect"
                            data-testid="nav-cta"
                            className="ml-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
                            style={{
                                background:
                                    "linear-gradient(120deg, #FF4785 0%, #FF7EB3 60%, #FFB997 100%)",
                                boxShadow:
                                    "0 12px 30px -8px rgba(255,71,133,0.55)",
                            }}
                        >
                            Say hi
                            <span className="text-white/90">↗</span>
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        data-testid="nav-mobile-toggle"
                        onClick={() => setMobileOpen((s) => !s)}
                        className="md:hidden h-10 w-10 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-sakura-ink border border-white/70"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
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
                            className="md:hidden mt-2 glass rounded-3xl p-3"
                            data-testid="nav-mobile-menu"
                        >
                            {LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 rounded-2xl text-sakura-ink font-medium hover:bg-white/60 transition"
                                >
                                    {l.label}
                                </a>
                            ))}
                            <a
                                href="#connect"
                                onClick={() => setMobileOpen(false)}
                                className="mt-2 block text-center rounded-full px-4 py-3 text-white font-semibold"
                                style={{
                                    background:
                                        "linear-gradient(120deg, #FF4785, #FF7EB3, #FFB997)",
                                }}
                            >
                                Say hi ↗
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default FloatingNav;
