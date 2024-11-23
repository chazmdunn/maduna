import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const BouncingBubble: React.FC = () => {
  const bubbleRef = useRef<THREE.Mesh>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Track window dimensions
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize(); // Initialize
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Animation logic
  const BubbleAnimation: React.FC = () => {
    const bubbleVelocity = useRef({ x: 0.01, y: 0.01 });
    const bubbleRadius = 0.5; // Radius of the sphere (matches `sphereGeometry` args)

    // Get the camera and viewport info from Three.js
    const { viewport } = useThree();

    useFrame(() => {
      if (!bubbleRef.current) return;

      const bubble = bubbleRef.current;
      const velocity = bubbleVelocity.current;

      // Get visible screen boundaries in world space
      const boundaryX = viewport.width / 2;
      const boundaryY = viewport.height / 2;

      // Update bubble position
      bubble.position.x += velocity.x;
      bubble.position.y += velocity.y;

      // Check for collisions with screen edges and reverse direction
      if (
        bubble.position.x + bubbleRadius > boundaryX || // Right edge
        bubble.position.x - bubbleRadius < -boundaryX // Left edge
      ) {
        velocity.x = -velocity.x;
      }
      if (
        bubble.position.y + bubbleRadius > boundaryY || // Top edge
        bubble.position.y - bubbleRadius < -boundaryY // Bottom edge
      ) {
        velocity.y = -velocity.y;
      }
    });

    return null;
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={bubbleRef}>
        <sphereGeometry args={[0.5, 32, 32]} /> {/* Bubble radius is 0.5 */}
        <meshStandardMaterial color="skyblue" />
      </mesh>
      <BubbleAnimation />
    </Canvas>
  );
};

export default BouncingBubble;
