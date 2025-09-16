import React, { useRef, ReactNode } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', id }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.15 });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${className} animated-section ${isVisible ? 'visible' : ''}`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;