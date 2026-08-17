import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

function FloatingMarker({ region }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating and rotation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshBasicMaterial color="#cda87c" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      <Html center position={[0, 1, 0]}>
        <div style={{
          color: '#ffffff',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '12px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {region.name}
        </div>
      </Html>
    </group>
  );
}

export default function Region3DMarker({ region, mousePos }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const layerStyle = { 
    transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` 
  };

  return (
    <div className="region-3d-marker-layer" style={layerStyle}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <FloatingMarker region={region} />
      </Canvas>
    </div>
  );
}
