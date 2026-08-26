import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLngToVector3 } from './geoUtils';
import * as THREE from 'three';

// Shared static geometries created ONCE in GPU memory
const SHARED_SPHERE_GEOM = new THREE.SphereGeometry(0.08, 16, 16);
const SHARED_RING_GEOM = new THREE.RingGeometry(0.12, 0.25, 32);
const SHARED_BEAM_GEOM = new THREE.CylinderGeometry(0.015, 0.04, 0.6, 12);

function AnimatedBeaconPin({ destination, isActive, onClick, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const lat = destination?.latitude ?? destination?.lat ?? 17.5;
  const lng = destination?.longitude ?? destination?.lng ?? 78.5;

  const position = useMemo(() => latLngToVector3(lat, lng, 0.25), [lat, lng]);
  
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();

  useFrame((state, delta) => {
    if (!reducedMotion) {
      const t = state.clock.getElapsedTime();

      // Floating vertical bobbing animation for 3D gemstone sphere
      if (meshRef.current) {
        meshRef.current.position.y = Math.sin(t * 3.0) * 0.05 + 0.45;
        meshRef.current.rotation.y += delta * 1.2;

        const targetScale = isActive ? 1.6 : hovered ? 1.3 : 1.0;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      }

      // Ground beacon pulse ring expansion & rotation
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 2.0;
        const scale = 1 + Math.sin(t * 4.0) * 0.25;
        ringRef.current.scale.set(scale, scale, scale);
      }

      // Pulsing vertical laser beam height & opacity
      if (beamRef.current) {
        beamRef.current.position.y = 0.22;
      }
    }
  });

  const crystalColor = '#ff8c42';
  const emissiveColor = '#ff6b35';

  return (
    <group 
      ref={groupRef}
      position={position} 
      onClick={(e) => { e.stopPropagation(); if (onClick) onClick(destination); }} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      {/* ── Vertical Glowing Laser Beacon Beam ── */}
      <mesh ref={beamRef} geometry={SHARED_BEAM_GEOM}>
        <meshStandardMaterial
          color="#ff8c42"
          emissive="#ff6b35"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ── 3D Glowing Gemstone Sphere Pin ── */}
      <mesh ref={meshRef} geometry={SHARED_SPHERE_GEOM} position={[0, 0.45, 0]}>
        <meshStandardMaterial
          color={crystalColor}
          emissive={emissiveColor}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* ── Ground Beacon Ring ── */}
      <mesh ref={ringRef} geometry={SHARED_RING_GEOM} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Point Light Source for Dynamic Glow ── */}
      <pointLight
        position={[0, 0.45, 0]}
        color="#ff8c42"
        intensity={2.0}
        distance={3.0}
      />

      {/* ── Interactive 3D Glassmorphism Popup Badge ── */}
      <Html center position={[0, 0.75, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '11px',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 140, 66, 0.6)',
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.5), 0 8px 20px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '13px' }}>📍</span>
            <span>{destination.destination || destination.name}</span>
            {destination.district && (
              <span style={{ fontSize: '9px', background: 'rgba(255,107,53,0.2)', color: '#ff8c42', padding: '2px 6px', borderRadius: '999px', textTransform: 'uppercase' }}>
                {destination.district}
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}

export function Markers({ destinations, activeDestination, hoveredState, selectedState, onSelect, reducedMotion }) {
  if (!Array.isArray(destinations) || destinations.length === 0) return null;

  // Find active or selected place
  const activePlace = activeDestination || (destinations.length === 1 ? destinations[0] : null);

  // If no active place is selected, do NOT render cluttered yellow dots!
  if (!activePlace) return null;

  return (
    <group>
      <AnimatedBeaconPin
        key={activePlace.id || activePlace.destination || activePlace.slug}
        destination={activePlace}
        isActive={true}
        onClick={onSelect}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}
