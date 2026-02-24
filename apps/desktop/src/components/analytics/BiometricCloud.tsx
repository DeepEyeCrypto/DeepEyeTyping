import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuralNormalizer } from 'core';
import { useTypingStore } from 'core';

export const BiometricCloud = () => {
    const { keystrokes } = useTypingStore();
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, colors } = useMemo(() => {
        const spatialData = NeuralNormalizer.normalize(keystrokes);
        return NeuralNormalizer.toAttributeArrays(spatialData);
    }, [keystrokes]);

    // Constant rotation for atmospheric effect
    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.001;
            pointsRef.current.rotation.z += 0.0005;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                {/* @ts-expect-error Ignore three element types */}
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                {/* @ts-expect-error Ignore three element types */}
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};
