import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { extractGeoJsonLines, extractGeoJsonShapes, extractStateFeatures } from './geoUtils';
import { StateMesh } from './StateMesh';

export function Map3D({ 
  mapData, 
  hoveredState, 
  onHoverState, 
  selectedState, 
  onSelectState, 
  reducedMotion 
}) {
  const groupRef = useRef();

  // Extract structured state features once on mapData change
  const stateFeatures = useMemo(() => {
    if (!mapData) return [];
    return extractStateFeatures(mapData);
  }, [mapData]);

  // Fallback single wireframe lines & shapes if mapData is single Feature
  const fallbackLines = useMemo(() => {
    if (!mapData || stateFeatures.length > 0) return [];
    return extractGeoJsonLines(mapData, 0.08);
  }, [mapData, stateFeatures]);

  const fallbackShapes = useMemo(() => {
    if (!mapData || stateFeatures.length > 0) return [];
    return extractGeoJsonShapes(mapData);
  }, [mapData, stateFeatures]);

  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  }), []);

  // Map group remains rock-solid stationary at [0, 0, 0] without downward drift

  return (
    <group ref={groupRef}>
      {/* ── Render Individual 3D Interactive States with Upward Hover Elevation ── */}
      {stateFeatures.length > 0 && (
        <group>
          {stateFeatures.map((stateItem, idx) => {
            const isHovered = !!hoveredState && (
              hoveredState.id === stateItem.id || 
              (hoveredState.name && stateItem.name && hoveredState.name.toLowerCase() === stateItem.name.toLowerCase()) ||
              (hoveredState.rawName && stateItem.rawName && hoveredState.rawName.toLowerCase() === stateItem.rawName.toLowerCase())
            );
            const isSelected = !!selectedState && (
              selectedState.id === stateItem.id || 
              (selectedState.name && stateItem.name && selectedState.name.toLowerCase() === stateItem.name.toLowerCase()) ||
              (selectedState.rawName && stateItem.rawName && selectedState.rawName.toLowerCase() === stateItem.rawName.toLowerCase())
            );

            return (
              <StateMesh
                key={stateItem.id || `state-${idx}`}
                stateFeature={stateItem}
                isHovered={isHovered}
                isSelected={isSelected}
                isAnyStateHovered={!!hoveredState}
                onHoverState={onHoverState}
                onSelectState={onSelectState}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </group>
      )}

      {/* ── Fallback rendering if single polygon boundary ── */}
      {stateFeatures.length === 0 && (
        <group>
          {fallbackShapes.map((shape, idx) => (
            <mesh key={`fallback-shape-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.5} emissive="#0f172a" emissiveIntensity={0.3} />
            </mesh>
          ))}
          {fallbackLines.map((points, idx) => (
            <Line key={`fallback-line-${idx}`} points={points} color="#d97706" lineWidth={2} transparent opacity={0.8} />
          ))}
        </group>
      )}

      {/* ── Dynamic Coordinate Grid Floor ── */}
      <gridHelper
        args={[45, 45, '#d97706', '#1e293b']}
        position={[0, -0.25, 0]}
      />

      {/* ── Dark Ambient Base Backdrop ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#030712" transparent opacity={0.96} />
      </mesh>

      {/* ── Light Sparkles Particle Pass (Optimized count: 30) ── */}
      {!reducedMotion && (
        <Sparkles
          count={30}
          scale={[30, 5, 30]}
          size={1.8}
          speed={0.2}
          opacity={0.35}
          color="#f59e0b"
          position={[0, 0.7, 0]}
        />
      )}
    </group>
  );
}
