import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3, extractDistrictFeatures } from './geoUtils';
import { StateMesh } from './StateMesh';
import { Markers } from './Markers';

function DistrictCameraAnimator({ activePlace, controlsRef }) {
  useFrame((state) => {
    if (!activePlace) return;

    const lat = activePlace.latitude ?? activePlace.lat;
    const lng = activePlace.longitude ?? activePlace.lng;
    if (lat == null || lng == null) return;

    const pos = latLngToVector3(lat, lng, 0.4);
    if (isNaN(pos[0]) || isNaN(pos[2])) return;

    const desiredCamPos = new THREE.Vector3(pos[0] * 0.95, 2.8, pos[2] + 3.2);
    const desiredTarget = new THREE.Vector3(pos[0], 0.3, pos[2]);

    if (state.camera.position.distanceTo(desiredCamPos) > 0.005) {
      state.camera.position.lerp(desiredCamPos, 0.08);
    }

    if (controlsRef.current && controlsRef.current.target) {
      controlsRef.current.target.lerp(desiredTarget, 0.08);
      controlsRef.current.update();
    }
  });

  return null;
}

export function StateDistrictMap3D({ stateFeature, places, activePlace, onSelectPlace }) {
  const controlsRef = useRef();
  const [districtGeoJson, setDistrictGeoJson] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Fetch district-level GeoJSON dataset to display district borders on state selection
  useEffect(() => {
    fetch('/india_districts.json')
      .then(res => res.json())
      .then(data => setDistrictGeoJson(data))
      .catch(err => console.error("Error loading india_districts.json:", err));
  }, []);

  // Extract district features for the selected state
  const districtFeatures = useMemo(() => {
    if (!districtGeoJson || !stateFeature) return [];
    return extractDistrictFeatures(districtGeoJson, stateFeature.name);
  }, [districtGeoJson, stateFeature]);

  // Position camera focused over the center of the selected state
  const centerPos = stateFeature ? stateFeature.centerPos : [0, 0, 0];
  const initialCamPos = useMemo(() => {
    if (!centerPos) return [0, 6, 8];
    return [centerPos[0] * 0.8, 5.2, centerPos[2] + 5.5];
  }, [centerPos]);

  return (
    <div className="state-district-map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: initialCamPos, fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* ── Illumination & Sun Lighting ── */}
        <ambientLight intensity={1.3} />
        <directionalLight position={[10, 20, 15]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-10, 15, -10]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[centerPos[0], 4, centerPos[2]]} intensity={1.5} color="#fbbf24" distance={15} />

        {/* ── Render District Meshes & Golden District Border Lines for Selected State ── */}
        {districtFeatures.length > 0 ? (
          <group>
            {districtFeatures.map((distItem, idx) => {
              const isHovered = hoveredDistrict && (hoveredDistrict.id === distItem.id || hoveredDistrict.name === distItem.name);
              return (
                <StateMesh
                  key={distItem.id || `dist-${idx}`}
                  stateFeature={distItem}
                  isHovered={isHovered}
                  isSelected={isHovered}
                  isAnyStateHovered={!!hoveredDistrict}
                  onHoverState={setHoveredDistrict}
                  onSelectState={() => {}}
                  reducedMotion={false}
                />
              );
            })}
          </group>
        ) : (
          /* Fallback state mesh while district features load */
          stateFeature && (
            <StateMesh
              stateFeature={stateFeature}
              isHovered={false}
              isSelected={false}
              isAnyStateHovered={false}
              onHoverState={() => {}}
              onSelectState={() => {}}
              reducedMotion={false}
            />
          )
        )}

        {/* ── 3D Place Pin Gem Markers ── */}
        <Markers
          destinations={places}
          activeDestination={activePlace}
          hoveredState={stateFeature}
          selectedState={stateFeature}
          onSelect={(place) => onSelectPlace(place)}
          reducedMotion={false}
        />

        {/* ── Smooth Camera Animator ── */}
        <DistrictCameraAnimator activePlace={activePlace} controlsRef={controlsRef} />

        {/* ── Grid Floor & Dark Environment ── */}
        <gridHelper args={[35, 35, '#d97706', '#1e293b']} position={[0, -0.25, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#030712" transparent opacity={0.96} />
        </mesh>

        {/* ── Interactive Orbit Controls ── */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={2.5}
          maxDistance={14.0}
          target={[centerPos[0], 0.2, centerPos[2]]}
        />
      </Canvas>

      {/* Map Helper Controls Badge */}
      <div className="map-controls-badge">
        <span>💡 Orbit 3D view with drag • Hover over districts • Scroll to zoom</span>
      </div>
    </div>
  );
}
