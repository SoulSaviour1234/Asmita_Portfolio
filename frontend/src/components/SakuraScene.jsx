import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Float,
    Environment,
    OrbitControls,
    ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* ============================================================
   Procedural sakura petal shape (heart-tipped, like real cherry blossom)
   ============================================================ */
const buildPetalShape = () => {
    const s = new THREE.Shape();
    // Start at base (stem)
    s.moveTo(0, 0);
    // Right side bulge
    s.bezierCurveTo(0.55, 0.15, 0.6, 0.85, 0.35, 1.05);
    // Right shoulder up to notch
    s.quadraticCurveTo(0.18, 1.18, 0.08, 1.0);
    // Center V-notch dip (signature sakura tip)
    s.lineTo(0, 0.86);
    s.lineTo(-0.08, 1.0);
    // Left shoulder mirror
    s.quadraticCurveTo(-0.18, 1.18, -0.35, 1.05);
    // Left side bulge back to base
    s.bezierCurveTo(-0.6, 0.85, -0.55, 0.15, 0, 0);
    return s;
};

const EXTRUDE_OPTS = {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 4,
    curveSegments: 24,
};

/* ============================================================
   A single 5-petal blossom (memoized petal geometry shared by petals)
   ============================================================ */
const Blossom = ({
    scale = 1,
    petalColor = "#FFD9E6",
    emissive = "#FF7EB3",
    cupAmount = 0.28,
}) => {
    const petalGeom = useMemo(() => {
        const shape = buildPetalShape();
        const g = new THREE.ExtrudeGeometry(shape, EXTRUDE_OPTS);
        // Center the petal so it rotates around its base
        g.translate(0, -0.05, 0);
        return g;
    }, []);

    const petalMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(petalColor),
                emissive: new THREE.Color(emissive),
                emissiveIntensity: 0.35,
                roughness: 0.35,
                metalness: 0.05,
                transparent: true,
                opacity: 0.96,
                side: THREE.DoubleSide,
            }),
        [petalColor, emissive],
    );

    const pistilGeom = useMemo(
        () => new THREE.SphereGeometry(0.14, 32, 32),
        [],
    );
    const pistilMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: new THREE.Color("#FFC857"),
                emissive: new THREE.Color("#FF8A4C"),
                emissiveIntensity: 0.8,
                roughness: 0.3,
                metalness: 0.4,
            }),
        [],
    );

    // Pollen specks around pistil (in XY plane, slightly forward in Z)
    const pollen = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2;
            const r = 0.18 + Math.random() * 0.06;
            arr.push({
                pos: [Math.cos(a) * r, Math.sin(a) * r, 0.12],
                s: 0.025 + Math.random() * 0.015,
            });
        }
        return arr;
    }, []);

    return (
        <group scale={scale}>
            {/* 5 petals radial around Z, slightly tilted back to form a cup that
               opens toward the camera (+Z). */}
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2;
                return (
                    <group key={i} rotation={[0, 0, angle]}>
                        <mesh
                            geometry={petalGeom}
                            material={petalMat}
                            rotation={[-cupAmount, 0, 0]}
                            castShadow
                            receiveShadow
                        />
                    </group>
                );
            })}

            {/* Center pistil — pushed slightly forward toward camera */}
            <mesh geometry={pistilGeom} material={pistilMat} position={[0, 0, 0.08]} />

            {/* Pollen specks */}
            {pollen.map((p, i) => (
                <mesh key={`p${i}`} position={p.pos}>
                    <sphereGeometry args={[p.s, 12, 12]} />
                    <meshStandardMaterial
                        color={"#FFE08A"}
                        emissive={"#FFB347"}
                        emissiveIntensity={1}
                    />
                </mesh>
            ))}
        </group>
    );
};

/* ============================================================
   Main rotating blossom cluster — one big bloom + floating buds + drifting petals
   ============================================================ */
const Cluster = ({ mouse }) => {
    const groupRef = useRef();

    useFrame((state, dt) => {
        if (!groupRef.current) return;
        // Gentle wobble + slow spin (so the flower is mostly facing camera)
        groupRef.current.rotation.y =
            Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
        groupRef.current.rotation.z =
            Math.sin(state.clock.elapsedTime * 0.18) * 0.08;

        // Subtle parallax to mouse
        const mx = (mouse.current?.x ?? 0) * 0.25;
        const my = (mouse.current?.y ?? 0) * 0.25;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            -my * 0.35,
            0.05,
        );
        groupRef.current.position.x = THREE.MathUtils.lerp(
            groupRef.current.position.x,
            mx * 0.3,
            0.05,
        );
    });

    // Drifting solo petals around the main flower
    const driftPetals = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
            const r = 1.6 + Math.random() * 0.6;
            arr.push({
                pos: [
                    Math.cos(a) * r,
                    (Math.random() - 0.5) * 1.8,
                    Math.sin(a) * r * 0.6,
                ],
                rot: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                ],
                speed: 1 + Math.random() * 1.2,
                scale: 0.18 + Math.random() * 0.12,
                tint: i % 2 === 0 ? "#FFD9E6" : "#FFC4D9",
            });
        }
        return arr;
    }, []);

    const soloPetalGeom = useMemo(() => {
        const g = new THREE.ExtrudeGeometry(buildPetalShape(), {
            ...EXTRUDE_OPTS,
            depth: 0.025,
            bevelThickness: 0.03,
            bevelSize: 0.025,
        });
        g.translate(0, -0.55, 0);
        return g;
    }, []);

    return (
        <group ref={groupRef} scale={0.72}>
            {/* Main blossom front-center */}
            <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
                <Blossom scale={1.0} />
            </Float>

            {/* Secondary smaller blossom — slightly behind & offset */}
            <Float speed={1.0} rotationIntensity={0.3} floatIntensity={0.7}>
                <group position={[1.4, 0.7, -0.6]} rotation={[0.3, -0.5, 0.2]}>
                    <Blossom
                        scale={0.55}
                        petalColor={"#FFE3EE"}
                        emissive={"#FF7EB3"}
                    />
                </group>
            </Float>

            {/* Bud — smaller sakura on the other side */}
            <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.6}>
                <group position={[-1.45, -0.55, -0.3]} rotation={[-0.4, 0.6, 0.1]}>
                    <Blossom
                        scale={0.42}
                        petalColor={"#FFCBDD"}
                        emissive={"#FF4785"}
                        cupAmount={0.55}
                    />
                </group>
            </Float>

            {/* Drifting solo petals */}
            {driftPetals.map((p, i) => (
                <Float
                    key={i}
                    speed={p.speed}
                    rotationIntensity={1.6}
                    floatIntensity={1.4}
                >
                    <mesh
                        position={p.pos}
                        rotation={p.rot}
                        scale={p.scale}
                        geometry={soloPetalGeom}
                    >
                        <meshStandardMaterial
                            color={p.tint}
                            emissive={"#FF7EB3"}
                            emissiveIntensity={0.4}
                            roughness={0.4}
                            side={THREE.DoubleSide}
                            transparent
                            opacity={0.95}
                        />
                    </mesh>
                </Float>
            ))}

            {/* Soft inner glow orb behind the main blossom */}
            <mesh position={[0, 0.1, -0.4]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshBasicMaterial
                    color={new THREE.Color("#FF7EB3")}
                    transparent
                    opacity={0.18}
                />
            </mesh>
        </group>
    );
};

/* ============================================================
   Mouse-tracker (kept outside R3F to feed parallax into Cluster)
   ============================================================ */
const useMouseTracker = () => {
    const ref = useRef({ x: 0, y: 0 });
    const onMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        ref.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ref.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    return { ref, onMove };
};

/* ============================================================
   Scene root
   ============================================================ */
const SakuraScene = () => {
    const mouse = useMouseTracker();
    return (
        <div
            className="absolute inset-0"
            onMouseMove={mouse.onMove}
            data-testid="hero-3d-wrapper"
        >
            <Canvas
                data-testid="hero-3d-canvas"
                dpr={[1, 2]}
                camera={{ position: [0, 0.2, 4.4], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Soft sakura-tinted lighting rig */}
                <ambientLight intensity={0.55} />
                <directionalLight
                    position={[4, 6, 4]}
                    intensity={1.3}
                    color={"#FFE3EE"}
                    castShadow
                />
                <directionalLight
                    position={[-5, -2, -3]}
                    intensity={0.7}
                    color={"#FFB997"}
                />
                <pointLight
                    position={[0, 0, 2.5]}
                    intensity={1.6}
                    color={"#FF4785"}
                    distance={7}
                />
                <pointLight
                    position={[-2, 2, -1]}
                    intensity={0.8}
                    color={"#FFD9E6"}
                    distance={5}
                />

                <Suspense fallback={null}>
                    <Cluster mouse={mouse.ref} />

                    <Environment preset="sunset" />
                    <ContactShadows
                        position={[0, -1.7, 0]}
                        opacity={0.35}
                        scale={6}
                        blur={3}
                        far={3}
                        color="#FF4785"
                    />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    enableRotate
                    rotateSpeed={0.3}
                    minPolarAngle={Math.PI / 2.4}
                    maxPolarAngle={Math.PI / 1.75}
                    minAzimuthAngle={-Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 6}
                />
            </Canvas>
        </div>
    );
};

export default SakuraScene;
