import React, { useEffect, useRef, useState } from 'react';
import CountUp from './CountUp';

const KeyFiguresSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Quand 50% de l'élément est visible, on déclenche l'animation
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(sectionRef.current!); // On anime une seule fois
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Nettoyage de l'observateur quand le composant est démonté
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderFigure = (end: number, prefix = '', suffix = '', label:string) => {
    // Crée un ID unique et stable pour l'accessibilité
    const labelId = `figure-label-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="key-figure">
        {isVisible ? (
          <CountUp end={end} prefix={prefix} suffix={suffix} aria-labelledby={labelId} />
        ) : (
          <span className="figure" aria-labelledby={labelId}>{`${prefix}0${suffix}`}</span>
        )}
        <span id={labelId} className="label">{label}</span>
      </div>
    );
  };

  return (
    <section className="key-figures-section" ref={sectionRef} aria-label="Chiffres clés de notre entreprise">
      {renderFigure(50, "+ de ", "", "Projets réussis")}
      {renderFigure(10, "", "", "ans d'expérience")}
      {renderFigure(98, "", "%", "Clients satisfaits")}
    </section>
  );
};

export default KeyFiguresSection;