import type { LessonConfig } from './types';

export const LESSONS: LessonConfig[] = [
    // --- PHASE 1: FOUNDATION (Home Row & Efficiency) ---
    {
        id: 'p1-l1',
        title: 'Neural Link: Home Row',
        description: 'Initialize connection. Place fingers on ASDF JKL;. Do not look down.',
        phase: 'foundation',
        type: 'practice',
        text: 'ffff jjjj dddd kkkk ssss llll aaaa ;;;; asdf jkl; asdf jkl;',
        requirements: { minWpm: 15, minAccuracy: 95 },
        xpReward: 100
    },
    {
        id: 'p1-l2',
        title: 'Index Finger Protocols',
        description: 'Extend reach. R and U are controlled by index fingers.',
        phase: 'foundation',
        type: 'practice',
        text: 'frju frju ffrr jjuu f u r j fur rug jug fur rug jug',
        requirements: { minWpm: 18, minAccuracy: 94 },
        xpReward: 120
    },
    {
        id: 'p1-l3',
        title: 'Core Activation: E & I',
        description: 'Middle fingers engage. E is the most common letter.',
        phase: 'foundation',
        type: 'practice',
        text: 'ded kik ded kik de ki de ki did kid die lie did kid die lie',
        requirements: { minWpm: 20, minAccuracy: 94 },
        xpReward: 140
    },
    {
        id: 'p1-l4',
        title: 'Vowel Synchronization',
        description: 'Engage A, E, I, O, U. Complete the circuit.',
        phase: 'foundation',
        type: 'practice',
        text: 'auto auto out out about about idea idea audio audio',
        requirements: { minWpm: 25, minAccuracy: 92 },
        xpReward: 160
    },

    // --- PHASE 2: ACCURACY (Rhythm & N-Grams) ---
    {
        id: 'p2-l1',
        title: 'Rhythm Calibration',
        description: 'Focus on consistent timing. Do not rush.',
        phase: 'accuracy',
        type: 'practice',
        text: 'The quick brown fox jumps over the lazy dog.',
        requirements: { minWpm: 30, minAccuracy: 98 },
        xpReward: 200
    },
    {
        id: 'p2-l2',
        title: 'Common N-Grams',
        description: 'Master the building blocks: TH, HE, IN, AN.',
        phase: 'accuracy',
        type: 'practice',
        text: 'the the and and that that with with this this then then',
        requirements: { minWpm: 35, minAccuracy: 96 },
        xpReward: 220
    },
    {
        id: 'p2-l3',
        title: 'Symbol Integration',
        description: 'Initialize brackets and shift modifiers. {} [] ()',
        phase: 'accuracy',
        type: 'practice',
        text: '[] {} () [] {} () [item] {key} (val) [indx] {prop} (func)',
        requirements: { minWpm: 25, minAccuracy: 95 },
        xpReward: 250
    },
    {
        id: 'p2-l4',
        title: 'Terminal Operatives',
        description: 'Command line syntax. Slashes and hyphens.',
        phase: 'accuracy',
        type: 'practice',
        text: 'cd /var/log/ ls -la git commit -m "update" npm run build',
        requirements: { minWpm: 30, minAccuracy: 96 },
        xpReward: 280
    },

    // --- PHASE 3: SPEED (Flow State) ---
    {
        id: 'p3-l1',
        title: 'Velocity Test: Alpha',
        description: 'Unrestricted speed. Maintain form.',
        phase: 'speed',
        type: 'practice',
        text: 'Technology is best when it brings people together. It is the art of arranging life.',
        requirements: { minWpm: 45, minAccuracy: 90 },
        xpReward: 300
    },
    {
        id: 'p3-l2',
        title: 'Code Syntax: JS',
        description: 'Special characters and camelCase.',
        phase: 'speed',
        type: 'practice',
        text: 'function init() { const x = 10; if (x > 5) return true; }',
        requirements: { minWpm: 40, minAccuracy: 95 },
        xpReward: 500
    },
    {
        id: 'p3-l3',
        title: 'Code Syntax: Python',
        description: 'Snake case and indentation patterns.',
        phase: 'speed',
        type: 'practice',
        text: 'def calculate_speed(dist, time): return dist / time if time > 0 else 0',
        requirements: { minWpm: 40, minAccuracy: 95 },
        xpReward: 500
    },
    {
        id: 'p3-l4',
        title: 'Code Syntax: Rust',
        description: 'Memory safety protocols. Lifetimes and pointers.',
        phase: 'speed',
        type: 'practice',
        text: 'fn main() { let mut x = 5; println!("The value is: {}", x); }',
        requirements: { minWpm: 35, minAccuracy: 98 },
        xpReward: 600
    },
    {
        id: 'p3-l5',
        title: 'Flow State: Cyberpunk',
        description: 'Advanced narrative text. Sync brain to buffer.',
        phase: 'speed',
        type: 'practice',
        text: 'The sky above the port was the color of television, tuned to a dead channel. Case was 24. At 22, he\'d been a cowboy, a rustler, one of the best in the Sprawl.',
        requirements: { minWpm: 50, minAccuracy: 92 },
        xpReward: 800
    },

    // --- PHASE 5: CERTIFICATION EXAMS ---
    {
        id: 'exam-alpha',
        title: 'Certification: Alpha Class',
        description: 'Prove your mastery. Strict adherence to protocol required.',
        phase: 'exam',
        type: 'exam',
        text: 'The user interface is the space where interactions between humans and machines occur. The goal of this interaction is to allow effective operation and control of the machine from the human end.',
        requirements: { minWpm: 40, minAccuracy: 96 },
        strictMode: true,
        xpReward: 1000
    },
    {
        id: 'exam-beta',
        title: 'Certification: Beta Class',
        description: 'High-velocity data entry test. Efficiency is paramount.',
        phase: 'exam',
        type: 'exam',
        text: 'In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design. A design pattern isn\'t a finished design that can be transformed directly into code.',
        requirements: { minWpm: 60, minAccuracy: 98 },
        strictMode: true,
        xpReward: 2000
    }
];

