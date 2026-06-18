import React from 'react';
import { motion } from 'framer-motion';

export default function PreLoader() {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-auto"
            style={{ background: "radial-gradient(circle at center, #2d0b1a 0%, #120109 100%)" }}
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ 
                opacity: 0, 
                scale: 1.1, 
                filter: "blur(12px)"
            }}
            transition={{ 
                duration: 0.8, 
                ease: [0.6, -0.28, 0.735, 0.045] // custom circIn curve
            }}
        >
            <div className="relative flex flex-col items-center gap-6">
                <svg 
                    viewBox="0 0 100 100" 
                    className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_15px_rgba(255,71,133,0.4)]" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {[0, 72, 144, 216, 288].map((angle, idx) => (
                        <motion.path
                            key={idx}
                            d="M 50 50 C 45 35, 38 25, 47 15 C 50 18, 50 18, 53 15 C 62 25, 55 35, 50 50 Z"
                            transform={`rotate(${angle} 50 50)`}
                            stroke="#ff4785"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2.2, ease: "easeInOut", delay: idx * 0.1 }}
                        />
                    ))}
                </svg>
                
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 0.9, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    className="flex flex-col items-center text-center gap-2"
                >
                    <span className="font-display text-2xl font-bold tracking-wider text-white">
                        ASMITA MISHRA
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-pink-500 font-bold">
                        Full Stack Web & AI Developer
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
