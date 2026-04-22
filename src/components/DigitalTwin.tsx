'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { MeshDistortMaterial, MeshWobbleMaterial, Edges } from '@react-three/drei';
import ThreeCanvas from './ThreeCanvas';

interface DigitalTwinProps {
  id: string;
  health: number;
}

const AssetModel = ({ health }: Pick<DigitalTwinProps, 'health'>) => {
  const meshRef = useRef<Mesh | null>(null);
  const healthColor = health > 90 ? '#10b981' : health > 70 ? '#f59e0b' : '#ef4444';
  const wobbleSpeed = Math.max((100 - health) / 20, 1);
  const wobbleFactor = Math.max((100 - health) / 100, 0.1);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      {/* Main Core Mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.5, 2, 1.5]}>
        <boxGeometry />
        <MeshWobbleMaterial 
          color={healthColor} 
          speed={wobbleSpeed} 
          factor={wobbleFactor}
          opacity={0.3}
          transparent
        />
        <Edges color={healthColor} threshold={15} />
      </mesh>

      {/* Intelligence Pulse */}
      <mesh position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial 
          color={healthColor} 
          speed={2} 
          distort={0.4} 
          radius={1}
          opacity={0.1}
          transparent
        />
      </mesh>
      
      {/* Internal Core */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color={healthColor} emissive={healthColor} emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const DigitalTwin = ({ id, health }: DigitalTwinProps) => {
  const healthColor = health > 90 ? '#10b981' : health > 70 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      width: '100%',
      height: '350px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--card-border)',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 80%)'
    }}>
      {/* Canvas Layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ThreeCanvas>
          <AssetModel health={health} />
        </ThreeCanvas>
      </div>

      {/* Overlay Information */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', textAlign: 'left', pointerEvents: 'none' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Vynta Digital Stream</p>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: healthColor }}>STATUS: {health}%</h4>
      </div>

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', textAlign: 'right', pointerEvents: 'none' }}>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>ID: {id}</p>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>INTELLIGENCE: ACTIVE</p>
      </div>
    </div>
  );
};

export default DigitalTwin;
