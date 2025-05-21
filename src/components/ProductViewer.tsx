
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

// Main ProductViewer component
export default function ProductViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Preload the model outside the Canvas - this is safe to do
  useEffect(() => {
    // Preload the model - this doesn't require Canvas context
    useGLTF.preload('/shoe.glb');
    
    return () => {
      // Cleanup preloaded models if needed
      useGLTF.clear('/shoe.glb');
    };
  }, []);
  
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas ref={canvasRef} shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          {/* All Three.js components and hooks must be used within Canvas */}
          <Stage preset="rembrandt" intensity={0.6} shadows>
            {/* Model component is defined inside Canvas context */}
            <Model url="/shoe.glb" />
          </Stage>
          {/* Controls component is defined inside Canvas context */}
          <CanvasControls />
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

// Model component - MUST be used within Canvas
function Model({ url }: { url: string }) {
  // useGLTF hook is only used within the Canvas component's render tree
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

// Controls component - MUST be used within Canvas
function CanvasControls() {
  // Define a proper type for the ref
  const controlsRef = useRef<typeof OrbitControls>(null);
  
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
