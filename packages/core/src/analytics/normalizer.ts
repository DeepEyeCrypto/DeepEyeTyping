import type { KeyStroke } from '../types';

export interface SpatialKeystroke {
    x: number; // Dwell time mapping (ms)
    y: number; // Flight time mapping (ms)
    z: number; // Sequence progression (index)
    isCorrect: boolean;
    key: string;
}

export class NeuralNormalizer {
    /**
     * Translates raw keystrokes into 3D coordinates.
     * X: Dwell Time (Normalized to 0-1 across a 300ms window)
     * Y: Flight Time (Normalized to 0-1 across a 500ms window)
     * Z: Index (normalized for session depth)
     */
    static normalize(keystrokes: KeyStroke[]): SpatialKeystroke[] {
        return keystrokes.map((ks, i) => {
            const dwellTime = ks.releaseTime ? (ks.releaseTime - ks.pressTime) : 0;

            let flightTime = 0;
            if (i > 0) {
                const prev = keystrokes[i - 1];
                if (prev.releaseTime) {
                    flightTime = ks.pressTime - prev.releaseTime;
                } else {
                    // Fallback for overlapping keys
                    flightTime = ks.pressTime - prev.pressTime;
                }
            }

            // Map to -5 to 5 space for better 3D visualization
            // Higher dwell/flight moves point further from "Flow Center" (0,0)
            return {
                x: Math.min(dwellTime / 300, 1) * 10 - 5,
                y: Math.min(flightTime / 500, 1) * 10 - 5,
                z: (i / Math.max(1, keystrokes.length)) * -50,
                isCorrect: ks.isCorrect,
                key: ks.expected
            };
        });
    }

    /**
     * Converts spatial keystrokes into Float32Arrays for BufferGeometry
     */
    static toAttributeArrays(spatialData: SpatialKeystroke[]) {
        const positions = new Float32Array(spatialData.length * 3);
        const colors = new Float32Array(spatialData.length * 3);

        spatialData.forEach((sd, i) => {
            positions[i * 3] = sd.x;
            positions[i * 3 + 1] = sd.y;
            positions[i * 3 + 2] = sd.z;

            // Cyan for correct, Red for error
            if (sd.isCorrect) {
                colors[i * 3] = 0.0;     // R
                colors[i * 3 + 1] = 1.0; // G
                colors[i * 3 + 2] = 0.95; // B
            } else {
                colors[i * 3] = 0.94; // R
                colors[i * 3 + 1] = 0.27; // G
                colors[i * 3 + 2] = 0.27; // B
            }
        });

        return { positions, colors };
    }
}
