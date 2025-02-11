import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Image } from '@react-three/drei';
import { RigidBody, BallCollider } from '@react-three/rapier';

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
    const [dragging, setDragging] = useState<THREE.Vector3 | boolean>(false);

    useFrame((state, delta) => {
        const viewport = state.viewport;
        const translation = api.current.translation();
        const currentVelocity = api.current.linvel();
        const radius = scale / 2;

        if (translation.x + radius > viewport.width / 2) {
            api.current.setTranslation(new THREE.Vector3(viewport.width / 2 - radius, translation.y, 0));
            api.current.setLinvel(new THREE.Vector3(-Math.abs(currentVelocity.x), currentVelocity.y, 0));
        } else if (translation.x - radius < -viewport.width / 2) {
            api.current.setTranslation(new THREE.Vector3(-viewport.width / 2 + radius, translation.y, 0));
            api.current.setLinvel(new THREE.Vector3(Math.abs(currentVelocity.x), currentVelocity.y, 0));
        }

        if (translation.y + radius > viewport.height / 2) {
            api.current.setTranslation(new THREE.Vector3(translation.x, viewport.height / 2 - radius, 0));
            api.current.setLinvel(new THREE.Vector3(currentVelocity.x, -Math.abs(currentVelocity.y), 0));
        } else if (translation.y - radius < -viewport.height / 2) {
            api.current.setTranslation(new THREE.Vector3(translation.x, -viewport.height / 2 + radius, 0));
            api.current.setLinvel(new THREE.Vector3(currentVelocity.x, Math.abs(currentVelocity.y), 0));
        }

        if (!dragging) {
            const randomImpulse = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                0
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
                    <circleGeometry args={[1, 64]} />
                    <meshBasicMaterial color="#38BDF8" {...props} />
                    <Image position={[0, 0.6, 0.02]} scale={0.4} transparent toneMapped={false} url={logo} />
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
                    <Text
                        font="Inter-Regular.woff"
                        color={priceChange >= 0 ? '#22C55E' : '#EF4444'}
                        position={[0, -0.3, 0.03]}
                        fontSize={0.4}
                        anchorX="center"
                        anchorY="middle"
                        material-toneMapped={false}
                    >
                        {priceChange.toFixed(2)}%
                    </Text>
                </mesh>
                <mesh scale={1.05} position={[0, 0, 0.01]}>
                    <ringGeometry args={[0.95, 1, 64]} />
                    <meshBasicMaterial color={dragging ? '#F97316' : '#14B8A6'} />
                </mesh>
            </Float>
        </RigidBody>
    );
};

export default Sphere;
