'use client';

import { useEffect, useState } from 'react';

import data from '@/lib/data.json';
const results = data.moods;

type ResultsProps = {
    moodCount: MoodKey[];
    showResults: boolean;
    handleRestart: () => void;
};

type MoodKey =
    | 'cosmicChill'
    | 'mainCharacter'
    | 'chaoticGood'
    | 'softExistential';

export default function Results({
    moodCount,
    showResults,
    handleRestart,
}: ResultsProps) {
    const handleShare = (
        platform: 'twitter' | 'linkedin' | 'facebook' | 'native'
    ) => {
        if (typeof window === 'undefined') return;

        const text = `I have checked my mood today: ${moodCount} Yes`;
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(window.location.href);

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'native':
                if (navigator.share) {
                    navigator.share({
                        title: 'My result on MoodSwipe',
                        text,
                        url: window.location.href,
                    });
                    return;
                } else {
                    navigator.clipboard.writeText(
                        `${text} - ${window.location.href}`
                    );
                    alert('Results copied to clipboard!');
                    return;
                }
        }

        if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    const [finalResult, setFinalResult] = useState<MoodKey | null>(null);

    useEffect(() => {
        if (!showResults) return;

        // Collect mood totals in an object
        const moodTotals = moodCount.reduce(
            (acc: { [key in MoodKey]?: number }, mood: MoodKey) => {
                if (acc[mood]) {
                    acc[mood] += 1;
                } else {
                    acc[mood] = 1;
                }
                return acc;
            },
            {}
        );

        // Determine the mood with the highest count
        let topMood: MoodKey | null = null;

        for (const mood in moodTotals) {
            // If this is the first mood we're checking, start with it
            if (!topMood) topMood = mood as MoodKey;
            // If this mood has a higher count than the current top, update topMood
            else if (moodTotals[mood as MoodKey]! > moodTotals[topMood]!) {
                topMood = mood as MoodKey;
            }
        }

        setFinalResult(topMood);
    }, [showResults, moodCount]);

    return (
        <div
            className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-primary ${
                showResults ? 'translate-y-0' : '-translate-y-full'
            } transition-transform duration-500`}
        >
            <h1 className='heading-display'>Results</h1>

            {/* FINAL RESULT */}
            {finalResult && (
                <div className='max-w-prose rounded-3xl bg-secondary p-8'>
                    <h2 className='heading-title'>
                        {finalResult && results[finalResult]
                            ? results[finalResult].name
                            : 'No dominant mood detected'}
                    </h2>
                    <p className='mt-4'>
                        {finalResult && results[finalResult]
                            ? results[finalResult].description
                            : ''}
                    </p>
                </div>
            )}

            {/* SHARE BUTTONS */}
            <div className='mt-4 flex flex-col items-center justify-center rounded-3xl p-8'>
                <h2 className='heading-title'>Share your result</h2>
                <div className='mt-4 flex gap-4'>
                    {[
                        { platform: 'twitter' as const, label: 'X' },
                        { platform: 'linkedin' as const, label: 'LinkedIn' },
                        { platform: 'facebook' as const, label: 'Facebook' },
                        { platform: 'native' as const, label: 'Share' },
                    ].map(({ platform, label }) => (
                        <button
                            key={platform}
                            className='btn-primary'
                            onClick={() => handleShare(platform)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <button className='btn-primary mt-4' onClick={handleRestart}>
                Restart quiz
            </button>
        </div>
    );
}
