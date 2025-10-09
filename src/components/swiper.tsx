'use client';

import { useState } from 'react';
import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
    PanInfo,
} from 'framer-motion';

type CardProps = {
    proposal: { id: number; text: string };
    onSwipe: (direction: 'left' | 'right') => void;
    isFront: boolean;
};

type ResultsProps = {
    yesCount: number;
    noCount: number;
    showResults: boolean;
    handleRestart: () => void;
};

const initialProposals = [
    { id: 1, text: 'Proposal 1' },
    { id: 2, text: 'Proposal 2' },
    { id: 3, text: 'Proposal 3' },
    { id: 4, text: 'Proposal 4' },
    { id: 5, text: 'Proposal 5' },
];

function Results({
    yesCount,
    noCount,
    showResults,
    handleRestart,
}: ResultsProps) {
    return (
        <div
            className={`fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-primary ${showResults ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-500`}
        >
            <h1 className='heading-headline'>Results</h1>
            <p className='heading-title'>Yes: {yesCount}</p>
            <p className='heading-title'>No: {noCount}</p>
            <button className='btn-secondary' onClick={handleRestart}>
                Restart
            </button>
            <div className='mt-4 flex gap-4'>
                <button
                    className='btn-secondary'
                    onClick={() => {
                        const text = `I just voted on proposals! Results: ${yesCount} Yes, ${noCount} No`;
                        const url = encodeURIComponent(window.location.href);
                        window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
                            '_blank'
                        );
                    }}
                >
                    Share on X
                </button>
                <button
                    className='btn-secondary'
                    onClick={() => {
                        const text = `I just voted on proposals! Results: ${yesCount} Yes, ${noCount} No`;
                        const url = encodeURIComponent(window.location.href);
                        window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                            '_blank'
                        );
                    }}
                >
                    Share on LinkedIn
                </button>
                <button
                    className='btn-secondary'
                    onClick={() => {
                        const text = `I just voted on proposals! Results: ${yesCount} Yes, ${noCount} No`;
                        const url = encodeURIComponent(window.location.href);
                        window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`,
                            '_blank'
                        );
                    }}
                >
                    Share on Facebook
                </button>
                <button
                    className='btn-secondary'
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'My Voting Results',
                                text: `I just voted on proposals! Results: ${yesCount} Yes, ${noCount} No`,
                                url: window.location.href,
                            });
                        } else {
                            navigator.clipboard.writeText(
                                `I just voted on proposals! Results: ${yesCount} Yes, ${noCount} No - ${window.location.href}`
                            );
                            alert('Results copied to clipboard!');
                        }
                    }}
                >
                    Share
                </button>
            </div>
        </div>
    );
}

function Card({ proposal, onSwipe, isFront }: CardProps) {
    const [exitX, setExitX] = useState(0);
    const x = useMotionValue(0);
    const scale = useTransform(x, [-250, 0, 250], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-250, 0, 250], [-45, 0, 45], {
        clamp: false,
    });

    const variantsFrontCard = {
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: (custom: number) => ({
            x: custom,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.3 },
        }),
    };

    const variantsBackCard = {
        initial: { scale: 0, y: 105, opacity: 0 },
        animate: { scale: 0.75, y: 65, opacity: 0.8 },
    };

    function handleDragEnd(
        _event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) {
        if (info.offset.x < -100) {
            setExitX(-250);
            onSwipe('left');
        } else if (info.offset.x > 100) {
            setExitX(250);
            onSwipe('right');
        }
    }

    return (
        <motion.div
            className='absolute h-full w-full cursor-grab'
            style={{
                x,
                rotate,
                zIndex: isFront ? 1 : 0,
            }}
            whileTap={{ cursor: 'grabbing' }}
            drag='x'
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onDragEnd={handleDragEnd}
            variants={isFront ? variantsFrontCard : variantsBackCard}
            initial='initial'
            animate='animate'
            exit='exit'
            custom={exitX}
        >
            <motion.div
                className='heading-title flex h-full w-full items-center justify-center rounded-xl bg-secondary-faded p-4 text-center'
                style={{ scale }}
            >
                {proposal.text}
            </motion.div>
        </motion.div>
    );
}

export default function Swiper() {
    const [proposals, setProposals] = useState(initialProposals);
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleRestart = () => {
        setShowResults(false);
        setProposals(initialProposals);

        // Small delay to allow the results screen to slide up before resetting
        setTimeout(() => {
            setYesCount(0);
            setNoCount(0);
        }, 300);
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        const [current, ...rest] = proposals; // Get the first element and the rest

        if (!current) return;

        if (direction === 'right') setYesCount((prev) => prev + 1);
        if (direction === 'left') setNoCount((prev) => prev + 1);

        // Remove the swiped proposal
        setProposals(rest);

        if (rest.length === 0) {
            //   router.push('/results');
            setShowResults(true);
        }
    };

    const currentProposal = proposals[0];
    const nextProposal = proposals[1];

    return (
        <div className='relative flex h-screen w-screen flex-col items-center justify-center'>
            <Results
                showResults={showResults}
                yesCount={yesCount}
                noCount={noCount}
                handleRestart={handleRestart}
            />
            <motion.div className='relative h-[400px] w-[300px]'>
                <AnimatePresence initial={false}>
                    {currentProposal && (
                        <Card
                            key={currentProposal.id}
                            proposal={currentProposal}
                            onSwipe={handleSwipe}
                            isFront={true}
                        />
                    )}
                    {nextProposal && (
                        <Card
                            key={nextProposal.id}
                            proposal={nextProposal}
                            onSwipe={handleSwipe}
                            isFront={false}
                        />
                    )}
                </AnimatePresence>{' '}
            </motion.div>
            <div className='heading-title mt-6 flex justify-center gap-4'>
                <span>✅ Yes: {yesCount}</span> | <span>❌ No: {noCount}</span>
            </div>
        </div>
    );
}
