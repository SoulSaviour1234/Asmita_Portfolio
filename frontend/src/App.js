import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import "@/App.css";
import FloatingNav from "@/components/FloatingNav";
import Hero from "@/components/Hero";
import TechArsenal from "@/components/TechArsenal";
import FeaturedProjects from "@/components/FeaturedProjects";
import Chronicle from "@/components/Chronicle";
import Writings from "@/components/Writings";
import VoicesCarousel from "@/components/VoicesCarousel";
import ConnectFooter from "@/components/ConnectFooter";
import AITerminal from "@/components/AITerminal";
import PreLoader from "@/components/PreLoader";

const GlobalPetalsScene = lazy(() => import("@/components/GlobalPetalsScene"));

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App" data-testid="app-root">
            <AnimatePresence mode="wait">
                {isLoading && <PreLoader key="preloader" />}
            </AnimatePresence>
            <Suspense fallback={<div className="fixed inset-0 z-0 pointer-events-none" />}>
                <GlobalPetalsScene />
            </Suspense>
            {/* Ambient aurora blobs (sit behind everything) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="aurora-blob animate-float-slow"
                    style={{
                        top: "8%",
                        left: "-6%",
                        width: 420,
                        height: 420,
                        background:
                            "radial-gradient(circle, #FF7EB3 0%, transparent 70%)",
                    }}
                />
                <div
                    className="aurora-blob animate-float-slow"
                    style={{
                        top: "40%",
                        right: "-8%",
                        width: 520,
                        height: 520,
                        background:
                            "radial-gradient(circle, #FFB997 0%, transparent 70%)",
                        animationDelay: "2s",
                    }}
                />
                <div
                    className="aurora-blob animate-float-slow"
                    style={{
                        bottom: "-10%",
                        left: "20%",
                        width: 600,
                        height: 600,
                        background:
                            "radial-gradient(circle, #FF4785 0%, transparent 70%)",
                        opacity: 0.35,
                        animationDelay: "4s",
                    }}
                />
            </div>

            <FloatingNav />

            <main className="relative z-10">
                <Hero />
                <TechArsenal />
                <FeaturedProjects />
                <Chronicle />
                <Writings />
                <VoicesCarousel />
                <ConnectFooter />
            </main>
            <AITerminal />
        </div>
    );
}

export default App;
