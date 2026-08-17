import React, { useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import WebGLFallback from './WebGLFallback';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn("3D WebGL Canvas failed to render, falling back to CSS background:", error);
  }

  render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }
    return this.props.children;
  }
}

function GlobeMesh() {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.1;
      wireframeRef.current.rotation.x += delta * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.4, 2.45, 64]} />
        <meshBasicMaterial color="#FF6B35" side={2} transparent opacity={0.4} />
      </mesh>

      {/* Main Globe Sphere with subtle distortion */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <Sphere ref={meshRef} args={[1.8, 64, 64]}>
          <MeshDistortMaterial
            color="#004E64"
            attach="material"
            distort={0.15}
            speed={1.2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={0.5}
          />
        </Sphere>

        {/* Wireframe Grid Overlay for Geographic Globe look */}
        <Sphere ref={wireframeRef} args={[1.82, 24, 24]}>
          <meshStandardMaterial
            color="#FF6B35"
            wireframe
            transparent
            opacity={0.25}
          />
        </Sphere>
      </Float>

      {/* Ambient particles surrounding globe */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 2.8 + (i % 3) * 0.2;
        const x = Math.cos(angle) * radius;
        const y = (i % 5 - 2) * 0.5;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#FF6B35" : "#38BDF8"} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function TravelGlobe() {
  return (
    <CanvasErrorBoundary>
      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF6B35" />
          
          <GlobeMesh />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}

