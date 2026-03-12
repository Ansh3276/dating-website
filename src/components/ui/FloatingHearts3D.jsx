import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Heart Geometry
const HeartGeometry = () => {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const x = 0, y = 0;
        s.moveTo(x + 5, y + 5);
        s.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        s.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        s.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        s.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        s.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        s.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
        return s;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.5,
        bevelThickness: 0.5
    }), []);

    return <extrudeGeometry args={[shape, extrudeSettings]} />;
};

// Single floating heart mesh
const HeartMesh = ({ position, scale, rotationSpeed }) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        // Endless gentle rotation
        const d = Math.min(delta, 0.1); // Cap delta to avoid jumps
        meshRef.current.rotation.x += rotationSpeed.x * d;
        meshRef.current.rotation.y += rotationSpeed.y * d;
        meshRef.current.rotation.z += rotationSpeed.z * d;

        // Upward floating logic (resetting at the top)
        meshRef.current.position.y += 0.8 * d;
        if (meshRef.current.position.y > 15) {
             meshRef.current.position.y = -15;
             meshRef.current.position.x = (Math.random() - 0.5) * 30;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <HeartGeometry />
                <meshPhongMaterial 
                    color="#FF4081" 
                    emissive="#9C27B0"
                    shininess={100}
                    transparent={true}
                    opacity={0.8}
                />
            </mesh>
        </Float>
    );
};

// Scene containing multiple scattered hearts
const Scene = () => {
    const hearts = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            position: [
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 10
            ],
            scale: Array(3).fill(Math.random() * 0.04 + 0.03),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.4,
                y: (Math.random() - 0.5) * 0.4,
                z: (Math.random() - 0.5) * 0.4,
            }
        }));
    }, []);

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFDBE9" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#E91E63" />
            
            {hearts.map((props) => (
                <HeartMesh key={props.id} {...props} />
            ))}
        </>
    );
};

const FloatingHearts3D = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 45 }}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <Scene />
            </Canvas>
        </div>
    );
};

export default FloatingHearts3D;
