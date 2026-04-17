'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';

interface ThreeCanvasProps {
  children: React.ReactNode;
}

const ThreeCanvas = ({ children }: ThreeCanvasProps) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', background: 'transparent' }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {children}
          </Float>
          <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.25} far={10} color="#10b981" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
