export interface Lesson {
    id: string;
    title: string;
    category: 'Basics' | 'Words' | 'Code';
    difficulty: 1 | 2 | 3;
    text: string;
}

export const LESSONS: Lesson[] = [
    {
        id: 'l1',
        title: 'Home Row Basics',
        category: 'Basics',
        difficulty: 1,
        text: 'asdf jkl; asdf jkl; aa ss dd ff jj kk ll ;;'
    },
    {
        id: 'l2',
        title: 'Index Finger Stretch',
        category: 'Basics',
        difficulty: 1,
        text: 'fg hj fg hj fghj ffff gggg hhhh jjjj'
    },
    {
        id: 'l3',
        title: 'Common Words',
        category: 'Words',
        difficulty: 1,
        text: 'the be to of and a in that have I it for not on with he as you do at'
    },
    {
        id: 'l4',
        title: 'Sentences',
        category: 'Words',
        difficulty: 2,
        text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.'
    },
    {
        id: 'l5',
        title: 'JavaScript Loop',
        category: 'Code',
        difficulty: 3,
        text: 'for (let i = 0; i < 10; i++) { console.log(i); }'
    }
];
