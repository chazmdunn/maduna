import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Image } from '@react-three/drei';
import { Physics, RigidBody, BallCollider } from '@react-three/rapier';
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
        const viewport = state.viewport;
        const translation = api.current.translation(); // Get the current position of the bubble
    
        // Apply boundary checks and bounce on X-axis
        if (Math.abs(translation.x) >= viewport.width / 2) {
            const bounceDirection = translation.x > 0 ? -1 : 1;
            api.current.applyImpulse(new THREE.Vector3(bounceDirection * scale * 10, 0, 0));
        }
    
        // Apply boundary checks and bounce on Y-axis
        if (Math.abs(translation.y) >= viewport.height / 2) {
            const bounceDirection = translation.y > 0 ? -1 : 1;
            api.current.applyImpulse(new THREE.Vector3(0, bounceDirection * scale * 10, 0));
        }
    
        // Your original impulse logic for movement towards the center (dragging or general behavior)
        if (!dragging) {
            api.current.applyImpulse(
                vec.copy(api.current.translation()).negate().multiplyScalar(scale * 0.1)
            );
        }
    
        // Existing easing and position update logic (to smoothly update the position)
        easing.damp3(
            position,
            [
                (state.pointer.x * state.viewport.width) / 2 - (dragging instanceof THREE.Vector3 ? dragging.x : 0),
                (state.pointer.y * state.viewport.height) / 2 - (dragging instanceof THREE.Vector3 ? dragging.y : 0),
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

const data = [
    { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
];

const Bubbles: React.FC = () => {
    return (
        <Canvas orthographic 
        camera={{ position: [0, 0, 100], zoom: 30 }}
        style={{ width: '100vw', height: '100vh' }}
        >
            <Physics /*debug*/ interpolate timeStep={1 / 60} gravity={[0, 0, 0]}>
                {data.map((props, i) => (
                    <Sphere key={i} {...props} />
                ))}
            </Physics>
        </Canvas>
    );
};

export default Bubbles;
