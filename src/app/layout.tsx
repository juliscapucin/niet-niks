import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';

import './globals.css';

// Load custom font //
const font = localFont({
    variable: '--font-rounded',
    src: [
        {
            path: '../../public/fonts/PPPangramSansRounded-Semibold.otf',
        },
    ],
});

export const metadata: Metadata = {
    title: 'Moood',
    description:
        'How do you feel today? Swipe through affirmations and discover your daily mood.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${font.variable} overflow-clip bg-primary font-primary text-text-dark antialiased`}
            >
                <header className='absolute top-4 left-4 z-50 h-10 w-fit md:h-12'>
                    <div className='relative h-full w-[200px]'>
                        <Image
                            src='/moood-logo.png'
                            alt='Moood Logo'
                            fill
                            className='h-full object-contain'
                            quality={100}
                        />
                    </div>
                </header>
                {children}
            </body>
        </html>
    );
}
