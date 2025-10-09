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

const initialProposals = [
    { id: 1, text: 'Proposal 1' },
    { id: 2, text: 'Proposal 2' },
    { id: 3, text: 'Proposal 3' },
    { id: 4, text: 'Proposal 4' },
    { id: 5, text: 'Proposal 5' },
];

function Card({ proposal, onSwipe, isFront }: CardProps) {
    const [exitX, setExitX] = useState(0);
    const x = useMotionValue(0);
    const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
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
        animate: { scale: 0.75, y: 30, opacity: 0.5 },
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
            style={{
                position: 'absolute',
                top: 0,
                width: 200,
                height: 200,
                x,
                rotate,
                cursor: 'grab',
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
                className='flex h-full w-full items-center justify-center rounded-xl bg-accent text-center text-lg font-semibold'
                style={{ scale }}
            >
                {proposal.text}
            </motion.div>
        </motion.div>
    );
}

export default function Swiper() {
    const [proposals, setProposals] = useState(initialProposals);
    const [yesList, setYesList] = useState(0);
    const [noList, setNoList] = useState(0);

    const handleSwipe = (direction: 'left' | 'right') => {
        const [current, ...rest] = proposals; // Get the first element and the rest

        if (!current) return;

        if (direction === 'right') setYesList((prev) => prev + 1);
        else setNoList((prev) => prev + 1);

        // Remove the swiped proposal
        setProposals(rest);
    };

    const currentProposal = proposals[0];
    const nextProposal = proposals[1];

    return (
        <div className='relative'>
            <motion.div className='relative flex h-[200px] w-[300px] items-center justify-center'>
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
            <div className='mt-4 text-center'>
                ✅ Yes: {yesList} | ❌ No: {noList}
            </div>
        </div>
    );
}
