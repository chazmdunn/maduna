import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Image } from '@react-three/drei';
import { RigidBody, BallCollider } from '@react-three/rapier';
import { easing } from 'maath';

interface SphereProps {
    logo: string;
    scale: number;
    name: string;
    priceChange: number;
    vec?: THREE.Vector3;
    [key: string]: any;
}

const Sphere: React.FC<SphereProps> = ({ logo, scale, name, priceChange, vec = new THREE.Vector3(), ...props }) => {
    const api = useRef<any>(null);
    const [initialPos] = useState<[number, number, number]>([
        THREE.MathUtils.randFloatSpread(30),
        THREE.MathUtils.randFloatSpread(30),
        0,
    ]);
    const [position] = useState(new THREE.Vector3());
    const [dragging, setDragging] = useState<THREE.Vector3 | boolean>(false);

    useFrame((state, delta) => {
        const viewport = state.viewport; // Get viewport dimensions
        const translation = api.current.translation(); // Current bubble position
        const currentVelocity = api.current.linvel(); // Get current velocity
        const radius = scale / 2; // Bubble radius (half of its scale)
      
        // Check horizontal bounds (X-axis)
        if (translation.x + radius >= viewport.width / 2 || translation.x - radius <= -viewport.width / 2) {
          const bounceX = translation.x > 0 ? -1 : 1; // Determine bounce direction
          api.current.setLinvel(new THREE.Vector3(bounceX * Math.abs(currentVelocity.x), currentVelocity.y, 0));
        }
      
        // Check vertical bounds (Y-axis)
        if (translation.y + radius >= viewport.height / 2 || translation.y - radius <= -viewport.height / 2) {
          const bounceY = translation.y > 0 ? -1 : 1; // Determine bounce direction
          api.current.setLinvel(new THREE.Vector3(currentVelocity.x, bounceY * Math.abs(currentVelocity.y), 0));
        }
      
        // Apply a random wandering effect when not dragging
        if (!dragging) {
          const randomImpulse = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02, // Small random movement on X
            (Math.random() - 0.5) * 0.02, // Small random movement on Y
            0 // No movement on Z
          );
          api.current.applyImpulse(randomImpulse);
        }
      });
    

    return (
        <RigidBody
            ref={api}
            type={dragging ? 'kinematicPosition' : 'dynamic'}
            enabledRotations={[false, false, true]}
            enabledTranslations={[true, true, false]}
            linearDamping={4}
            angularDamping={1}
            friction={0.1}
            position={initialPos}
            scale={scale}
            colliders={false}
        >
            <BallCollider args={[1.1]} />
            <Float speed={2}>
                <mesh
                    onPointerDown={(e) => {
                        (e.target as HTMLElement).setPointerCapture(e.pointerId);
                        setDragging(new THREE.Vector3().copy(e.point).sub(api.current.translation()));
                    }}
                    onPointerUp={(e) => {
                        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                        setDragging(false);
                    }}
                >
                    {/* Circular Bubble */}
                    <circleGeometry args={[1, 64]} />
                    <meshBasicMaterial color="#38BDF8" {...props} />

                    {/* Logo */}
                    <Image
                        position={[0, 0.6, 0.02]}
                        scale={0.4}
                        transparent
                        toneMapped={false}
                        url={logo}
                    />

                    {/* Name */}
                    {name && (
                        <Text
                            font="Inter-Regular.woff"
                            letterSpacing={-0.05}
                            position={[0, 0.2, 0.03]}
                            fontSize={0.25}
                            color="#F3F4F6"
                            anchorX="center"
                            anchorY="middle"
                            material-toneMapped={false}
                        >
                            {name}
                        </Text>
                    )}

                    {/* Price Change */}
                    <Text
                        font="Inter-Regular.woff"
                        color={priceChange >= 0 ? '#22C55E' : '#EF4444'} // Bright green for positive, soft red for negative
                        position={[0, -0.3, 0.03]}
                        fontSize={0.4}
                        anchorX="center"
                        anchorY="middle"
                        material-toneMapped={false}
                    >
                        {priceChange.toFixed(2)}%
                    </Text>
                </mesh>

                {/* Outer Ring */}
                <mesh scale={1.05} position={[0, 0, 0.01]}>
                    <ringGeometry args={[0.95, 1, 64]} />
                    <meshBasicMaterial
                        color={dragging ? '#F97316' : '#14B8A6'} // Orange when dragging, teal otherwise
                    />
                </mesh>
            </Float>
        </RigidBody>
    );
};

export default Sphere;
