import "@/App.css";
import FloatingNav from "@/components/FloatingNav";
import Hero from "@/components/Hero";
import TechArsenal from "@/components/TechArsenal";
import FeaturedProjects from "@/components/FeaturedProjects";
import ConnectFooter from "@/components/ConnectFooter";

function App() {
    return (
        <div className="App" data-testid="app-root">
            {/* Ambient aurora blobs (sit behind everything) */}
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

            <FloatingNav />

            <main className="relative z-10">
                <Hero />
                <TechArsenal />
                <FeaturedProjects />
                <ConnectFooter />
            </main>
        </div>
    );
}

export default App;
