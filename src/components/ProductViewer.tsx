
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';
import * as THREE from 'three';

// The main ProductViewer component
export default function ProductViewer() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          camera={{ position: [0, 0, 4], fov: 50 }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.dispatchEvent(new CustomEvent('reset-camera'))}
            className="rounded-full"
          >
            Reset View
          </Button>
        </div>
      </div>
    </div>
  );
}

// SceneContent component contains everything that needs Canvas context
function SceneContent() {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Using a dummy product instead of loading external model */}
      <DummyProduct />
      
      {/* Camera controls */}
      <CanvasControls />
    </>
  );
}

// DummyProduct component as a replacement for the external model
function DummyProduct() {
  // THREE.Group3D doesn't exist, but THREE.Group does
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    // Simple animation for the group
    const interval = setInterval(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.01;
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body - shoe sole */}
      <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#9b87f5" />
      </mesh>
      
      {/* Shoe upper front */}
      <mesh position={[0.4, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 0.9]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Shoe heel */}
      <mesh position={[-0.7, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.9]} />
        <meshStandardMaterial color="#1A1F2C" />
      </mesh>
      
      {/* Shoe laces */}
      <mesh position={[0.4, -0.0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.7]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      
      {/* Shoe logo */}
      <mesh position={[-0.7, -0.3, 0.46]} castShadow>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#9b87f5" />
      </mesh>
    </group>
  );
}

// Controls component - used within Canvas via SceneContent
function CanvasControls() {
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    const handleResetCamera = () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    };
    
    window.addEventListener('reset-camera', handleResetCamera);
    
    return () => {
      window.removeEventListener('reset-camera', handleResetCamera);
    };
  }, []);
  
  return (
    <OrbitControls 
      ref={controlsRef}
      autoRotate 
      autoRotateSpeed={0.5}
      enablePan={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.5}
      makeDefault
    />
  );
}
