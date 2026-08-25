import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function StateMeshComponent({ 
  stateFeature, 
  isHovered, 
  isSelected, 
  isAnyStateHovered, 
  onHoverState, 
  onSelectState, 
  reducedMotion 
}) {
  const groupRef = useRef();

  const { id, name, shapes, borderLines, centerPos } = stateFeature;

  // Memoized ExtrudeGeometries for all shapes in this state feature (creates geometries once in GPU memory)
  const extrudeGeometries = useMemo(() => {
    const settings = {
      depth: 0.15,
      bevelEnabled: false,
      steps: 1,
    };
    return shapes.map(s => new THREE.ExtrudeGeometry(s, settings));
  }, [shapes]);

  // Memoized ShapeGeometries for top surface highlights
  const shapeGeometries = useMemo(() => {
    return shapes.map(s => new THREE.ShapeGeometry(s));
  }, [shapes]);

  // Memoized native THREE LineGeometries for fast WebGL border line rendering
  const lineGeometries = useMemo(() => {
    return borderLines.map(points => {
      const vec3Points = points.map(pt => new THREE.Vector3(pt[0], pt[1], pt[2]));
      return new THREE.BufferGeometry().setFromPoints(vec3Points);
    });
  }, [borderLines]);

  // Idle-bypassing Lerp for Upward Elevation when Cursor hovers over state
  useFrame(() => {
    if (!groupRef.current || reducedMotion) return;

    let targetY = 0;
    if (isSelected) {
      targetY = 0.45; // Elevates highest when selected
    } else if (isHovered) {
      targetY = 0.40; // Elevates UPWARDS smoothly when cursor is over the state!
    } else if (isAnyStateHovered) {
      targetY = -0.06; // Slightly dips non-hovered states for depth of field
    }

    const currentY = groupRef.current.position.y;
    // Ultra-fast idle exit: If already at target position, stop lerping immediately
    if (currentY === targetY) return;

    if (Math.abs(currentY - targetY) < 0.0005) {
      groupRef.current.position.y = targetY;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(currentY, targetY, 0.22);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (onHoverState) onHoverState(stateFeature);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    if (onHoverState) onHoverState(null);
    document.body.style.cursor = 'auto';
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (onHoverState && !isHovered) {
      onHoverState(stateFeature);
      document.body.style.cursor = 'pointer';
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelectState) onSelectState(stateFeature);
  };

  // Vibrant, well-lit slate-navy land colors
  const landColor = isSelected ? '#1e3a8a' : (isHovered ? '#1e293b' : '#273549');
  const emissiveColor = isSelected ? '#3b82f6' : (isHovered ? '#f59e0b' : '#1e293b');
  const emissiveIntensity = isSelected ? 0.7 : (isHovered ? 0.6 : (isAnyStateHovered ? 0.2 : 0.45));
  const lineColor = isSelected ? '#60a5fa' : (isHovered ? '#fbbf24' : '#f59e0b');
  const opacity = isAnyStateHovered && !isHovered && !isSelected ? 0.45 : 0.98;

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* ── 3D Extruded State Land Geometry (Using Memoized Geometries) ── */}
      {extrudeGeometries.map((geom, idx) => (
        <group key={`shape-${id}-${idx}`}>
          <mesh
            geometry={geom}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.07, 0]}
            onPointerOver={handlePointerOver}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <meshStandardMaterial
              color={landColor}
              roughness={0.2}
              metalness={0.6}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              transparent={isAnyStateHovered && !isHovered && !isSelected}
              opacity={opacity}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Top Surface Shader Layer */}
          {shapeGeometries[idx] && (
            <mesh
              geometry={shapeGeometries[idx]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.131, 0]}
              onPointerOver={handlePointerOver}
              onPointerMove={handlePointerMove}
              onPointerOut={handlePointerOut}
              onClick={handleClick}
            >
              <meshBasicMaterial
                color={isSelected ? '#93c5fd' : (isHovered ? '#fef3c7' : '#475569')}
                transparent
                opacity={isSelected ? 0.5 : (isHovered ? 0.4 : 0.2)}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* ── High-Performance Native WebGL Line Segments (raycast={null} prevents border lines from blocking cursor) ── */}
      {lineGeometries.map((lineGeom, idx) => (
        <lineSegments key={`border-${id}-${idx}`} geometry={lineGeom} raycast={() => null}>
          <lineBasicMaterial
            color={lineColor}
            linewidth={2}
            transparent
            opacity={isHovered || isSelected ? 0.98 : (isAnyStateHovered ? 0.4 : 0.9)}
          />
        </lineSegments>
      ))}

      {/* ── Floating 3D State Name Badge on Hover or Selection ── */}
      {(isHovered || isSelected) && centerPos && (
        <Html position={[centerPos[0], centerPos[1] + 0.35, centerPos[2]]} center style={{ pointerEvents: 'none' }}>
          <div className={`state-hover-badge ${isSelected ? 'selected' : ''}`}>
            <span className="badge-icon">📍</span>
            <span className="badge-text">{name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// React.memo custom comparator ensures StateMesh re-renders reliably when hover/selection state updates
export const StateMesh = React.memo(StateMeshComponent, (prevProps, nextProps) => {
  return (
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isAnyStateHovered === nextProps.isAnyStateHovered &&
    prevProps.stateFeature.id === nextProps.stateFeature.id
  );
});
