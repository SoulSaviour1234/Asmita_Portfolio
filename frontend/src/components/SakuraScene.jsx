import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Float,
    MeshTransmissionMaterial,
    Environment,
    OrbitControls,
    ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* Rotating sakura crystal — icosahedron with frosted glass material */
const Crystal = () => {
    const ref = useRef();
    useFrame((state, dt) => {
        if (!ref.current) return;
        ref.current.rotation.y += dt * 0.18;
        ref.current.rotation.x += dt * 0.06;
    });

    return (
        <group ref={ref}>
            <mesh>
                <icosahedronGeometry args={[1.35, 1]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={0.4}
                    samples={6}
                    resolution={512}
                    transmission={1}
                    roughness={0.18}
                    thickness={0.6}
                    ior={1.35}
                    chromaticAberration={0.08}
                    anisotropy={0.4}
                    distortion={0.35}
                    distortionScale={0.35}
                    temporalDistortion={0.1}
                    clearcoat={1}
                    attenuationDistance={1.4}
                    attenuationColor={"#FF7EB3"}
                    color={"#FFD9E6"}
                />
            </mesh>

            {/* Inner glowing orb to amplify the luminous look */}
            <mesh scale={0.55}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshBasicMaterial
                    color={new THREE.Color("#FF4785")}
                    transparent
                    opacity={0.55}
                />
            </mesh>
        </group>
    );
};

/* Floating petal sparkles around the crystal */
const Petals = () => {
    const positions = [
        [1.8, 0.6, 0.4],
        [-1.7, 1.1, -0.5],
        [1.2, -1.4, 0.6],
        [-1.5, -0.9, 0.2],
        [0.4, 1.8, -0.7],
        [-0.6, -1.7, -0.3],
    ];
    return (
        <>
            {positions.map((p, i) => (
                <Float
                    key={i}
                    speed={1.6 + (i % 3) * 0.3}
                    rotationIntensity={1.2}
                    floatIntensity={1.4}
                >
                    <mesh position={p}>
                        <dodecahedronGeometry args={[0.08 + (i % 3) * 0.03]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#FF7EB3" : "#FFB997"}
                            emissive={i % 2 === 0 ? "#FF4785" : "#FF7EB3"}
                            emissiveIntensity={0.6}
                            roughness={0.2}
                            metalness={0.1}
                        />
                    </mesh>
                </Float>
            ))}
        </>
    );
};

const SakuraScene = () => {
    return (
        <Canvas
            data-testid="hero-3d-canvas"
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 38 }}
            gl={{ antialias: true, alpha: true }}
        >
            <color attach="background" args={["transparent"]} />

            {/* Soft sakura-tinted lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 6, 4]}
                intensity={1.2}
                color={"#FFD9E6"}
            />
            <directionalLight
                position={[-4, -2, -3]}
                intensity={0.8}
                color={"#FFB997"}
            />
            <pointLight
                position={[0, 0, 3]}
                intensity={1.4}
                color={"#FF4785"}
                distance={6}
            />

            <Suspense fallback={null}>
                <Float
                    speed={1.1}
                    rotationIntensity={0.45}
                    floatIntensity={0.9}
                >
                    <Crystal />
                </Float>

                <Petals />

                <Environment preset="sunset" />
                <ContactShadows
                    position={[0, -1.9, 0]}
                    opacity={0.35}
                    scale={6}
                    blur={2.6}
                    far={3}
                    color="#FF4785"
                />
            </Suspense>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.6}
                rotateSpeed={0.4}
                minPolarAngle={Math.PI / 2.6}
                maxPolarAngle={Math.PI / 1.7}
            />
        </Canvas>
    );
};

export default SakuraScene;
