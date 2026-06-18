import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

// Helper for Sakura levels color mapping
const getSakuraLevel = (count) => {
    if (count <= 0) return 'bg-white/5 border border-white/10';
    if (count <= 3) return 'bg-pink-300/40';
    if (count <= 6) return 'bg-pink-400/60';
    if (count <= 10) return 'bg-pink-500/80';
    return 'bg-pink-600 shadow-[0_0_8px_rgba(219,39,119,0.8)]';
};

// Format the date string from "YYYY-MM-DD" to "MMM DD, YYYY"
const formatTooltipDate = (dateStr) => {
    try {
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

export default function ContributionGraph() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchContributions = async () => {
            try {
                setIsLoading(true);
                const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '/_/backend';
                const response = await fetch(`${baseUrl}/api/github`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (isMounted) {
                    setData(result);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Error fetching github contributions:", err);
                if (isMounted) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        fetchContributions();
        return () => {
            isMounted = false;
        };
    }, []);

    // Flatten returned weeks array into a single continuous array of contributionDays
    const flattenedDays = useMemo(() => {
        if (!data?.weeks) return [];
        return data.weeks.flatMap(week => week.contributionDays || []);
    }, [data]);

    // Calculate dynamic month headers aligned to their starting weeks
    const monthsLabels = useMemo(() => {
        if (!data?.weeks) return [];
        const labels = [];
        let lastMonth = '';
        
        data.weeks.forEach((week) => {
            const firstDay = week.contributionDays?.[0];
            if (firstDay) {
                const dateObj = new Date(firstDay.date);
                const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
                if (monthName !== lastMonth) {
                    labels.push(monthName);
                    lastMonth = monthName;
                } else {
                    labels.push('');
                }
            } else {
                labels.push('');
            }
        });
        return labels;
    }, [data]);

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full rounded-[2rem] p-6 sm:p-8 border border-pink-500/20 bg-pink-950/10 text-center mt-16"
            >
                <p className="text-sm text-pink-300 font-semibold">
                    Failed to load Live Activity: {error}
                </p>
                <p className="text-xs text-pink-400/80 mt-1">
                    Please ensure the backend is running and GITHUB_PAT is set.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.15 }}
            className="relative w-full rounded-[2rem] p-6 sm:p-8 border-transparent bg-transparent shadow-none overflow-hidden mt-16"
        >
            {/* Liquid/Shader background noise element */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div 
                    className="absolute inset-0 scale-110 filter blur-3xl opacity-20"
                    style={{
                        background: "radial-gradient(circle at 30% 30%, #ff4785 0%, #ff7eb3 40%, #ffb997 80%, transparent 100%)",
                        animation: "fluid-warp 18s ease-in-out infinite alternate"
                    }}
                />
                <div 
                    className="absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            {/* Header / Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-pink-200/20 pb-4">
                <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-sakura-ink flex items-center gap-2">
                        <Flame size={18} className="text-sakura-pink fill-sakura-pink" />
                        Live Activity
                    </h3>
                    <p className="text-xs text-sakura-inkSoft/80 mt-1">
                        Pulsing and shaping code across repositories
                    </p>
                </div>
                <div className="flex items-center gap-2 text-pink-100 select-none">
                    <span className="text-xl font-bold">
                        {isLoading ? (
                            <span className="inline-block w-12 h-5 bg-white/20 animate-pulse rounded" />
                        ) : (
                            data?.totalContributions || 0
                        )}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-pink-200/80">
                        total contributions
                    </span>
                </div>
            </div>

            {/* Heatmap Grid Section */}
            <div className="w-full overflow-x-auto scrollbar-none pr-1">
                <div className="min-w-[700px] flex flex-col pt-4 pb-2">
                    {/* Months horizontal strip */}
                    <div className="flex justify-between w-full mb-2 px-1">
                        {isLoading ? (
                            ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-sakura-inkSoft/30 select-none animate-pulse">
                                    {m}
                                </span>
                            ))
                        ) : (
                            monthsLabels.filter(Boolean).map((m, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-sakura-inkSoft/50 select-none">
                                    {m}
                                </span>
                            ))
                        )}
                    </div>

                    <div className="flex gap-2.5 items-start w-full">

                        {/* Flat Grid wrapped column-first */}
                        <div 
                            className="grid grid-flow-col gap-[4px] sm:gap-[6px]"
                            style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                        >
                            {isLoading ? (
                                Array.from({ length: 371 }).map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className="w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] rounded-[3px] animate-pulse bg-white/10" 
                                    />
                                ))
                            ) : (
                                flattenedDays.map((day, idx) => (
                                    <div key={idx} className="relative overflow-visible">
                                        <div
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                            className={`w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] rounded-[3px] cursor-pointer transition-all duration-150 hover:scale-125 hover:z-30 relative ${getSakuraLevel(day.contributionCount)}`}
                                        />
                                        <AnimatePresence>
                                            {hoveredIdx === idx && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6, scale: 0.95, x: "-50%" }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                                                    exit={{ opacity: 0, y: -6, scale: 0.95, x: "-50%", transition: { duration: 0.15 } }}
                                                    className="absolute bottom-full mb-2 left-1/2 z-50 pointer-events-none px-2.5 py-1.5 text-[10px] font-semibold text-white bg-slate-950 border border-pink-500/20 rounded-xl shadow-lg whitespace-nowrap"
                                                >
                                                    {day.contributionCount === 0 ? 'No contributions' : `${day.contributionCount} contributions`} on {formatTooltipDate(day.date)}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend footer */}
            <div className="flex justify-end items-center gap-2 mt-4 text-[10px] text-sakura-inkSoft/60 select-none">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-white/5 border border-white/10" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-pink-300/40" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-pink-400/60" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-pink-500/80" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-pink-600 shadow-[0_0_8px_rgba(219,39,119,0.8)]" />
                <span>More</span>
            </div>
        </motion.div>
    );
}
