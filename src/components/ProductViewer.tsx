
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

// The main ProductViewer component
export default function ProductViewer() {
  // Preload the 3D model outside of the Canvas
  useEffect(() => {
    useGLTF.preload('/shoe.glb');
    return () => {
      useGLTF.clear('/shoe.glb');
    };
  }, []);
  
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          camera={{ position: [0, 0, 4], fov: 50 }}
        >
          {/* Everything that uses Three.js hooks MUST be inside Canvas */}
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

// SceneContent component - This contains all components that need Canvas context
// This approach ensures all Three.js hooks are used within Canvas context
function SceneContent() {
  return (
    <>
      {/* Simple lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Load and display the 3D model */}
      <Model url="/shoe.glb" />
      
      {/* Add camera controls */}
      <CanvasControls />
    </>
  );
}

// Model component - MUST be used within Canvas via SceneContent
function Model({ url }: { url: string }) {
  // useGLTF is a Three.js hook that MUST be used within Canvas
  const { scene } = useGLTF(url);
  
  // Apply some default treatments to the model
  useEffect(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);
  
  // Position the model slightly below center for better composition
  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />;
}

// Controls component - MUST be used within Canvas via SceneContent
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
