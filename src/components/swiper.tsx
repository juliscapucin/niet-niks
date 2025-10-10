'use client';

const SWIPE_THRESHOLD = 200;
const DRAG_FEEDBACK_THRESHOLD = 10;
const CARD_EXIT_DISTANCE = 250;

import { useEffect, useState } from 'react';
import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
    PanInfo,
} from 'framer-motion';

import { Results } from '@/components';

type CardProps = {
    proposal: { id: number; text: string };
    onDirectionChange: (direction: 'left' | 'right' | null) => void;
    onSwipe?: () => void;
    isFront: boolean;
};

const initialProposals = [
    { id: 1, text: 'Motie 1' },
    { id: 2, text: 'Motie 2' },
    { id: 3, text: 'Motie 3' },
    { id: 4, text: 'Motie 4' },
    { id: 5, text: 'Motie 5' },
];

function Card({ proposal, onSwipe, onDirectionChange, isFront }: CardProps) {
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
        if (!isFront) return;

        if (info.offset.x < -SWIPE_THRESHOLD) {
            setExitX(-CARD_EXIT_DISTANCE);
            onDirectionChange('left');
            if (onSwipe) onSwipe();
        } else if (info.offset.x > SWIPE_THRESHOLD) {
            setExitX(CARD_EXIT_DISTANCE);
            onDirectionChange('right');
            if (onSwipe) onSwipe();
        } else {
            // No swipe: reset direction
            onDirectionChange(null);
        }
    }

    function handleDragStart(info: PanInfo) {
        if (!isFront) return;
        if (
            info.offset.x < -DRAG_FEEDBACK_THRESHOLD &&
            info.offset.x > -SWIPE_THRESHOLD
        )
            onDirectionChange('left');
        if (
            info.offset.x > DRAG_FEEDBACK_THRESHOLD &&
            info.offset.x < SWIPE_THRESHOLD
        )
            onDirectionChange('right');
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
            onDrag={(_, info) => handleDragStart(info)}
            onDragEnd={handleDragEnd}
            variants={isFront ? variantsFrontCard : variantsBackCard}
            initial='initial'
            animate='animate'
            exit='exit'
            custom={exitX}
        >
            <motion.div className='heading-title flex h-full w-full items-center justify-center rounded-xl bg-secondary-faded p-4 text-center'>
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
            setYesCount(0);
            setNoCount(0);
        }, 300);
    };

    const handleSwipe = () => {
        const [current, ...rest] = proposals; // Get the first element and the rest

        if (!current) return;

        if (direction === 'right') {
            setIsVoteVisible(true);
            setYesCount((prev) => prev + 1);
        }
        if (direction === 'left') {
            setIsVoteVisible(true);
            setNoCount((prev) => prev + 1);
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
                yesCount={yesCount}
                noCount={noCount}
                handleRestart={handleRestart}
            />

            {/** SWIPER */}
            {currentProposal && (
                <div className='relative container flex h-screen w-screen flex-col items-center justify-center'>
                    {/* CARDS */}
                    <motion.div className='relative h-[400px] w-[300px]'>
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
                    <div className='heading-title absolute z-20 mt-6 w-full'>
                        <FeedbackDisplay
                            direction={direction}
                            isVisible={isFeedbackVisible}
                        />
                    </div>

                    {/* VOTE FEEDBACK */}
                    <div className='heading-title relative mt-6 w-full'>
                        <FeedbackDisplay
                            direction={direction}
                            isVisible={isVoteVisible}
                            isVote={true}
                            onHideVote={handleHideVote}
                        />
                    </div>
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
                className='absolute flex w-full justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                    if (isVote && onHideVote) onHideVote();
                }}
            >
                {direction === 'right' ? '✅ Ja' : '❌ Nee'}
            </motion.span>
        )}
    </AnimatePresence>
);

const EmptyState = () => (
    <div className='flex h-full w-screen items-center justify-center p-8'>
        <div className='container flex h-full items-center justify-center rounded-xl bg-secondary-faded p-4'>
            <h1 className='heading-title text-center'>
                Geen moties meer om te beoordelen.
            </h1>
        </div>
    </div>
);
