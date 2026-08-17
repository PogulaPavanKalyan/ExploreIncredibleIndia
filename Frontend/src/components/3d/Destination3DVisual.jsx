import React, { useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Cone, Torus, Cylinder, Box, Icosahedron } from '@react-three/drei';
import WebGLFallback from './WebGLFallback';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("Destination 3D Visual fallback:", error);
  }

  render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }
    return this.props.children;
  }
}

function CategoryMesh({ modelType, themeColor }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const mainColor = themeColor || '#FF6B35';

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {modelType === 'mountain' && (
          <group>
            <Cone args={[1.5, 2.4, 4]} rotation={[0, Math.PI / 4, 0]}>
              <meshStandardMaterial color={mainColor} roughness={0.3} metalness={0.6} />
            </Cone>
            <Cone args={[1, 1.6, 4]} position={[1.2, -0.4, -0.5]} rotation={[0, Math.PI / 4, 0]}>
              <meshStandardMaterial color="#0284C7" roughness={0.4} />
            </Cone>
          </group>
        )}

        {modelType === 'wave' && (
          <group>
            <Torus args={[1.4, 0.35, 16, 64]} rotation={[Math.PI / 3, 0, 0]}>
              <meshStandardMaterial color={mainColor} roughness={0.1} metalness={0.9} />
            </Torus>
            <Torus args={[0.9, 0.2, 16, 32]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
              <meshStandardMaterial color="#F59E0B" roughness={0.2} />
            </Torus>
          </group>
        )}

        {modelType === 'temple' && (
          <group>
            <Cylinder args={[0.8, 1.2, 2.2, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={mainColor} roughness={0.3} metalness={0.7} />
            </Cylinder>
            <Box args={[1.8, 0.3, 1.8]} position={[0, -1.2, 0]}>
              <meshStandardMaterial color="#B45309" roughness={0.5} />
            </Box>
          </group>
        )}

        {modelType === 'fort' && (
          <group>
            <Box args={[1.6, 1.8, 1.6]} position={[0, 0, 0]}>
              <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.4} />
            </Box>
            <Cylinder args={[0.5, 0.5, 2.2, 12]} position={[0.9, 0.2, 0.9]}>
              <meshStandardMaterial color="#D97706" roughness={0.5} />
            </Cylinder>
          </group>
        )}

        {modelType === 'wildlife' && (
          <group>
            <Icosahedron args={[1.4, 1]}>
              <meshStandardMaterial color={mainColor} roughness={0.4} metalness={0.3} wireframe />
            </Icosahedron>
          </group>
        )}

        {(modelType === 'compass' || !modelType) && (
          <group>
            <Torus args={[1.2, 0.15, 16, 64]}>
              <meshStandardMaterial color={mainColor} roughness={0.2} metalness={0.8} />
            </Torus>
          </group>
        )}
      </group>
    </Float>
  );
}

export default function Destination3DVisual({ modelType, themeColor }) {
  return (
    <CanvasErrorBoundary>
      <div style={{ width: '100%', height: '280px', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.6} color={themeColor || '#FF6B35'} />

          <CategoryMesh modelType={modelType} themeColor={themeColor} />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
