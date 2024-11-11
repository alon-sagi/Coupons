/* GiftModel */
import { useState, useEffect } from 'react';
import './styles.css';
import { Canvas } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useGLTF, PresentationControls, Environment, Stage } from '@react-three/drei';

// ---
export default function GiftModel() {
  const [mousePosition, setMousePosition] = useState([0, 0]);

  // ---
  const { rotation } = useSpring({
    rotation: [
      mousePosition[1] * Math.PI * 0.3,
      mousePosition[0] * Math.PI * 0.3,
      0,
    ],
    config: { 
      mass: 2,
      tension: 120,
      friction: 40,
      precision: 0.001,
    },
  });
  
  // ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition([mouseX * 0.3, mouseY * 0.3]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ---
  return (
    <div className="model-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <PresentationControls
          global
          snap
          speed={1}
          zoom={1}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Environment preset="studio" />
          <Stage environment={null} intensity={1}>
            <a.primitive 
              object={useGLTF('/gift.glb').scene} 
              rotation={rotation}
              scale={0.1}
            />
          </Stage>
        </PresentationControls>
      </Canvas>
    </div>
  );
}