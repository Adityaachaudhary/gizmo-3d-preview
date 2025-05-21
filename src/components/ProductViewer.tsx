
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

// The main ProductViewer component
export default function ProductViewer() {
  // We can safely preload models outside the Canvas
  useEffect(() => {
    // Preload the model
    useGLTF.preload('/shoe.glb');
    
    return () => {
      // Cleanup preloaded models
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
          {/* All Three.js components and hooks MUST be inside Canvas */}
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
      
      {/* Model with error handling */}
      <Suspense fallback={<FallbackBox />}>
        <ModelWithErrorBoundary url="/shoe.glb" />
      </Suspense>
      
      {/* Camera controls */}
      <CanvasControls />
    </>
  );
}

// Simple fallback box when model fails to load
function FallbackBox() {
  return (
    <mesh position={[0, -0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0xff69b4} /> {/* Using numeric color format for TypeScript compatibility */}
    </mesh>
  );
}

// Model component with error boundary - MUST be used within Canvas
function ModelWithErrorBoundary({ url }: { url: string }) {
  try {
    return <Model url={url} />;
  } catch (error) {
    console.error("Error loading model:", error);
    return <FallbackBox />;
  }
}

// Model component - MUST be used within Canvas
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

// Controls component - MUST be used within Canvas
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
