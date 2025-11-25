import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface ShuffleTextProps {
    text: string;
    className?: string;
}

export const ShuffleText = ({ text, className = '' }: ShuffleTextProps) => {
    const textRef = useRef<HTMLHeadingElement>(null);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+';

    useGSAP(() => {
        const element = textRef.current;
        if (!element) return;

        const duration = 3.5; // Duration in seconds - slower for better effect
        const proxy = { value: 0 };

        gsap.to(proxy, {
            value: text.length,
            duration: duration,
            delay: 0.3, // Small delay before starting
            ease: 'power1.out', // Smoother easing
            onUpdate: () => {
                const progress = Math.floor(proxy.value);
                element.innerText = text
                    .split('')
                    .map((char, index) => {
                        if (index < progress) {
                            return text[index];
                        }
                        // Return random char for the rest, but keep spaces as spaces
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
            },
            onComplete: () => {
                element.innerText = text;
            }
        });

    }, { scope: textRef, dependencies: [text] });

    return (
        <h1 ref={textRef} className={className}>
            {text}
        </h1>
    );
};
