import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sparkles, Line, CameraControls } from '@react-three/drei';
import * as THREE from 'three';

// Approximate Bounding Box for India to map Lat/Long to 3D space
const INDIA_BOUNDS = {
  minLat: 8.0,
  maxLat: 37.5,
  minLon: 68.0,
  maxLon: 97.5
};

const MAP_SIZE = { width: 10, height: 11 };

// Convert Lat/Lon to 3D coordinates on the Plane (XZ plane)
const getCoordinates = (lat, lon) => {
  const x = ((lon - INDIA_BOUNDS.minLon) / (INDIA_BOUNDS.maxLon - INDIA_BOUNDS.minLon) - 0.5) * MAP_SIZE.width;
  const z = -((lat - INDIA_BOUNDS.minLat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat) - 0.5) * MAP_SIZE.height;
  return new THREE.Vector3(x, 0.1, z);
};

// 3D Marker Component
function MapMarker({ destination, isActive, onClick }) {
  const position = useMemo(() => getCoordinates(parseFloat(destination.latitude), parseFloat(destination.longitude)), [destination]);
  const markerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (markerRef.current && isActive) {
      markerRef.current.position.y = 0.1 + Math.sin(t * 3) * 0.1;
    } else if (markerRef.current) {
      markerRef.current.position.y = 0.1;
    }
  });

  return (
    <group position={position} onClick={() => onClick(destination)}>
      <group ref={markerRef}>
        {/* Core Pin */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[isActive ? 0.15 : 0.08, 16, 16]} />
          <meshStandardMaterial color={isActive ? "#FFB703" : "#FF6B35"} emissive={isActive ? "#FFB703" : "#FF6B35"} emissiveIntensity={isActive ? 1 : 0.2} />
        </mesh>

        {/* Glow Ring for active */}
        {isActive && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshBasicMaterial color="#FFB703" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}

        <Html center position={[0, 0.4, 0]} className="map-3d-label" zIndexRange={[100, 0]}>
          <div className={`map-3d-label-inner ${isActive ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => onClick(destination)}>
            {destination.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Scene Controller for Cinematic Journey
function SceneController({ activeDestination, isJourneyMode }) {
  const cameraControlsRef = useRef();

  useEffect(() => {
    if (activeDestination && cameraControlsRef.current) {
      const pos = getCoordinates(parseFloat(activeDestination.latitude), parseFloat(activeDestination.longitude));
      
      if (isJourneyMode) {
        // Cinematic tight view
        cameraControlsRef.current.setLookAt(
          pos.x, 2.5, pos.z + 3, // eye
          pos.x, 0, pos.z,      // target
          true                   // animate
        );
      } else {
        // Relaxed overview
        cameraControlsRef.current.setLookAt(
          0, 8, 8, // eye (centered overview)
          0, 0, 0, // target
          true
        );
      }
    }
  }, [activeDestination, isJourneyMode]);

  return (
    <CameraControls 
      ref={cameraControlsRef} 
      minPolarAngle={Math.PI / 4} 
      maxPolarAngle={Math.PI / 2.5} 
      minDistance={3}
      maxDistance={15}
      makeDefault
    />
  );
}

// Animated Route Line
function JourneyRoute({ destinations, isJourneyMode }) {
  const points = useMemo(() => {
    return destinations.map(d => getCoordinates(parseFloat(d.latitude), parseFloat(d.longitude)));
  }, [destinations]);

  if (!isJourneyMode || points.length < 2) return null;

  return (
    <Line 
      points={points}
      color="#FF6B35"
      lineWidth={2}
      dashed={true}
      dashScale={50}
      dashSize={1}
      dashOffset={0}
      opacity={0.5}
      transparent
    />
  );
}

// The Map Surface (Using SVG Paths from previous implementation, but drawn on a canvas texture)
function MapSurface() {
  const canvasRef = useRef(document.createElement('canvas'));
  const textureRef = useRef(new THREE.CanvasTexture(canvasRef.current));

  useMemo(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Draw abstract dark grid/surface
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for(let i=0; i<1024; i+=64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
    }
    
    textureRef.current.needsUpdate = true;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[MAP_SIZE.width * 1.5, MAP_SIZE.height * 1.5]} />
      <meshStandardMaterial 
        map={textureRef.current} 
        transparent 
        opacity={0.8}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function India3DMap({ destinations, activeDestination, onMarkerClick, isJourneyMode }) {
  return (
    <Canvas camera={{ position: [0, 8, 8], fov: 45 }}>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 5, 20]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#FF6B35" />

      <MapSurface />
      
      {/* Particles for cinematic atmosphere */}
      <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.2} color="#94a3b8" />

      <JourneyRoute destinations={destinations} isJourneyMode={isJourneyMode} />

      {destinations.map(d => (
        <MapMarker 
          key={d.id} 
          destination={d} 
          isActive={activeDestination?.id === d.id} 
          onClick={onMarkerClick}
        />
      ))}

      <SceneController activeDestination={activeDestination} isJourneyMode={isJourneyMode} />
    </Canvas>
  );
}
