import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const experienceData = [
    {
        id: 'exp1',
        date: "2025 — Present",
        title: "Hackathon & Technical Event Participant",
        organization: "Various Organizations",
        details: "Participated in technical competitions, AI challenges, workshops, and innovation events. Collaborated on project ideation, problem-solving, and emerging technology exploration."
    },
    {
        id: 'exp2',
        date: "Jun 2026 — Present",
        title: "Freelance Developer & Digital Creator",
        organization: "Self-Employed",
        details: "Building freelance profiles on platforms like Contra and Upwork while developing portfolio projects in web development, AI, and software engineering. Focused on client communication, project delivery, and professional branding."
    }
];

const educationData = [
    {
        id: 'edu1',
        date: "2022 — 2024",
        title: "Secondary & Higher Secondary Education",
        organization: "Uttar Bhagwanpur Nabarun Vidyapith (H.S)",
        details: "Completed Secondary education (Class X) in 2022 and Higher Secondary education (Class XII) in 2024 with a focus on science."
    },
    {
        id: 'edu2',
        date: "2024 — 2028 (Expected)",
        title: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
        organization: "Adamas University",
        details: "Coursework includes Data Structures & Algorithms, DBMS, OOPs, AI, Machine Learning, Discrete Mathematics, and Software Engineering. Actively involved in technical projects, research exploration, and professional skill development."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.5,
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 12
        }
    }
};

export default function Chronicle() {
    const [activeTab, setActiveTab] = useState('experience');
    const containerRef = useRef(null);

    // Parallax Scroll Tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax Math for alternating cards
    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

    const activeData = activeTab === 'experience' ? experienceData : educationData;

    return (
        <section
            id="chronicle"
            data-testid="chronicle-section"
            className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden"
            ref={containerRef}
        >
            <div className="mx-auto max-w-7xl relative z-10">
                
                {/* Section Header */}
                <div className="flex flex-col items-center mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] font-bold tracking-tight text-sakura-ink mb-10"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sakura-pink to-sakura-peach">Chronicle</span>
                    </motion.h2>

                    {/* Toggle Switch */}
                    <div className="relative flex p-1.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm">
                        {['experience', 'education'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-full text-sm tracking-wide capitalize transition-colors duration-300 z-10 ${
                                    activeTab === tab ? 'text-sakura-ink font-bold' : 'text-sakura-inkSoft/70 hover:text-sakura-ink'
                                }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-sakura-pink/20 rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-4xl mx-auto pb-20 pt-10">
                    
                    {/* The Spine */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-sakura-pink/40 to-transparent transform md:-translate-x-1/2 rounded-full" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative"
                        >
                            {activeData.map((item, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className={`relative flex flex-col md:flex-row items-start md:items-center w-full mb-12 md:mb-0 md:h-[220px] ${
                                            isEven ? 'md:justify-start' : 'md:justify-end'
                                        }`}
                                    >
                                        
                                        {/* Dot on the spine (Parallax synced with card) */}
                                        <motion.div 
                                            style={{ y: isEven ? y1 : y2 }}
                                            className="absolute left-6 md:left-1/2 z-20 mt-6 md:mt-0"
                                        >
                                            <div className="transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-sakura-pink shadow-[0_0_15px_rgba(255,71,133,0.4)] relative">
                                                {/* Dot Ripple Effect */}
                                                <div className="absolute inset-[-4px] rounded-full pointer-events-none animate-ripple-shadow" />
                                            </div>
                                        </motion.div>

                                        {/* The Card with Parallax */}
                                        <motion.div 
                                            style={{ y: isEven ? y1 : y2 }}
                                            className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                                        >
                                            <div className="relative">
                                                 {/* Card Border Ripple Effect (Moved outside the mask so it's fully visible) */}
                                                <div className="absolute inset-0 rounded-3xl pointer-events-none animate-ripple-shadow" />

                                                <div className={`relative group bg-white/40 backdrop-blur-md border-2 border-sakura-pink/40 rounded-3xl p-6 md:p-8 hover:bg-white/60 hover:shadow-xl hover:shadow-sakura-pink/10 transition-all duration-500 ${isEven ? 'mask-card-right' : 'mask-card-left'}`}>
                                                    <div className={`text-xs font-bold tracking-wider uppercase text-sakura-pink mb-2 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                        {item.date}
                                                    </div>
                                                    <h3 className={`text-2xl font-bold text-sakura-ink mb-1 tracking-tight ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                        {item.title}
                                                    </h3>
                                                    <div className={`font-serif-accent italic text-sakura-inkSoft/80 mb-4 text-lg ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                        {item.organization}
                                                    </div>
                                                    <p className={`text-slate-600 leading-relaxed text-sm ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                                        {item.details}
                                                    </p>
                                                </div>

                                                {/* The Fluted Pointer Arrow (Perfect Glass Fusion) */}
                                                {isEven ? (
                                                    <>
                                                        <div 
                                                            className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-[31px] w-[32px] h-[48px] bg-white/40 backdrop-blur-md z-20 pointer-events-none"
                                                            style={{ clipPath: "path('M 0 0 C 0 16, 16 20, 28 22 Q 32 24, 28 26 C 16 28, 0 32, 0 48')" }}
                                                        />
                                                        <svg width="32" height="48" viewBox="0 0 32 48" className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-[31px] z-30 pointer-events-none overflow-visible">
                                                            <defs>
                                                                <mask id="hide-inside-right" maskUnits="userSpaceOnUse" x="-50" y="-50" width="132" height="148">
                                                                    <rect x="-50" y="-50" width="132" height="148" fill="white" />
                                                                    <path d="M 0 0 C 0 16, 16 20, 28 22 Q 32 24, 28 26 C 16 28, 0 32, 0 48 Z" fill="black" />
                                                                    {/* Hide area inside the card (x < 0) */}
                                                                    <rect x="-50" y="-50" width="50" height="148" fill="black" />
                                                                </mask>
                                                            </defs>
                                                            {/* SVG Pointer Ripple Effect (Masked to only expand outwards) */}
                                                            <path d="M 0 0 C 0 16, 16 20, 28 22 Q 32 24, 28 26 C 16 28, 0 32, 0 48" fill="none" className="animate-ripple-svg" mask="url(#hide-inside-right)" />
                                                            <path d="M 0 0 C 0 16, 16 20, 28 22 Q 32 24, 28 26 C 16 28, 0 32, 0 48" fill="none" stroke="rgba(255,71,133,0.4)" strokeWidth="2" />
                                                        </svg>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div 
                                                            className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-[31px] w-[32px] h-[48px] bg-white/40 backdrop-blur-md z-20 pointer-events-none"
                                                            style={{ clipPath: "path('M 32 0 C 32 16, 16 20, 4 22 Q 0 24, 4 26 C 16 28, 32 32, 32 48')" }}
                                                        />
                                                        <svg width="32" height="48" viewBox="0 0 32 48" className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-[31px] z-30 pointer-events-none overflow-visible">
                                                            <defs>
                                                                <mask id="hide-inside-left" maskUnits="userSpaceOnUse" x="-50" y="-50" width="132" height="148">
                                                                    <rect x="-50" y="-50" width="132" height="148" fill="white" />
                                                                    <path d="M 32 0 C 32 16, 16 20, 4 22 Q 0 24, 4 26 C 16 28, 32 32, 32 48 Z" fill="black" />
                                                                    {/* Hide area inside the card (x > 32) */}
                                                                    <rect x="32" y="-50" width="50" height="148" fill="black" />
                                                                </mask>
                                                            </defs>
                                                            {/* SVG Pointer Ripple Effect (Masked to only expand outwards) */}
                                                            <path d="M 32 0 C 32 16, 16 20, 4 22 Q 0 24, 4 26 C 16 28, 32 32, 32 48" fill="none" className="animate-ripple-svg" mask="url(#hide-inside-left)" />
                                                            <path d="M 32 0 C 32 16, 16 20, 4 22 Q 0 24, 4 26 C 16 28, 32 32, 32 48" fill="none" stroke="rgba(255,71,133,0.4)" strokeWidth="2" />
                                                        </svg>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
}
