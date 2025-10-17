'use client';

import { useState } from 'react';

export default function Start() {
    const [started, setStarted] = useState(false);

    const onStart = () => {
        setStarted(true);
    };

    return (
        <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-primary px-6 text-center transition-transform duration-500 ${
                started ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
            <h1 className='heading-headline'>Welcome to Moood</h1>
            <p className='mt-4 max-w-prose text-pretty'>
                {`Swipe right for "yes" and left for "no" as you go through 10
                affirmations. At the end, we'll reveal your mood of the day —
                from ✨ Cosmic Chill to 🌪 Chaotic Good.`}
            </p>
            <p className='mt-2'> There are no wrong answers, just vibes.</p>
            <button className='btn btn-accent-blue mt-8' onClick={onStart}>
                Start Quiz
            </button>
        </div>
    );
}
