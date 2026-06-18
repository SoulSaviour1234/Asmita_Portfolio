import { useMemo, useRef, useEffect } from "react";
// Cache invalidation comment
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ============================================================
   Procedural sakura petal shape
   ============================================================ */
const buildPetalShape = () => {
    const s = new THREE.Shape();
    // Start at the narrow stem base
    s.moveTo(0, 0);
    // Smooth curve up the right side
    s.bezierCurveTo(0.4, 0.2, 0.5, 0.7, 0.2, 1.0);
    // Smooth rounded tip (no notch)
    s.bezierCurveTo(0.1, 1.15, -0.1, 1.15, -0.2, 1.0);
    // Smooth curve down the left side back to base
    s.bezierCurveTo(-0.5, 0.7, -0.4, 0.2, 0, 0);
    return s;
};

const EXTRUDE_OPTS = {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 16,
};

const PETAL_COUNT = 150; // Decreased density for a calmer, less frequent effect

/* ============================================================
   Instanced Petals Component
   ============================================================ */
const Petals = ({ mouse }) => {
    const meshRef = useRef();
    const { viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Physics state for each instance
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < PETAL_COUNT; i++) {
            temp.push({
                x: (Math.random() - 0.5) * viewport.width * 1.5,
                y: Math.random() * viewport.height * 2, // Spawn at various heights
                z: (Math.random() - 0.5) * 12 - 2, // Varied depth
                vx: (Math.random() - 0.5) * 0.5,
                vy: -(Math.random() * 0.5 + 0.5),
                vz: (Math.random() - 0.5) * 0.5,
                rx: Math.random() * Math.PI * 2,
                ry: Math.random() * Math.PI * 2,
                rz: Math.random() * Math.PI * 2,
                rvx: (Math.random() - 0.5) * 0.03,
                rvy: (Math.random() - 0.5) * 0.03,
                rvz: (Math.random() - 0.5) * 0.03,
                scale: Math.random() * 0.15 + 0.05,
                mass: Math.random() * 0.5 + 0.5,
            });
        }
        return temp;
    }, [viewport.width, viewport.height]);

    // Reusable geometry
    const petalGeom = useMemo(() => {
        const g = new THREE.ExtrudeGeometry(buildPetalShape(), EXTRUDE_OPTS);
        g.translate(0, -0.55, 0); // Center pivot
        return g;
    }, []);

    // Wind gust state
    const wind = useRef({ force: 0, target: 0 });

    useEffect(() => {
        // Periodic wind gusts
        const interval = setInterval(() => {
            // Apply a burst of wind either left or right
            wind.current.target = (Math.random() - 0.5) * 6;
            
            // Wind dies down after a few seconds
            setTimeout(() => {
                wind.current.target = 0;
            }, 3000 + Math.random() * 2000);
        }, 12000); // Every 12 seconds
        
        return () => clearInterval(interval);
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Smoothly interpolate wind force
        wind.current.force += (wind.current.target - wind.current.force) * delta * 0.8;

        // Mouse projected coords mapped roughly to viewport
        const mx = mouse.current ? mouse.current.x * (viewport.width / 2) : 0;
        const my = mouse.current ? mouse.current.y * (viewport.height / 2) * -1 : 0;

        particles.forEach((p, i) => {
            // Mouse repulsion logic
            if (mouse.current) {
                const dx = p.x - mx;
                const dy = p.y - my;
                const distSq = dx * dx + dy * dy;
                
                // If close to mouse, apply repulsive force
                if (distSq < 4) { 
                    const force = 1 / Math.max(distSq, 0.1);
                    p.vx += (dx * force) * delta * 3;
                    p.vy += (dy * force) * delta * 3;
                }
            }

            // Apply wind force
            p.vx += wind.current.force * (1 / p.mass) * delta * 0.4;

            // Air resistance (damping)
            p.vx *= 0.98;
            p.vy *= 0.99;
            p.vz *= 0.98;

            // Terminal velocity gravity (always pulling down)
            p.vy -= 1.0 * delta;
            if (p.vy < -2.5) p.vy = -2.5;

            // Update positions
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.z += p.vz * delta;

            // Update rotations
            p.rx += p.rvx;
            p.ry += p.rvy;
            p.rz += p.rvz;

            // Loop petals that fall off the bottom of the screen
            if (p.y < -viewport.height / 2 - 2) {
                p.y = viewport.height / 2 + 2;
                p.x = (Math.random() - 0.5) * viewport.width * 1.5;
                p.vx = (Math.random() - 0.5) * 0.5;
                p.vy = -(Math.random() * 0.5 + 0.5);
                p.z = (Math.random() - 0.5) * 12 - 2;
            }

            // Wrap horizontal boundaries
            if (p.x > viewport.width * 1.5) p.x = -viewport.width * 1.5;
            if (p.x < -viewport.width * 1.5) p.x = viewport.width * 1.5;

            // Set instance matrix
            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(p.rx, p.ry, p.rz);
            dummy.scale.set(p.scale, p.scale, p.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[petalGeom, null, PETAL_COUNT]}>
            <meshLambertMaterial
                color="#FF69B4" // Vibrant pink base
                emissive="#FFB6C1" // Soft light pink glow
                emissiveIntensity={0.6} // High glow so shadows are barely visible
                side={THREE.DoubleSide}
            />
        </instancedMesh>
    );
};

/* ============================================================
   Global Mouse Tracker Hook
   ============================================================ */
const useMouseTracker = () => {
    const ref = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        const onMove = (e) => {
            // Map mouse to normalized device coordinates [-1, 1]
            ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            ref.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        
        // Listen globally
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);
    
    return ref;
};

/* ============================================================
   Scene Root (Full-screen background)
   ============================================================ */
const GlobalPetalsScene = () => {
    const mouse = useMouseTracker();
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Bright ambient light to keep things light and airy */}
                <ambientLight intensity={0.8} color="#ffffff" />
                
                {/* Main directional light (pure white) */}
                <directionalLight position={[4, 6, 3]} intensity={1.5} color="#ffffff" />
                
                {/* Soft pink accent lights instead of harsh deep pinks */}
                <pointLight position={[-4, -2, 2]} intensity={0.6} color="#FFC0CB" />
                <pointLight position={[0, 4, -2]} intensity={0.5} color="#ffffff" />

                <Petals mouse={mouse} />
            </Canvas>
        </div>
    );
};

export default GlobalPetalsScene;
