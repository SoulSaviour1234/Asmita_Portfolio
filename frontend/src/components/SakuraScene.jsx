import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ============================================================
   Procedural sakura petal shape for the background falling petals
   ============================================================ */
const buildPetalShape = () => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.55, 0.15, 0.6, 0.85, 0.35, 1.05);
    s.quadraticCurveTo(0.18, 1.18, 0.08, 1.0);
    s.lineTo(0, 0.86);
    s.lineTo(-0.08, 1.0);
    s.quadraticCurveTo(-0.18, 1.18, -0.35, 1.05);
    s.bezierCurveTo(-0.6, 0.85, -0.55, 0.15, 0, 0);
    return s;
};

const EXTRUDE_OPTS = {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 24,
};

/* ============================================================
   The central photorealistic image plane
   ============================================================ */
import { useThree } from "@react-three/fiber";

const HeroImageCard = ({ mouse }) => {
    const materialRef = useRef();
    const texture = useTexture("/hero_sakura_card.png");
    const { viewport } = useThree();

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uPlaneSize;

        void main() {
            vec2 uv = vUv;

            // 1. Calculate perfect "object-fit: cover" UVs
            float planeAspect = uPlaneSize.x / uPlaneSize.y;
            float imageAspect = 1.0; // The generated image is a 1:1 square
            
            vec2 ratio = vec2(
                min(planeAspect / imageAspect, 1.0),
                min(imageAspect / planeAspect, 1.0)
            );
            
            // Re-map UVs to crop the image seamlessly
            uv = uv * ratio + (1.0 - ratio) * 0.5;
            
            // 2. Mouse Interaction Ripple
            float distMouse = distance(vUv, uMouse); // Use original un-scaled vUv for mouse tracking
            float mouseWarp = sin(distMouse * 30.0 - uTime * 8.0) * exp(-distMouse * 12.0);
            uv += mouseWarp * 0.015;

            vec4 color = texture2D(uTexture, uv);
            gl_FragColor = color;
        }
    `;

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        // Add a 20% bleed margin to the plane size so rotation doesn't reveal edges
        uPlaneSize: { value: new THREE.Vector2(viewport.width * 1.2, viewport.height * 1.2) }
    }), [texture, viewport.width, viewport.height]);

    useFrame((state) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        
        const uvX = (mouse.current.x * 0.5) + 0.5;
        const uvY = (mouse.current.y * 0.5) + 0.5;
        materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(uvX, uvY), 0.1);
    });

    return (
        <mesh position={[0, 0, 0]}>
            {/* Plane is 20% larger than viewport to hide edges during parallax rotation */}
            <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.2]} />
            <shaderMaterial
                ref={materialRef}
                transparent={true}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

/* ============================================================
   Main scene cluster (Card only)
   ============================================================ */
const Cluster = ({ mouse }) => {
    const groupRef = useRef();
    
    // Subtle parallax response to the mouse
    useFrame(() => {
        if (!groupRef.current) return;
        const mx = (mouse.current?.x ?? 0) * 0.1;
        const my = (mouse.current?.y ?? 0) * 0.1;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.5, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.5, 0.05);
    });

    return (
        <group ref={groupRef}>
            {/* The Custom Photorealistic Shader Card */}
            <HeroImageCard mouse={mouse} />
        </group>
    );
};

/* ============================================================
   Mouse-tracker
   ============================================================ */
const useMouseTracker = () => {
    const ref = useRef({ x: 0, y: 0 });
    const onMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        ref.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ref.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1); 
    };
    return { ref, onMove };
};

/* ============================================================
   Scene root
   ============================================================ */
const SakuraScene = () => {
    const mouse = useMouseTracker();
    return (
        <div className="absolute inset-0" onMouseMove={mouse.onMove} data-testid="hero-3d-wrapper">
            <Canvas
                data-testid="hero-3d-canvas"
                dpr={[1, 2]}
                camera={{ position: [0, 0, 4.5], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting for the 3D Petals */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[4, 6, 4]} intensity={1.5} color={"#FFE3EE"} />
                <pointLight position={[-2, 2, 2]} intensity={0.8} color={"#FFD9E6"} />

                <Suspense fallback={null}>
                    <Cluster mouse={mouse.ref} />
                    <Environment preset="city" />
                </Suspense>

                {/* Disable rotation so the photorealistic card always faces the camera */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    enableRotate={false} 
                />
            </Canvas>
        </div>
    );
};

export default SakuraScene;
