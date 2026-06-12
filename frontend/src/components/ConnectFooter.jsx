import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
    Github,
    Linkedin,
    Twitter,
    Mail,
    ArrowUpRight,
    Send,
    CheckCircle2,
} from "lucide-react";

/* === EmailJS env-driven placeholders (inject via .env when ready) === */
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";

const ConnectFooter = () => {
    const formRef = useRef(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formRef.current,
                { publicKey: EMAILJS_PUBLIC_KEY },
            );
            setStatus("success");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus("error");
        }
    };

    const socials = [
        { name: "GitHub", icon: Github, href: "#" },
        { name: "LinkedIn", icon: Linkedin, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "Email", icon: Mail, href: "mailto:hi@asmita.dev" },
    ];

    return (
        <section
            id="connect"
            data-testid="connect-section"
            className="relative px-6 md:px-12 pt-24 pb-12 md:pt-32"
        >
            {/* Soft halo */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[60%] -z-10"
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 20%, rgba(255,71,133,0.18) 0%, transparent 70%)",
                }}
            />

            <div className="mx-auto max-w-7xl">
                {/* Big statement */}
                <motion.h2
                    initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    data-testid="connect-title"
                    className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.95] font-bold tracking-tight text-sakura-ink max-w-5xl"
                >
                    Let's{" "}
                    <span
                        style={{
                            backgroundImage:
                                "linear-gradient(120deg,#FF4785,#FF7EB3,#FFB997)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        engineer
                    </span>{" "}
                    the{" "}
                    <span className="font-serif-accent italic font-normal">
                        future
                    </span>
                    .
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 max-w-xl text-lg text-sakura-inkSoft leading-relaxed"
                >
                    Have a problem worth solving, a paper worth shipping, or a
                    product worth building? Drop a line — I read every message.
                </motion.p>

                <div className="mt-14 grid lg:grid-cols-5 gap-10 items-start">
                    {/* Contact form (3/5) */}
                    <motion.form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        data-testid="contact-form"
                        className="lg:col-span-3 glass-pink rounded-[2rem] p-6 md:p-9"
                    >
                        <div className="grid sm:grid-cols-2 gap-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                    Your name
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Sakura Tanaka"
                                    data-testid="contact-input-name"
                                    className="glass-input rounded-2xl px-5 py-4 text-[15px] font-medium"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="sakura@studio.com"
                                    data-testid="contact-input-email"
                                    className="glass-input rounded-2xl px-5 py-4 text-[15px] font-medium"
                                />
                            </label>
                        </div>

                        <label className="mt-5 flex flex-col gap-2">
                            <span className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                What's on your mind?
                            </span>
                            <textarea
                                name="message"
                                required
                                rows={5}
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Tell me about your idea, role, or project…"
                                data-testid="contact-input-message"
                                className="glass-input rounded-2xl px-5 py-4 text-[15px] font-medium resize-none"
                            />
                        </label>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-xs text-sakura-inkSoft/70 max-w-xs">
                                By submitting, you agree this message will be
                                delivered to my inbox. No spam — ever.
                            </p>
                            <motion.button
                                type="submit"
                                disabled={status === "sending"}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 18,
                                }}
                                data-testid="contact-submit"
                                className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-white text-sm disabled:opacity-70"
                                style={{
                                    background:
                                        "linear-gradient(120deg,#FF4785,#FF7EB3,#FFB997)",
                                    boxShadow:
                                        "0 18px 40px -10px rgba(255,71,133,0.6)",
                                }}
                            >
                                {status === "success" ? (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Sent — talk soon!
                                    </>
                                ) : status === "sending" ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send message
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {status === "error" && (
                            <p
                                className="mt-4 text-sm text-rose-600"
                                data-testid="contact-error"
                            >
                                Something went wrong. Please email me directly at{" "}
                                <a
                                    href="mailto:hi@asmita.dev"
                                    className="underline"
                                >
                                    hi@asmita.dev
                                </a>
                                .
                            </p>
                        )}
                    </motion.form>

                    {/* Side info (2/5) */}
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 18,
                            delay: 0.1,
                        }}
                        className="lg:col-span-2 flex flex-col gap-5"
                    >
                        <div className="glass rounded-[2rem] p-7">
                            <div className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                Direct line
                            </div>
                            <a
                                href="mailto:hi@asmita.dev"
                                className="mt-3 inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-semibold text-sakura-ink hover:text-sakura-pink transition"
                            >
                                hi@asmita.dev
                                <ArrowUpRight size={20} />
                            </a>
                            <p className="mt-3 text-sm text-sakura-inkSoft/80 leading-relaxed">
                                Usually replies within{" "}
                                <span className="text-sakura-ink font-semibold">
                                    24 hours
                                </span>{" "}
                                — IST, weekdays.
                            </p>
                        </div>

                        <div className="glass rounded-[2rem] p-7">
                            <div className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                Find me on
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {socials.map((s) => {
                                    const I = s.icon;
                                    return (
                                        <a
                                            key={s.name}
                                            href={s.href}
                                            data-testid={`social-${s.name.toLowerCase()}`}
                                            className="group flex items-center justify-between rounded-2xl bg-white/55 hover:bg-white/80 border border-white/70 px-4 py-3 text-sakura-ink transition"
                                        >
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                                <I size={16} />
                                                {s.name}
                                            </span>
                                            <ArrowUpRight
                                                size={15}
                                                className="text-sakura-inkSoft group-hover:text-sakura-pink transition"
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer baseline */}
                <div className="mt-20 pt-8 border-t border-sakura-pink/15 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm text-sakura-inkSoft/70">
                    <p>
                        © {new Date().getFullYear()} Asmita Mishra · Crafted with
                        spring physics &{" "}
                        <span className="font-serif-accent italic text-sakura-pink">
                            sakura petals
                        </span>
                        .
                    </p>
                    <p className="text-xs">
                        Built with React 19 · Three.js · Framer Motion · Tailwind
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ConnectFooter;
