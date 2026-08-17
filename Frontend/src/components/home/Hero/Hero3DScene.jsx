import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

function DestinationMarker({ position = [0, 0, 0], title, stateName }) {
  const markerRef = useRef();
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (markerRef.current) {
      markerRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group ref={markerRef}>
          {/* Glowing core sphere */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={2} roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Location Pin Outer Shell */}
          <mesh position={[0, 0.7, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.25, 0.6, 32]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} metalness={1} />
          </mesh>
          
        </group>
      </Float>
      
      {/* Subtle floating rings on the ground */}
      <group position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.6, 0.65, 64]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={innerRingRef}>
          <ringGeometry args={[0.4, 0.42, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function Hero3DScene({ currentDestination }) {
  if (!currentDestination) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ResponsiveMarker currentDestination={currentDestination} />
      </Canvas>
    </div>
  );
}

function ResponsiveMarker({ currentDestination }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile, position it lower so it fits on screen, perhaps behind the text but visible.
  // [x, y, z]
  const position = isMobile ? [0, -2.5, -2] : [3.5, 0, -2];

  return (
    <DestinationMarker 
      title={currentDestination.title} 
      stateName={currentDestination.state_name || currentDestination.state?.name || ''} 
      position={position} 
    />
  );
}
