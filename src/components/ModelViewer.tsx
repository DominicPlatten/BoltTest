import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Center, 
  Html,
  useProgress,
  Environment,
  PerspectiveCamera
} from '@react-three/drei';
import { Loader, RotateCcw, PauseCircle, Camera } from 'lucide-react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelFile?: File | null;
  variantFile?: File;
  hideControls?: boolean;
  onThumbnailCapture?: (dataUrl: string) => void;
  showThumbnailButton?: boolean;
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-2 text-white">
        <Loader className="w-8 h-8 animate-spin" />
        <p className="text-sm">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

function Model({ url, isVariant = false }: { url: string; isVariant?: boolean }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  
  useEffect(() => {
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Scale model to fit in a 2x2x2 box
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);
    
    // Center model at origin
    scene.position.sub(center.multiplyScalar(scale));
    
    if (!isVariant) {
      // Position camera to fit model in view
      const distance = Math.max(size.x, size.y) * 1.5; // Add padding
      camera.position.set(distance, distance * 0.8, distance);
      camera.lookAt(0, 0, 0);
    }
  }, [scene, camera, isVariant]);
  
  return <primitive object={scene} />;
}

const environments = [
  { name: 'sunset', label: 'Sunset' },
  { name: 'dawn', label: 'Dawn' },
  { name: 'night', label: 'Night' },
  { name: 'warehouse', label: 'Warehouse' },
  { name: 'forest', label: 'Forest' },
  { name: 'apartment', label: 'Apartment' },
  { name: 'studio', label: 'Studio' },
  { name: 'city', label: 'City' },
  { name: 'park', label: 'Park' }
];

export function ModelViewer({ 
  modelFile, 
  variantFile,
  hideControls,
  onThumbnailCapture,
  showThumbnailButton
}: ModelViewerProps) {
  const [autoRotate, setAutoRotate] = useState(!hideControls);
  const [modelObjectUrl, setModelObjectUrl] = useState<string | null>(null);
  const [variantObjectUrl, setVariantObjectUrl] = useState<string | null>(null);
  const [selectedEnv, setSelectedEnv] = useState('sunset');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (modelFile) {
      const url = URL.createObjectURL(modelFile);
      setModelObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [modelFile]);

  useEffect(() => {
    if (variantFile) {
      const url = URL.createObjectURL(variantFile);
      setVariantObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVariantObjectUrl(null);
    }
  }, [variantFile]);

  const handleThumbnailCapture = async () => {
    if (!canvasRef.current || !onThumbnailCapture) return;
    
    // Capture square thumbnail
    const canvas = canvasRef.current;
    const size = Math.min(canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d')!;
    
    // Draw with transparent background
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(
      canvas,
      (canvas.width - size) / 2,
      (canvas.height - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );
    
    onThumbnailCapture(tempCanvas.toDataURL('image/png'));
  };

  if (!modelObjectUrl) return null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="w-full aspect-square bg-transparent rounded-xl overflow-hidden">
          <Canvas
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true, alpha: true }}
            camera={{ fov: 45 }}
          >
            <color attach="background" args={[0, 0, 0, 0]} />
            <Suspense fallback={<LoadingScreen />}>
              <Environment preset={selectedEnv as any} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Center>
                <Model url={modelObjectUrl} />
                {variantObjectUrl && (
                  <Model url={variantObjectUrl} isVariant />
                )}
              </Center>
              <OrbitControls
                enableDamping
                dampingFactor={0.05}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
                minDistance={2}
                maxDistance={20}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 6}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          {showThumbnailButton && (
            <button
              onClick={handleThumbnailCapture}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              title="Take thumbnail"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          )}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
            title={autoRotate ? "Stop rotation" : "Start rotation"}
          >
            {autoRotate ? (
              <PauseCircle className="w-5 h-5 text-white" />
            ) : (
              <RotateCcw className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {showThumbnailButton && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment
          </label>
          <div className="grid grid-cols-3 gap-2">
            {environments.map(env => (
              <button
                key={env.name}
                onClick={() => setSelectedEnv(env.name)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedEnv === env.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}