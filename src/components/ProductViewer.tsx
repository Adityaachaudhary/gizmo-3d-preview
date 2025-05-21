
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

export default function ProductViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas ref={canvasRef} shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <Stage environment="city" intensity={0.6} shadows>
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

// This component handles the 3D model loading
function ModelContent({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

// This component handles the controls and is safely within the Canvas context
function SceneController() {
  // The ref must be created within this component that is inside the Canvas
  const controlsRef = useRef(null);
  
  // Use effect to setup event listener for the reset camera button
  React.useEffect(() => {
    // Preload the model
    useGLTF.preload('/shoe.glb');
    
    // Create event listener for reset camera event
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
