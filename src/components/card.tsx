'use client';

const SWIPE_THRESHOLD = 200;
const DRAG_FEEDBACK_THRESHOLD = 10;
const CARD_EXIT_DISTANCE = 250;

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

type CardProps = {
    proposal: { id: number; text: string };
    onDirectionChange: (direction: 'left' | 'right' | null) => void;
    onSwipe?: () => void;
    isFront: boolean;
};

export default function Card({
    proposal,
    onSwipe,
    onDirectionChange,
    isFront,
}: CardProps) {
    const [exitX, setExitX] = useState(0);
    const x = useMotionValue(0);
    //  const scale = useTransform(x, [-250, 0, 250], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-250, 0, 250], [-45, 0, 45], {
        clamp: false,
    });

    const variantsFrontCard = {
        animate: {
            scale: 1,
            y: 0,
            x: 0,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            opacity: 1,
        },
        exit: (custom: number) => ({
            x: custom,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            scale: 0.5,
            transition: { duration: 0.3 },
        }),
    };

    const variantsBackCard = {
        initial: { scale: 0, y: 0, x: 0, opacity: 0 },
        animate: { scale: 0.95, y: 30, x: 10, opacity: 1 },
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
            className='absolute h-full w-full cursor-grab overflow-clip rounded-xl'
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
            <motion.div
                className={`heading-title flex h-full w-full flex-col items-center justify-center p-8 text-center text-pretty text-secondary ${
                    isFront ? 'bg-accent-blue' : 'bg-text-dark'
                }`}
            >
                <span className='heading-headline mb-4 text-accent-green'>
                    {proposal.id}
                </span>
                {proposal.text}
            </motion.div>
        </motion.div>
    );
}
