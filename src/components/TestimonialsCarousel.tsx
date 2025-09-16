import React, { useState, useEffect, memo } from 'react';
import { testimonialsData } from '../data/testimonials';
import { APP_CONFIG } from '../config/constants';

const TestimonialsCarousel = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Vérification que nous avons des témoignages
    if (testimonialsData.length === 0) return;
    
    // Met en place un minuteur qui change l'index toutes les 7 secondes
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, APP_CONFIG.TESTIMONIAL_INTERVAL);

    // La fonction de nettoyage est cruciale !
    // Elle s'exécute lorsque le composant est démonté pour arrêter le minuteur
    // et éviter les fuites de mémoire.
    return () => clearInterval(intervalId);
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une seule fois (au montage)

  // Affichage d'un message si aucun témoignage
  if (testimonialsData.length === 0) {
    return (
      <div className="testimonial-carousel">
        <p>Aucun témoignage disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="testimonial-carousel">
      {/* Affichage uniquement du témoignage actif pour optimiser les performances */}
      <div className="testimonial active">
        <p className="quote">"{testimonialsData[currentIndex].quote}"</p>
        <p className="author">- {testimonialsData[currentIndex].author}, {testimonialsData[currentIndex].company}</p>
      </div>
      
      {/* Indicateurs de pagination */}
      <div className="testimonial-indicators">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Témoignage ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

export default TestimonialsCarousel;