import React, { useEffect, useState } from 'react';
import { APP_CONFIG } from '../config/constants';
import './CountUp.css';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    'aria-labelledby'?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = APP_CONFIG.COUNT_UP_DURATION, prefix = '', suffix = '', 'aria-labelledby': labelledby }) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [count, setCount] = useState(prefersReducedMotion ? end : 0);
    const [isAnimating, setIsAnimating] = useState(!prefersReducedMotion && end > 0);

    useEffect(() => {
        if (prefersReducedMotion) {
            setCount(end);
            setIsAnimating(false);
            return;
        }

        let start = 0;
        if (end === 0) {
            setCount(0);
            return;
        }

        const stepTime = 20; // ms, intervalle de mise à jour
        const totalSteps = Math.round(duration / stepTime);
        const increment = end / totalSteps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                setIsAnimating(false); // L'animation est terminée
                clearInterval(timer);
            } else {
                setCount(Math.round(start));
            }
        }, stepTime);

        return () => clearInterval(timer); // Nettoyage du minuteur
    }, [end, duration, prefersReducedMotion]);

    return (
        <span
            className="figure"
            aria-labelledby={labelledby}
            aria-live={isAnimating ? 'off' : 'polite'}
            aria-atomic="true"
        >{`${prefix}${count}${suffix}`}</span>
    );
};

export default CountUp;