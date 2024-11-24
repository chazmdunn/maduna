import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import {  useFrame } from '@react-three/fiber';
import { Float, Text, Image } from '@react-three/drei';
import { RigidBody, BallCollider } from '@react-three/rapier';
import { easing } from 'maath';

interface SphereProps {
    image: string;
    scale: number;
    text: string;
    vec?: THREE.Vector3;
    [key: string]: any;
}

const Sphere: React.FC<SphereProps> = ({ image, scale, text, vec = new THREE.Vector3(), ...props }) => {
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
            // console.log(
            //     `%cHit horizontal edge!`,
            //     'color: red; font-weight: bold;',
            //     `Position: ${translation.x}, Velocity: ${currentVelocity.x}`
            // );
            api.current.setLinvel(new THREE.Vector3(bounceX * Math.abs(currentVelocity.x), currentVelocity.y, 0));
        }

        // Check vertical bounds (Y-axis)
        if (translation.y + radius >= viewport.height / 2 || translation.y - radius <= -viewport.height / 2) {
            const bounceY = translation.y > 0 ? -1 : 1; // Determine bounce direction
            // console.log(
            //     `%cHit vertical edge!`,
            //     'color: blue; font-weight: bold;',
            //     `Position: ${translation.y}, Velocity: ${currentVelocity.y}`
            // );
            api.current.setLinvel(new THREE.Vector3(currentVelocity.x, bounceY * Math.abs(currentVelocity.y), 0));
        }

        // Keep applying drag toward the center when not dragging
        if (!dragging) {
            api.current.applyImpulse(
                vec.copy(api.current.translation()).negate().multiplyScalar(scale * 0.1)
            );
        }

        // Smoothly update position for dragging
        easing.damp3(
            position,
            [
                (state.pointer.x * viewport.width) / 2 - (dragging instanceof THREE.Vector3 ? dragging.x : 0),
                (state.pointer.y * viewport.height) / 2 - (dragging instanceof THREE.Vector3 ? dragging.y : 0),
                0,
            ],
            0.2,
            delta
        );

        // Apply the calculated position to the rigid body
        api.current?.setNextKinematicTranslation(position);
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
                    <circleGeometry args={[1, 64]} />
                    <meshBasicMaterial {...props} />
                    {text && (
                        <Text
                            font="Inter-Regular.woff"
                            letterSpacing={-0.05}
                            position={[0, 0, 0.01]}
                            fontSize={0.425}
                            material-toneMapped={false}
                        >
                            {text}
                        </Text>
                    )}
                </mesh>
                <mesh scale={0.95} position={[0, 0, 0.01]}>
                    <ringGeometry args={[0.9, 1, 64]} />
                    <meshBasicMaterial color={dragging ? 'orange' : 'black'} />
                </mesh>
                <Image position={[0, 0.45, 0.01]} scale={0.5} transparent toneMapped={false} url={image} />
            </Float>
        </RigidBody>
    );
};

export default Sphere;