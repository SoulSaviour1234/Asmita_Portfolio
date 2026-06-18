import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Terminal, Cpu, BarChart2, ArrowUpRight, Github, Code, Sparkles, Activity } from 'lucide-react';

// Sample experiments data for the Bento Box
const LAB_EXPERIMENTS = [
    {
        id: 'lab-1',
        title: "CNN Ensemble Classifier",
        category: "Python / PyTorch",
        type: "code",
        code: `class LeafCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(32 * 14 * 14, 120)
        self.fc2 = nn.Linear(120, 5) # 5 disease classes
        
    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = x.view(-1, 32 * 14 * 14)
        return self.fc2(F.relu(self.fc1(x)))`,
        colSpan: "md:col-span-2 lg:col-span-2",
        rowSpan: "row-span-2",
        icon: Terminal
    },
    {
        id: 'lab-2',
        title: "Sakura Fluid Shader",
        category: "GLSL / WebGL",
        type: "shader",
        gradient: "from-pink-400 via-rose-500 to-purple-600",
        colSpan: "md:col-span-1 lg:col-span-2",
        rowSpan: "row-span-1",
        icon: Cpu
    },
    {
        id: 'lab-3',
        title: "Model Convergence",
        category: "Framer Motion / SVG",
        type: "viz",
        vizType: "chart",
        colSpan: "md:col-span-1 lg:col-span-1",
        rowSpan: "row-span-1",
        icon: BarChart2
    },
    {
        id: 'lab-4',
        title: "Instanced Wind Particles",
        category: "React Three Fiber",
        type: "code",
        code: `const count = 1000;
const meshRef = useRef();

useFrame((state) => {
  const time = state.clock.getElapsedTime();
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    // Math to compute wind vector flow
    matrix.setPosition(
      Math.sin(time + i) * 5,
      Math.cos(time * 0.5 + i) * 5,
      i * 0.1
    );
    meshRef.current.setMatrixAt(i, matrix);
  }
  meshRef.current.instanceMatrix.needsUpdate = true;
});`,
        colSpan: "md:col-span-2 lg:col-span-2",
        rowSpan: "row-span-1",
        icon: Code
    },
    {
        id: 'lab-5',
        title: "Wind Vector Field",
        category: "SVG Geometry",
        type: "viz",
        vizType: "vector",
        colSpan: "md:col-span-1 lg:col-span-1",
        rowSpan: "row-span-2",
        icon: Activity
    },
    {
        id: 'lab-6',
        title: "Perlin Noise Shader",
        category: "Fragment Shader",
        type: "shader",
        gradient: "from-purple-500 via-pink-500 to-peach-400",
        colSpan: "md:col-span-1 lg:col-span-1",
        rowSpan: "row-span-1",
        icon: Sparkles
    }
];

// Magnetic Link Wrapper
const MagneticElement = ({ children, mouseX, mouseY }) => {
    return (
        <motion.div
            style={{ x: mouseX, y: mouseY }}
            className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors duration-300"
        >
            <ArrowUpRight size={16} />
        </motion.div>
    );
};

// Bento Card Component
const LabCard = ({ experiment }) => {
    const cardRef = useRef(null);
    const [offset, setOffset] = useState({ left: 0, top: 0 });

    // Magnetic variables for the hover action icon
    const mX = useMotionValue(0);
    const mY = useMotionValue(0);
    const springConfig = { stiffness: 120, damping: 15 };
    const magneticX = useSpring(mX, springConfig);
    const magneticY = useSpring(mY, springConfig);

    useEffect(() => {
        const updateOffset = () => {
            if (cardRef.current) {
                setOffset({
                    left: cardRef.current.offsetLeft,
                    top: cardRef.current.offsetTop
                });
            }
        };
        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, []);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // Pull the magnetic icon slightly toward the cursor
        mX.set(Math.max(-20, Math.min(20, dx * 0.15)));
        mY.set(Math.max(-20, Math.min(20, dy * 0.15)));
    };

    const handleMouseLeave = () => {
        mX.set(0);
        mY.set(0);
    };

    const Icon = experiment.icon;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                '--card-left': `${offset.left}px`,
                '--card-top': `${offset.top}px`
            }}
            className={`lab-card group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:border-pink-300/40 hover:bg-white/10 ${experiment.colSpan} ${experiment.rowSpan}`}
        >
            {/* Header meta */}
            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        <Icon size={18} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                            {experiment.category}
                        </span>
                        <h4 className="text-lg font-bold text-white tracking-tight">
                            {experiment.title}
                        </h4>
                    </div>
                </div>

                <MagneticElement mouseX={magneticX} mouseY={magneticY} />
            </div>

            {/* Content Body */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
                {/* Type A: Code Snippet */}
                {experiment.type === 'code' && (
                    <div className="rounded-2xl bg-black/40 border border-white/5 p-4 overflow-hidden font-mono text-[11px] leading-relaxed text-pink-200/80 shadow-inner max-h-[160px] relative">
                        <div className="absolute top-2 right-3 flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                        </div>
                        <pre className="overflow-x-auto select-none pt-2">
                            <code>{experiment.code}</code>
                        </pre>
                    </div>
                )}

                {/* Type B: Fluid Shader Background */}
                {experiment.type === 'shader' && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${experiment.gradient} animate-gradient-flow opacity-25 filter blur-md transition-opacity duration-300 group-hover:opacity-45 -z-10`} />
                )}
                {experiment.type === 'shader' && (
                    <div className="h-24 flex items-center justify-center">
                        <div className="text-xs text-slate-400/80 italic flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                            Rendering fragment shader pipeline...
                        </div>
                    </div>
                )}

                {/* Type C: Data Visualization */}
                {experiment.type === 'viz' && experiment.vizType === 'chart' && (
                    <div className="h-28 flex items-end justify-between gap-1.5 px-2">
                        {[40, 75, 55, 90, 65, 80, 95].map((val, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${val}%` }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 10,
                                    delay: idx * 0.05
                                }}
                                className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t-md"
                            />
                        ))}
                    </div>
                )}

                {/* Type C: Data Visualization - SVG Vector field */}
                {experiment.type === 'viz' && experiment.vizType === 'vector' && (
                    <div className="h-32 flex items-center justify-center overflow-hidden">
                        <svg className="w-32 h-32 text-pink-400/30" viewBox="0 0 100 100">
                            {[1, 2, 3, 4, 5].map((r) => (
                                <motion.circle
                                    key={r}
                                    cx="50"
                                    cy="50"
                                    r={r * 8}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    animate={{
                                        rotate: r % 2 === 0 ? 360 : -360,
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        rotate: { repeat: Infinity, duration: 15 / r, ease: "linear" },
                                        scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                                    }}
                                />
                            ))}
                            <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="50" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TheLab() {
    const gridRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gridRef.current.style.setProperty('--mouse-x', `${x}px`);
        gridRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    useEffect(() => {
        const updateGridSize = () => {
            if (gridRef.current) {
                gridRef.current.style.setProperty('--grid-width', `${gridRef.current.offsetWidth}px`);
                gridRef.current.style.setProperty('--grid-height', `${gridRef.current.offsetHeight}px`);
            }
        };
        updateGridSize();
        window.addEventListener('resize', updateGridSize);
        return () => window.removeEventListener('resize', updateGridSize);
    }, []);

    return (
        <section
            id="lab"
            data-testid="lab-section"
            className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden bg-slate-950 text-white"
        >
            <style>{`
                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-flow {
                    background-size: 200% 200%;
                    animation: gradient-flow 6s ease infinite;
                }
                .lab-card::before {
                    content: "";
                    position: absolute;
                    top: calc(-1 * var(--card-top, 0px));
                    left: calc(-1 * var(--card-left, 0px));
                    width: var(--grid-width, 100vw);
                    height: var(--grid-height, 100vh);
                    background: radial-gradient(
                        400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
                        rgba(244, 63, 94, 0.12),
                        transparent 80%
                    );
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .lab-card:hover::before {
                    opacity: 1;
                }
            `}</style>

            <div className="mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20 shadow-sm"
                        >
                            <Cpu size={12} />
                            Experimental Sandbox
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 90, damping: 18 }}
                            className="font-display mt-5 text-4xl md:text-6xl font-bold tracking-tight text-white leading-none"
                        >
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Lab</span>.
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="max-w-sm text-slate-400 text-base md:text-lg leading-relaxed md:text-right"
                    >
                        A playground for fragments, webGL shaders, data visualizations, and code experiments.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div
                    ref={gridRef}
                    onMouseMove={handleMouseMove}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
                >
                    {LAB_EXPERIMENTS.map((exp) => (
                        <LabCard key={exp.id} experiment={exp} />
                    ))}
                </div>
            </div>
        </section>
    );
}
