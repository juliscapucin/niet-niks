import type { Metadata } from 'next';
import localFont from 'next/font/local';

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
                {children}
            </body>
        </html>
    );
}
