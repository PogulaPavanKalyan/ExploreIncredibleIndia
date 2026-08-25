import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { latLngToVector3 } from './geoUtils';
import * as THREE from 'three';

export function RouteLine({ destinations, isCinematic, reducedMotion }) {
  const curve = useMemo(() => {
    if (!Array.isArray(destinations) || destinations.length < 2) return null;
    
    // Build 3D points with elevated parabolic arc heights
    const points = destinations.map((d, index) => {
      const pos = latLngToVector3(d.latitude, d.longitude, 0.2);
      // Give middle waypoints higher parabolic arc elevation
      const arcBonus = Math.sin((index / (destinations.length - 1)) * Math.PI) * 0.8;
      return new THREE.Vector3(pos[0], pos[1] + arcBonus, pos[2]);
    });
    
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, [destinations]);

  const progressRef = useRef(0);
  const movingPointRef = useRef();
  
  useFrame((state, delta) => {
    if (isCinematic && !reducedMotion && curve && movingPointRef.current) {
      progressRef.current = (state.clock.elapsedTime * 0.1) % 1;
      const point = curve.getPoint(progressRef.current);
      movingPointRef.current.position.copy(point);
    }
  });

  if (!curve || !isCinematic) return null;

  const points = curve.getPoints(100);

  return (
    <group>
      {/* Flight trajectory dashed curve */}
      <Line
        points={points}
        color="#38bdf8"
        lineWidth={3.0}
        transparent
        opacity={0.8}
        dashed={true}
        dashSize={0.5}
        dashScale={1.5}
      />

      {/* Secondary glowing ambient trail */}
      <Line
        points={points}
        color="#fbbf24"
        lineWidth={6}
        transparent
        opacity={0.25}
      />
      
      {/* Traveling Energy Orb Light */}
      {!reducedMotion && (
        <group ref={movingPointRef}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight color="#38bdf8" intensity={4} distance={4} />
        </group>
      )}
    </group>
  );
}
