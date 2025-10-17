'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import data from '@/lib/data.json';
import { Results, Card } from '@/components';

const initialProposals = data.affirmations;

type MoodKey =
    | 'cosmicChill'
    | 'mainCharacter'
    | 'chaoticGood'
    | 'softExistential';

export default function Swiper() {
    const [proposals, setProposals] = useState(initialProposals);
    const [moodCount, setMoodCount] = useState<MoodKey[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isVoteVisible, setIsVoteVisible] = useState(false);
    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);

    const handleRestart = () => {
        setShowResults(false);
        setProposals(initialProposals);
        setIsVoteVisible(false);
        setIsFeedbackVisible(false);
        setDirection(null);

        // Small delay to allow the results screen to slide up before resetting
        setTimeout(() => {
            setMoodCount([]);
        }, 300);
    };

    const handleSwipe = () => {
        const [current, ...rest] = proposals; // Get the first element and the rest

        if (!current) return;

        if (direction === 'right') {
            setIsVoteVisible(true);

            // Only count moods if swiped right
            setMoodCount((prev) => [...prev, ...(current.moods as MoodKey[])]);
        }
        if (direction === 'left') {
            setIsVoteVisible(true);
        }

        // Hide feedback after swipe
        setIsFeedbackVisible(false);

        // Remove the swiped proposal
        setProposals(rest);

        // Show results if no proposals left
        if (rest.length === 0) {
            setShowResults(true);
        }
    };

    const handleDirection = (dir: 'left' | 'right' | null) => {
        setDirection(dir);
    };

    const handleHideVote = () => {
        setIsVoteVisible(false);
    };

    const currentProposal = proposals[0];
    const nextProposal = proposals[1];

    useEffect(() => {
        setIsFeedbackVisible(!!direction); // convert direction to boolean
    }, [direction]);

    return (
        <>
            {/** EMPTY STATE */}
            {!currentProposal && !showResults && <EmptyState />}

            {/** RESULTS */}
            <Results
                showResults={showResults}
                moodCount={moodCount}
                handleRestart={handleRestart}
            />

            {/** SWIPER */}
            {currentProposal && (
                <div className='relative container flex h-screen w-screen items-center justify-center'>
                    {/* CARDS */}
                    <motion.div className='relative h-[49vh] max-h-[600px] min-h-[400px] w-[20vw] max-w-[380px] min-w-[350px]'>
                        <AnimatePresence initial={false}>
                            {currentProposal && (
                                <Card
                                    key={currentProposal.id}
                                    proposal={currentProposal}
                                    onSwipe={handleSwipe}
                                    onDirectionChange={handleDirection}
                                    isFront={true}
                                />
                            )}
                            {nextProposal && (
                                <Card
                                    key={nextProposal.id}
                                    proposal={nextProposal}
                                    onDirectionChange={handleDirection}
                                    isFront={false}
                                />
                            )}
                        </AnimatePresence>{' '}
                    </motion.div>

                    {/* INTERACTION FEEDBACK */}
                    <div className='heading-title absolute bottom-0 z-20 mb-6 w-full'>
                        <FeedbackDisplay
                            direction={direction}
                            isVisible={isFeedbackVisible}
                        />
                    </div>

                    {/* VOTE FEEDBACK */}
                    {/* <div className='heading-title relative mt-6 w-full'>
                        <FeedbackDisplay
                            direction={direction}
                            isVisible={isVoteVisible}
                            isVote={true}
                            onHideVote={handleHideVote}
                        />
                    </div> */}
                </div>
            )}
        </>
    );
}

type FeedbackDisplayProps = {
    direction: 'left' | 'right' | null;
    isVisible: boolean;
    isVote?: boolean;
    onHideVote?: () => void;
};

const FeedbackDisplay = ({
    direction,
    isVisible,
    isVote,
    onHideVote,
}: FeedbackDisplayProps) => (
    <AnimatePresence>
        {isVisible && direction && (
            <motion.span
                className='heading-feedback flex w-full justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                    if (isVote && onHideVote) onHideVote();
                }}
            >
                {direction === 'right' ? (
                    <span className='text-accent-green'>Yes</span>
                ) : (
                    <span className='text-accent-red'>No</span>
                )}
            </motion.span>
        )}
    </AnimatePresence>
);

const EmptyState = () => (
    <div className='flex h-full w-screen items-center justify-center p-8'>
        <div className='bg-secondary-faded container flex h-full items-center justify-center rounded-xl p-4'>
            <h1 className='heading-title text-center'>
                No more affirmations available. Please restart the quiz.
            </h1>
        </div>
    </div>
);
