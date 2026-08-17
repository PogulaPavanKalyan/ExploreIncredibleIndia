import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sparkles } from '@react-three/drei';
import { extractGeoJsonLines } from './geoUtils';

export function Map3D({ mapData, reducedMotion }) {
  const lines = useMemo(() => {
    if (!mapData) return [];
    return extractGeoJsonLines(mapData, 0);
  }, [mapData]);

  const groupRef = React.useRef();

  useFrame((state) => {
    if (!reducedMotion && groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle gentle floating — less than before
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.12 - 0.3;
    }
  });

  if (lines.length === 0) return null;

  return (
    <group ref={groupRef}>
      {/* India map outline — primary bright lines */}
      {lines.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color="#cda87c"
          lineWidth={1.8}
          transparent
          opacity={0.75}
        />
      ))}

      {/* Secondary glow pass — slightly thicker, lower opacity */}
      {lines.map((points, idx) => (
        <Line
          key={`g${idx}`}
          points={points}
          color="#cda87c"
          lineWidth={4}
          transparent
          opacity={0.08}
        />
      ))}

      {/* Dark backdrop plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#050508" transparent opacity={0.85} />
      </mesh>

      {/* Atmospheric sparkles */}
      {!reducedMotion && (
        <Sparkles
          count={80}
          scale={[22, 3, 22]}
          size={1.5}
          speed={0.15}
          opacity={0.25}
          color="#cda87c"
          position={[0, 0.5, 0]}
        />
      )}
    </group>
  );
}
