import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allProjects } from '../data/projects';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Fonction helper pour capitaliser les tags
  const capitalizeTag = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);

  // Extract unique tags from all projects (mémorisé pour les performances)
  const uniqueTags = useMemo(() => 
    Array.from(new Set(allProjects.flatMap((project) => project.tags))).sort(),
    []
  );

  // Filtrage direct sans useEffect pour de meilleures performances
  const filteredProjects = useMemo(() => {
    if (selectedTag === 'all') {
      return allProjects;
    }
    return allProjects.filter((project) => project.tags.includes(selectedTag));
  }, [selectedTag]);

  const handleFilterClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Nos Projets</h1>
          <p className="page-subtitle">
            Découvrez nos réalisations .
          </p>
        </div>
      </section> 

      <section className="projects-section animated-section">
        <div className="container">
          <div className="project-filter-container">
            <button
              className={`project-filter-btn ${
                selectedTag === 'all' ? 'active' : ''
              }`}
              onClick={() => handleFilterClick('all')}
            >
              Tous les projets
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                className={`project-filter-btn ${
                  selectedTag === tag ? 'active' : ''
                }`}
                onClick={() => handleFilterClick(tag)}
              >
                {capitalizeTag(tag)}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Link
                  to={project.link}
                  key={project.id}
                  className="project-card visible" // Add 'visible' class for initial display
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="project-card-overlay">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {capitalizeTag(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results-message">
                Aucun projet ne correspond à votre sélection.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;