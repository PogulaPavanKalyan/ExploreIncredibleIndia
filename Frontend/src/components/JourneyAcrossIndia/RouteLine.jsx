import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { latLngToVector3 } from './geoUtils';
import * as THREE from 'three';

export function RouteLine({ destinations, activeIndex, isCinematic, reducedMotion }) {
  const curve = useMemo(() => {
    if (!Array.isArray(destinations) || destinations.length < 2) return null;
    
    // Create points with an arc in Y
    const points = destinations.map(d => {
      const pos = latLngToVector3(d.latitude, d.longitude, 0);
      return new THREE.Vector3(...pos);
    });
    
    // For a simple straight-ish line between points
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, [destinations]);

  const progressRef = useRef(0);
  const movingPointRef = useRef();
  
  useFrame((state, delta) => {
    if (isCinematic && !reducedMotion && curve && movingPointRef.current) {
      // Progress from 0 to 1 over time
      progressRef.current = (state.clock.elapsedTime * 0.1) % 1;
      const point = curve.getPoint(progressRef.current);
      movingPointRef.current.position.copy(point);
    }
  });

  if (!curve || !isCinematic) return null;

  const points = curve.getPoints(50);
  
  // We only show the route line in cinematic mode
  return (
    <group>
      <Line
        points={points}
        color="#cda87c"
        lineWidth={2}
        transparent
        opacity={0.3}
        dashed={true}
        dashSize={0.5}
        dashScale={1}
        dashOffset={0}
      />
      
      {/* Moving Point */}
      {!reducedMotion && (
        <mesh ref={movingPointRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#ffffff" intensity={2} distance={2} />
        </mesh>
      )}
    </group>
  );
}
