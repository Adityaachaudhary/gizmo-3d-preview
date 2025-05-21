
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import LoadingFallback from './LoadingFallback';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

export default function ProductViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle reset camera
  const controlsRef = useRef<any>(null);
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Pre-load the model using useEffect instead of at module level
  useEffect(() => {
    // This is safe because useEffect runs in component context
    useGLTF.preload('/shoe.glb');
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas ref={canvasRef} shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <Stage environment="city" intensity={0.6} shadows>
            <Model url="/shoe.glb" />
          </Stage>
          <OrbitControls 
            ref={controlsRef}
            autoRotate 
            autoRotateSpeed={0.5}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
          />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetCamera} 
            className="rounded-full"
          >
            Reset View
          </Button>
        </div>
      </div>
    </div>
  );
}
