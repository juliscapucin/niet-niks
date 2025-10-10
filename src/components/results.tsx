type ResultsProps = {
    yesCount: number;
    noCount: number;
    showResults: boolean;
    handleRestart: () => void;
};

export default function Results({
    yesCount,
    noCount,
    showResults,
    handleRestart,
}: ResultsProps) {
    const handleShare = (
        platform: 'twitter' | 'linkedin' | 'facebook' | 'native'
    ) => {
        if (typeof window === 'undefined') return;

        const text = `Net de Niet Niks-kieswijzer ingevuld! Uitslag: ${yesCount} Ja, ${noCount} Nee`;
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
                        title: 'Mijn uitslag op Niet Niks',
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

    return (
        <div
            className={`fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-primary ${
                showResults ? 'translate-y-0' : '-translate-y-full'
            } transition-transform duration-500`}
        >
            <h1 className='heading-headline'>Uitslag</h1>
            <p className='heading-title'>Ja: {yesCount}</p>
            <p className='heading-title'>Nee: {noCount}</p>

            <button className='btn-secondary' onClick={handleRestart}>
                Begin Opnieuw
            </button>

            <div>
                <h2 className='heading-title mt-4'>Deel je uitslag</h2>
                <div className='mt-4 flex gap-4'>
                    {[
                        { platform: 'twitter' as const, label: 'X' },
                        { platform: 'linkedin' as const, label: 'LinkedIn' },
                        { platform: 'facebook' as const, label: 'Facebook' },
                        { platform: 'native' as const, label: 'Delen' },
                    ].map(({ platform, label }) => (
                        <button
                            key={platform}
                            className='btn-secondary'
                            onClick={() => handleShare(platform)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
