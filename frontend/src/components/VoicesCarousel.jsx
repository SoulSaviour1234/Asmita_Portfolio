import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';

const TESTIMONIALS_DATA = [
    {
        id: 'voice-1',
        quote: "The technical stack she use proves she understand exactly where the industry is heading. Embedding live, AI-driven architectures into highly tactile, immersive web experiences makes her stand out from 99% of developers just building static pages.",
        name: "Srijit Paul",
        role: "Teammate",
        avatar: "/srijit.jpeg",
        linkedin: "https://www.linkedin.com/in/srijit-paul-65593630b/"
    },
    {
        id: 'voice-2',
        quote: "From UI to API endpoints she can build it all and ship a polished product at your service",
        name: "Saptarshi Basak",
        role: "Teammate",
        avatar: "/saptarshi.jpeg",
        linkedin: "https://www.linkedin.com/in/saptarshi-basak/"
    }
];

// Magnetic Button Wrapper
const MagneticButton = ({ onClick, children, disabled }) => {
    const ref = useRef(null);
    const mX = useMotionValue(0);
    const mY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const springX = useSpring(mX, springConfig);
    const springY = useSpring(mY, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        mX.set(dx * 0.35);
        mY.set(dy * 0.35);
    };

    const handleMouseLeave = () => {
        mX.set(0);
        mY.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="w-12 h-12 rounded-full border border-pink-200/50 bg-white/40 backdrop-blur-md text-sakura-ink flex items-center justify-center cursor-pointer shadow-md hover:bg-white/60 hover:text-pink-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
            {children}
        </motion.button>
    );
};

export default function VoicesCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    const handlePrev = () => {
        if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    };

    const handleNext = () => {
        if (activeIndex < TESTIMONIALS_DATA.length - 1) setActiveIndex(activeIndex + 1);
    };

    const handleDragEnd = (event, info) => {
        const threshold = 60;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        if (offset < -threshold || velocity < -400) {
            handleNext();
        } else if (offset > threshold || velocity > 400) {
            handlePrev();
        }
    };

    return (
        <section
            id="voices"
            data-testid="voices-section"
            className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden bg-transparent"
        >
            <div className="mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-sakura-inkSoft"
                    >
                        <MessageSquare size={12} className="text-sakura-pink" />
                        Teammate Voices
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 90, damping: 18 }}
                        className="font-display mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-sakura-ink leading-none"
                    >
                        Teammates & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sakura-pink to-sakura-peach">Leads</span>.
                    </motion.h2>
                </div>
            </div>

            {/* 3D Coverflow Container (Full Width of Section) */}
            <div 
                ref={containerRef}
                className="relative flex items-center justify-center w-full h-[480px] md:h-[420px] -mt-10 md:-mt-14 -mb-12 md:-mb-16 mask-carousel"
            >
                <AnimatePresence initial={false}>
                    {TESTIMONIALS_DATA.map((t, idx) => {
                        const offset = idx - activeIndex;
                        const isActive = idx === activeIndex;

                        // Calculate progressive 3D positions so side cards stack nicely
                        let xOffset = "0%";
                        if (offset < 0) {
                            xOffset = `calc(${offset * 18}% - 52%)`;
                        } else if (offset > 0) {
                            xOffset = `calc(${offset * 18}% + 52%)`;
                        }

                        // Progressive styling based on distance from active index
                        const absOffset = Math.abs(offset);
                        const cardScale = isActive ? 1 : 0.85 - (absOffset - 1) * 0.05;
                        const cardOpacity = isActive ? 1 : 0.65 - (absOffset - 1) * 0.2;
                        const cardBlur = isActive ? 'blur(0px)' : `blur(${2 + (absOffset - 1) * 2}px)`;
                        const cardZIndex = 10 - absOffset;

                        return (
                            <motion.div
                                key={t.id}
                                style={{
                                    zIndex: cardZIndex,
                                }}
                                animate={{
                                    x: xOffset,
                                    scale: cardScale,
                                    opacity: cardOpacity,
                                    filter: cardBlur,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 24
                                }}
                                drag={isActive ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                className={`absolute w-full max-w-[22rem] sm:max-w-md md:max-w-lg bg-white/40 backdrop-blur-xl border border-pink-200/50 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[300px] md:h-[260px] select-none ${isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                            >
                                {/* Quote Mark Watermark */}
                                <div className="absolute top-2 left-4 text-[10rem] font-serif font-black text-pink-500/[0.06] select-none pointer-events-none leading-none">
                                    “
                                </div>

                                {/* Main Quote Content */}
                                <div className="relative z-10 flex-1 flex items-center">
                                    <AnimatePresence mode="wait">
                                        {isActive && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.1 }}
                                                className="text-[15px] sm:text-base md:text-lg font-medium text-sakura-pink leading-relaxed text-left"
                                            >
                                                {t.quote}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Author Footer */}
                                <div className="relative z-10 pt-4 flex items-center gap-3.5">
                                    {/* Profile Avatar */}
                                    <div className="w-11 h-11 rounded-full border border-pink-200/50 bg-gradient-to-tr from-pink-100 to-pink-50 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                                        {t.avatar ? (
                                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold text-sakura-pink">
                                                {t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start flex-1">
                                        <span className="text-[15px] font-bold text-slate-900 leading-tight">
                                            {t.name}
                                        </span>
                                        <span className="text-[11px] uppercase tracking-wider font-semibold text-sakura-pink mt-0.5">
                                            {t.role}
                                        </span>
                                    </div>
                                    {t.linkedin && (
                                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="ml-auto text-sakura-pink hover:text-pink-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mx-auto max-w-7xl relative z-10">
                {/* Magnetic Navigation Controls */}
                <div className="flex items-center justify-center gap-4 mt-8 md:mt-12">
                    <MagneticButton onClick={handlePrev} disabled={activeIndex === 0}>
                        <ArrowLeft size={16} />
                    </MagneticButton>
                    <div className="flex gap-1.5">
                        {TESTIMONIALS_DATA.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-sakura-pink w-6' : 'bg-pink-200'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <MagneticButton onClick={handleNext} disabled={activeIndex === TESTIMONIALS_DATA.length - 1}>
                        <ArrowRight size={16} />
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
