import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
    Github,
    Linkedin,
    ArrowUpRight,
    Send,
    CheckCircle2,
    Instagram,
    MessageCircle,
} from "lucide-react";

const ConnectFooter = () => {
    const formRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                {
                    from_name: name,
                    reply_to: email,
                    message: message,
                },
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );
            setIsSuccess(true);
            setName("");
            setEmail("");
            setMessage("");
        } catch (err) {
            console.error("EmailJS error:", err);
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const socials = [
        { name: "GitHub", icon: Github, href: "https://github.com/mishraasmita885-gif" },
        { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/asmita-mishra-0427b5368/?isSelfProfile=false" },
        { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/mishra.asmi_17/" },
        { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/+918250802238" },
    ];

    return (
        <section
            id="connect"
            data-testid="connect-section"
            className="relative px-6 md:px-12 pt-24 pb-4 md:pt-32 md:pb-6"
        >

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
                                </span>                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="sakura@studio.com"
                                    data-testid="contact-input-email"
                                    className="glass-input rounded-2xl px-5 py-4 text-[15px] font-medium"
                                />
                            </label>
                            <label className="sm:col-span-2 flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-[0.18em] text-sakura-inkSoft/80 font-medium">
                                    What's on your mind?
                                </span>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell me about your idea, role, or project…"
                                    data-testid="contact-input-message"
                                    className="glass-input rounded-2xl px-5 py-4 text-[15px] font-medium resize-none"
                                />
                            </label>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-xs text-sakura-inkSoft/70 max-w-xs">
                                By submitting, you agree this message will be
                                delivered to my inbox. No spam — ever.
                            </p>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 18,
                                }}
                                data-testid="contact-submit"
                                className={`inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-white text-sm disabled:opacity-70 ${isSubmitting ? "animate-pulse" : ""}`}
                                style={{
                                    background:
                                        "linear-gradient(120deg,#FF4785,#FF7EB3,#FFB997)",
                                    boxShadow:
                                        "0 18px 40px -10px rgba(255,71,133,0.6)",
                                }}
                            >
                                {isSuccess ? (
                                    <>
                                        <CheckCircle2 size={17} aria-hidden="true" />
                                        Message Sent!
                                    </>
                                ) : isSubmitting ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" aria-hidden="true" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} aria-hidden="true" />
                                        Send message
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {isError && (
                            <p
                                className="mt-4 text-sm text-rose-600"
                                data-testid="contact-error"
                            >
                                Something went wrong. Please email me directly at{" "}
                                <a
                                    href="mailto:mishraasmita885@gmail.com"
                                    className="underline"
                                >
                                    mishraasmita885@gmail.com
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
                                href="mailto:mishraasmita885@gmail.com"
                                className="group mt-3 inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-semibold text-sakura-ink hover:text-sakura-pink transition break-all"
                            >
                                mishraasmita885@gmail.com
                                <ArrowUpRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
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
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {socials.map((s) => {
                                    const I = s.icon;
                                    return (
                                        <a
                                            key={s.name}
                                            href={s.href}
                                            target={s.href.startsWith("http") ? "_blank" : undefined}
                                            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            data-testid={`social-${s.name.toLowerCase()}`}
                                            className="group flex items-center justify-between rounded-2xl bg-white/55 hover:bg-white/80 border border-white/70 hover:border-sakura-pink px-4 py-3 text-sakura-pink hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(255,71,133,0.3)] hover:scale-[1.02] transition-all duration-300"
                                        >
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                                <I size={16} aria-hidden="true" />
                                                {s.name}
                                            </span>
                                            <ArrowUpRight
                                                size={15}
                                                className="text-sakura-pink/60 group-hover:text-sakura-pink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer baseline */}
                <div className="mt-12 pt-6 border-t border-sakura-pink/15 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 w-full">
                    <p className="text-center md:text-left">
                        © {new Date().getFullYear()} <span className="text-sakura-pink">Asmita Mishra</span> · Crafted with <span className="text-black font-medium">clean code</span> & <span className="text-sakura-pink">lots of petals</span>.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="group flex items-center gap-2 hover:text-slate-900 transition-colors"
                    >
                        Back to the top
                        <svg
                            className="w-4 h-4 transition-transform group-hover:-translate-y-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ConnectFooter;
