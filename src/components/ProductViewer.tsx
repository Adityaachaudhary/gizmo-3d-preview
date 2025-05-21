
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

// Main ProductViewer component
export default function ProductViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Preload the model outside the Canvas
  useEffect(() => {
    useGLTF.preload('/shoe.glb');
  }, []);
  
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas ref={canvasRef} shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <Stage preset="rembrandt" intensity={0.6} shadows>
            <ModelContent url="/shoe.glb" />
          </Stage>
          <SceneController />
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

// IMPORTANT: This component must be used within Canvas
// This is a valid placement because it's rendered inside the Canvas in the parent component
function ModelContent({ url }: { url: string }) {
  // useGLTF is a hook from drei and must be used within Canvas context
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

// IMPORTANT: This component must be used within Canvas
// This is a valid placement because it's rendered inside the Canvas in the parent component
function SceneController() {
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
