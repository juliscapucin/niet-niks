'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Swiper, Start } from '@/components';

export default function Home() {
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
    };

    const handleRestart = () => {
        setStarted(false);
    };

    return (
        <>
            <header className='absolute top-4 left-4 z-50 h-10 w-fit md:h-12'>
                <button
                    onClick={handleRestart}
                    className='relative h-full w-[200px] cursor-pointer transition-opacity hover:opacity-80'
                    aria-label='Restart quiz'
                >
                    <Image
                        src='/moood-logo.png'
                        alt='Moood Logo'
                        width={400}
                        height={48}
                        className='h-full object-contain'
                        quality={100}
                    />
                </button>
            </header>

            <main className='flex h-screen w-full items-center justify-center'>
                <Start started={started} onStart={handleStart} />
                <Swiper started={started} />
            </main>
        </>
    );
}
