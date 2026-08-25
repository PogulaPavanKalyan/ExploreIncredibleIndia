import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLngToVector3 } from './geoUtils';
import * as THREE from 'three';

// Shared static geometries created ONCE in GPU memory for all 50+ place markers!
const SHARED_SPHERE_GEOM = new THREE.SphereGeometry(0.06, 12, 12);
const SHARED_RING_GEOM = new THREE.RingGeometry(0.10, 0.18, 24);

function FloatingPinComponent({ destination, isActive, isStateHovered, onClick, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const lat = destination?.latitude ?? destination?.lat ?? 22.5;
  const lng = destination?.longitude ?? destination?.lng ?? 82.5;

  // Elevate marker height when state is elevated
  const yHeight = isStateHovered || isActive ? 0.50 : 0.22;
  const position = useMemo(() => latLngToVector3(lat, lng, yHeight), [lat, lng, yHeight]);
  
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (!reducedMotion) {
      const t = state.clock.getElapsedTime();

      // Floating vertical bobbing physics for sleek 3D gemstone sphere
      if (meshRef.current) {
        const numLat = parseFloat(lat) || 0;
        meshRef.current.position.y = Math.sin(t * 2.5 + numLat) * 0.04 + 0.25;

        const targetScale = isActive ? 1.4 : hovered ? 1.2 : 1.0;
        if (Math.abs(meshRef.current.scale.x - targetScale) > 0.01) {
          meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.16);
        }
      }

      // Ground beacon pulse ring - only rotates when active/hovered
      if (ringRef.current && (isActive || hovered)) {
        ringRef.current.rotation.z += delta * 1.5;
        const scale = 1 + Math.sin(t * 3.5) * 0.2;
        ringRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  const crystalColor = isActive ? '#ffffff' : (hovered || isStateHovered ? '#fbbf24' : '#38bdf8');
  const emissiveColor = isActive ? '#3b82f6' : (hovered || isStateHovered ? '#f59e0b' : '#0284c7');

  return (
    <group 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      {/* ── Sleek 3D Glowing Gemstone Sphere Pin (Using Shared Geometry) ── */}
      <mesh ref={meshRef} geometry={SHARED_SPHERE_GEOM} position={[0, 0.25, 0]}>
        <meshStandardMaterial
          color={crystalColor}
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 0.9 : (hovered || isStateHovered ? 0.7 : 0.45)}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* ── Active / Hovered Scaled Ground Beacon Ring ── */}
      {(isActive || hovered) && (
        <mesh ref={ringRef} geometry={SHARED_RING_GEOM} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color={isActive ? '#3b82f6' : '#fbbf24'}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── Glowing Center Light Point (Rendered only on active/hovered pin for high performance) ── */}
      {(isActive || hovered) && (
        <pointLight
          position={[0, 0.25, 0]}
          color={crystalColor}
          intensity={isActive ? 1.2 : 0.8}
          distance={2.0}
        />
      )}

      {/* ── Ultra-Compact Fixed-Size Glassmorphism Nameplate ── */}
      {(isActive || hovered) && (
        <Html center position={[0, 0.45, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            <div style={{
              background: isActive 
                ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' 
                : 'rgba(15, 23, 42, 0.92)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '10px',
              letterSpacing: '0.03em',
              padding: '3px 8px',
              borderRadius: '10px',
              border: isActive ? '1px solid #93c5fd' : '1px solid rgba(56,189,248,0.5)',
              boxShadow: isActive ? '0 0 12px rgba(59,130,246,0.6)' : '0 2px 8px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transform: 'scale(0.85)',
            }}>
              📍 {destination.destination}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

const FloatingPin = React.memo(FloatingPinComponent);

export function Markers({ destinations, activeDestination, hoveredState, selectedState, onSelect, reducedMotion }) {
  if (!Array.isArray(destinations)) return null;

  const targetState = hoveredState || selectedState;
  const activeStateName = targetState ? (targetState.name || '').toLowerCase() : '';

  return (
    <group>
      {destinations.map((dest) => {
        const destStateName = (dest.state || '').toLowerCase();
        
        // Match state name or region
        const isMatch = targetState ? (
          destStateName.includes(activeStateName) || 
          activeStateName.includes(destStateName) ||
          (dest.region || '').toLowerCase() === (targetState.region || '').toLowerCase()
        ) : false;

        // CRITICAL: When a state is hovered or selected, HIDE places from other states!
        if (targetState && !isMatch) {
          return null; // Hides place marker from non-hovered states completely!
        }

        const isActive = activeDestination && (
          activeDestination.id === dest.id || 
          activeDestination.destination === dest.destination
        );

        return (
          <FloatingPin
            key={dest.id || dest.destination}
            destination={dest}
            isActive={isActive}
            isStateHovered={isMatch}
            onClick={() => onSelect(dest)}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </group>
  );
}
