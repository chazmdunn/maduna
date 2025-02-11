// Bubble.tsx
import React, { useRef, useEffect } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Bubble: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(Math.random() * 0.005, Math.random() * 0.005, 0));
  const scale = useRef(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      scale.current = Math.min(width, height) / 500; 
      if (sphereRef.current) {
        sphereRef.current.scale.set(scale.current, scale.current, scale.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set scale

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame(() => {
    if (sphereRef.current) {
      const position = sphereRef.current.position;
      position.add(velocity.current);
      if (position.x > 1 || position.x < -1) velocity.current.x = -velocity.current.x;
      if (position.y > 1 || position.y < -1) velocity.current.y = -velocity.current.y;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 32, 32]}>
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
};

export default Bubble;



// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import Bubble from './Responsive';
// const Bubbles: React.FC = () => {
//   return (
//     <Canvas
//       style={{ width: '100%', height: '100vh' }}
//       camera={{ position: [0, 0, 5] }}
//       onCreated={({ gl }) => {
//         gl.setPixelRatio(window.devicePixelRatio);
//         gl.setSize(window.innerWidth, window.innerHeight);
//       }}
//     >
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Bubble />
//     </Canvas>
//   );
// };

// export default Bubbles;
