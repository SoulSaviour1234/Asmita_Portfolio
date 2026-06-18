import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const writingsData = [
    {
        id: 1,
        title: "The Future of AI Research",
        date: "May 2026",
        category: "AI Research",
        snippet: "Exploring the next frontier of artificial general intelligence and its impact on modern computing.",
        fullContent: "Exploring the next frontier of artificial general intelligence and its impact on modern computing. In this article, we delve deep into the architectural breakthroughs that are pushing the boundaries of what neural networks can achieve, examining the philosophical and practical challenges of scale."
    },
    {
        id: 2,
        title: "Architecting Scalable Systems",
        date: "April 2026",
        category: "System Design",
        snippet: "A deep dive into distributed systems, microservices, and how to build web applications that can handle millions of users.",
        fullContent: "A deep dive into distributed systems, microservices, and how to build web applications that can handle millions of users. We will explore caching strategies, database sharding, and edge computing architectures that modern engineering teams use to prevent downtime during peak loads."
    },
    {
        id: 3,
        title: "Mastering Framer Motion",
        date: "March 2026",
        category: "Frontend Development",
        snippet: "How to create fluid, buttery-smooth web animations that delight users without sacrificing performance.",
        fullContent: "How to create fluid, buttery-smooth web animations that delight users without sacrificing performance. This guide covers layout animations, shared layout transitions, and orchestration techniques to bring your static React interfaces to life seamlessly."
    }
];

export default function Writings() {
    const [selectedArticle, setSelectedArticle] = useState(null);

    return (
        <section id="writings" className="relative py-32 px-6 md:px-12 z-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif-accent font-bold text-sakura-ink mb-4">
                        Writings & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sakura-pink to-sakura-peach">Thoughts</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        A collection of my articles on artificial intelligence, software engineering, and the future of technology.
                    </p>
                </div>

                {/* The Bento Box Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {writingsData.map((article) => (
                        <motion.div 
                            key={article.id}
                            whileHover={{ y: -6 }}
                            className="h-[280px]"
                        >
                            <motion.div
                                layoutId={`article-container-${article.id}`}
                                onClick={() => setSelectedArticle(article)}
                                className="relative rounded-3xl p-[2px] cursor-pointer shadow-lg shadow-sakura-pink/5 overflow-hidden group flex flex-col justify-between h-full"
                            >
                                {/* The Flowing Border (Seamlessly Blended Glows) */}
                                <div className="absolute inset-[-100%] z-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#FF4785_25%,transparent_50%,#FF7EB3_75%,transparent_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Inner Glass Card Core */}
                                <div className="absolute inset-[2px] z-0 rounded-[22px] bg-white/70 backdrop-blur-xl border border-white/40" />

                                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                                    <div>
                                        <motion.span 
                                            layoutId={`article-category-${article.id}`}
                                            className="inline-block px-3 py-1 bg-sakura-pink/10 text-sakura-pink font-bold text-xs uppercase tracking-wider rounded-full mb-4"
                                        >
                                            {article.category}
                                        </motion.span>
                                        <motion.h3 
                                            layoutId={`article-title-${article.id}`}
                                            className="text-xl font-sans text-slate-900 font-bold mb-3"
                                        >
                                            {article.title}
                                        </motion.h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {article.snippet}
                                        </p>
                                    </div>
                                    <div className="mt-6 text-xs text-slate-400 font-semibold tracking-widest uppercase">
                                        {article.date}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Seamless Modal Overlay */}
            <AnimatePresence>
                {selectedArticle && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xl"
                            onClick={() => setSelectedArticle(null)}
                        />

                        {/* Expanded Article Card */}
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                            <motion.div
                                layoutId={`article-container-${selectedArticle.id}`}
                                className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl p-[2px] shadow-2xl shadow-sakura-pink/20 overflow-hidden pointer-events-auto flex flex-col"
                            >
                                {/* The Flowing Border (Seamlessly Blended Glows) */}
                                <div className="absolute inset-[-100%] z-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#FF4785_25%,transparent_50%,#FF7EB3_75%,transparent_100%)] opacity-70 transition-opacity duration-500" />
                                
                                {/* Inner Glass Card Core */}
                                <div className="absolute inset-[2px] z-0 rounded-[22px] bg-white/90 backdrop-blur-2xl border border-white/50" />

                                {/* Scrollable Content Area */}
                                <div className="relative z-10 w-full flex-1 overflow-y-auto rounded-[22px]">
                                    <div className="sticky top-0 right-0 flex justify-end p-4 z-10 bg-gradient-to-b from-white/90 to-transparent">
                                        <button 
                                            onClick={() => setSelectedArticle(null)}
                                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:text-sakura-pink hover:bg-sakura-pink/10 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="px-8 pb-12 md:px-12">
                                    <motion.span 
                                        layoutId={`article-category-${selectedArticle.id}`}
                                        className="inline-block px-3 py-1 bg-sakura-pink/10 text-sakura-pink font-bold text-xs uppercase tracking-wider rounded-full mb-6"
                                    >
                                        {selectedArticle.category}
                                    </motion.span>
                                    
                                    <motion.h3 
                                        layoutId={`article-title-${selectedArticle.id}`}
                                        className="text-3xl md:text-4xl font-sans text-slate-900 font-bold mb-4"
                                    >
                                        {selectedArticle.title}
                                    </motion.h3>

                                    <div className="text-sm text-slate-400 font-semibold tracking-widest uppercase mb-8 pb-8 border-b border-slate-100">
                                        {selectedArticle.date}
                                    </div>
                                    
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="prose prose-slate max-w-none"
                                    >
                                        <p className="text-slate-600 leading-loose text-lg">
                                            {selectedArticle.fullContent}
                                        </p>
                                    </motion.div>
                                </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
