export type FingerMapping = 'L_PINKY' | 'L_RING' | 'L_MIDDLE' | 'L_INDEX' | 'L_THUMB' | 'R_THUMB' | 'R_INDEX' | 'R_MIDDLE' | 'R_RING' | 'R_PINKY';

export interface KeyConfig {
    code: string; // DOM Key code like "KeyA"
    label: string;
    finger: FingerMapping;
    row: number; // 0-4 (0 is number row)
    width?: number; // Relative width (1 = standard)
}

export const QWERTY_LAYOUT: KeyConfig[][] = [
    // ROW 0
    [
        { code: 'Backquote', label: '`', finger: 'L_PINKY', row: 0 },
        { code: 'Digit1', label: '1', finger: 'L_PINKY', row: 0 },
        { code: 'Digit2', label: '2', finger: 'L_RING', row: 0 },
        { code: 'Digit3', label: '3', finger: 'L_MIDDLE', row: 0 },
        { code: 'Digit4', label: '4', finger: 'L_INDEX', row: 0 },
        { code: 'Digit5', label: '5', finger: 'L_INDEX', row: 0 },
        { code: 'Digit6', label: '6', finger: 'R_INDEX', row: 0 },
        { code: 'Digit7', label: '7', finger: 'R_INDEX', row: 0 },
        { code: 'Digit8', label: '8', finger: 'R_MIDDLE', row: 0 },
        { code: 'Digit9', label: '9', finger: 'R_RING', row: 0 },
        { code: 'Digit0', label: '0', finger: 'R_PINKY', row: 0 },
        { code: 'Minus', label: '-', finger: 'R_PINKY', row: 0 },
        { code: 'Equal', label: '=', finger: 'R_PINKY', row: 0 },
        { code: 'Backspace', label: '⌫', finger: 'R_PINKY', row: 0, width: 2 },
    ],
    // ROW 1
    [
        { code: 'Tab', label: 'Tab', finger: 'L_PINKY', row: 1, width: 1.5 },
        { code: 'KeyQ', label: 'Q', finger: 'L_PINKY', row: 1 },
        { code: 'KeyW', label: 'W', finger: 'L_RING', row: 1 },
        { code: 'KeyE', label: 'E', finger: 'L_MIDDLE', row: 1 },
        { code: 'KeyR', label: 'R', finger: 'L_INDEX', row: 1 },
        { code: 'KeyT', label: 'T', finger: 'L_INDEX', row: 1 },
        { code: 'KeyY', label: 'Y', finger: 'R_INDEX', row: 1 },
        { code: 'KeyU', label: 'U', finger: 'R_INDEX', row: 1 },
        { code: 'KeyI', label: 'I', finger: 'R_MIDDLE', row: 1 },
        { code: 'KeyO', label: 'O', finger: 'R_RING', row: 1 },
        { code: 'KeyP', label: 'P', finger: 'R_PINKY', row: 1 },
        { code: 'BracketLeft', label: '[', finger: 'R_PINKY', row: 1 },
        { code: 'BracketRight', label: ']', finger: 'R_PINKY', row: 1 },
        { code: 'Backslash', label: '\\', finger: 'R_PINKY', row: 1, width: 1.5 },
    ],
    // ROW 2
    [
        { code: 'CapsLock', label: 'Caps', finger: 'L_PINKY', row: 2, width: 1.8 },
        { code: 'KeyA', label: 'A', finger: 'L_PINKY', row: 2 },
        { code: 'KeyS', label: 'S', finger: 'L_RING', row: 2 },
        { code: 'KeyD', label: 'D', finger: 'L_MIDDLE', row: 2 },
        { code: 'KeyF', label: 'F', finger: 'L_INDEX', row: 2 },
        { code: 'KeyG', label: 'G', finger: 'L_INDEX', row: 2 },
        { code: 'KeyH', label: 'H', finger: 'R_INDEX', row: 2 },
        { code: 'KeyJ', label: 'J', finger: 'R_INDEX', row: 2 },
        { code: 'KeyK', label: 'K', finger: 'R_MIDDLE', row: 2 },
        { code: 'KeyL', label: 'L', finger: 'R_RING', row: 2 },
        { code: 'Semicolon', label: ';', finger: 'R_PINKY', row: 2 },
        { code: 'Quote', label: "'", finger: 'R_PINKY', row: 2 },
        { code: 'Enter', label: 'Enter', finger: 'R_PINKY', row: 2, width: 2.2 },
    ],
    // ROW 3
    [
        { code: 'ShiftLeft', label: 'Shift', finger: 'L_PINKY', row: 3, width: 2.4 },
        { code: 'KeyZ', label: 'Z', finger: 'L_PINKY', row: 3 },
        { code: 'KeyX', label: 'X', finger: 'L_RING', row: 3 },
        { code: 'KeyC', label: 'C', finger: 'L_MIDDLE', row: 3 },
        { code: 'KeyV', label: 'V', finger: 'L_INDEX', row: 3 },
        { code: 'KeyB', label: 'B', finger: 'L_INDEX', row: 3 },
        { code: 'KeyN', label: 'N', finger: 'R_INDEX', row: 3 },
        { code: 'KeyM', label: 'M', finger: 'R_INDEX', row: 3 },
        { code: 'Comma', label: ',', finger: 'R_MIDDLE', row: 3 },
        { code: 'Period', label: '.', finger: 'R_RING', row: 3 },
        { code: 'Slash', label: '/', finger: 'R_PINKY', row: 3 },
        { code: 'ShiftRight', label: 'Shift', finger: 'R_PINKY', row: 3, width: 2.4 },
    ],
    // ROW 4
    [
        { code: 'Space', label: '', finger: 'L_THUMB', row: 4, width: 6.5 }
    ]
];
