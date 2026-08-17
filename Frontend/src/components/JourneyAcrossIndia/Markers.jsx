import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLngToVector3 } from './geoUtils';
import * as THREE from 'three';

function Marker({ destination, isActive, onClick, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector3(destination.latitude, destination.longitude, 0);
  
  const meshRef = useRef();
  const ringRef = useRef();
  
  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (isActive && ringRef.current) {
        ringRef.current.rotation.x += delta;
        ringRef.current.rotation.y += delta * 0.5;
        // Pulse scale
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        ringRef.current.scale.set(scale, scale, scale);
      }
      if (meshRef.current) {
        const targetScale = isActive || hovered ? 1.5 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    }
  });

  const color = isActive ? "#ffffff" : "#cda87c";

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Marker core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Active Glowing Ring */}
      {isActive && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.3, 0.05, 8, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Label */}
      <Html distanceFactor={15} center position={[0, 0.5, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
          fontWeight: isActive ? '700' : '400',
          fontSize: '14px',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          opacity: isActive || hovered ? 1 : 0
        }}>
          {destination.destination}
        </div>
      </Html>
    </group>
  );
}

export function Markers({ destinations, activeDestination, onSelect, reducedMotion }) {
  if (!destinations) return null;
  return (
    <group>
      {Array.isArray(destinations) && destinations.map((dest) => (
        <Marker
          key={dest.id}
          destination={dest}
          isActive={activeDestination && activeDestination.id === dest.id}
          onClick={() => onSelect(dest)}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}
