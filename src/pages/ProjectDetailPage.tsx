import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { allProjects, Project } from '../data/projects';
import { useAuth } from '../hooks/useAuth';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [projectIndex, setProjectIndex] = useState(-1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const foundProject = allProjects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setProjectIndex(allProjects.findIndex((p) => p.id === projectId));
    } else {
      // Optionnel : rediriger vers une page 404 ou la liste des projets si non trouvé
      // Pour l'instant, nous allons juste afficher un message.
    }
  }, [projectId]);

  const handlePurchase = () => {
    if (!user) {
      // Sauvegarder la page actuelle pour y revenir après la connexion
      localStorage.setItem('redirectAfterLogin', location.pathname);
                navigate('/login');
    } else {
      // Logique d'achat pour un utilisateur connecté
      // Par exemple, rediriger vers une page de paiement
      alert(`Redirection vers la page de paiement pour ${project?.title}`);
      // navigate(`/checkout/${project?.id}`);
    }
  };

  if (!project) {
    return (
      <section className="page-header">
        <div className="container text-center">
          <h1 className="page-title">Projet non trouvé</h1>
          <p className="page-subtitle">
            Le projet que vous cherchez n'existe pas.
          </p>
          <Link to="/projets" className="cta-button">
            Retourner aux projets
          </Link>
        </div>
      </section>
    );
  }

  const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : null;
  const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : null;

  return (
    <article className="project-detail-section animated-section visible">
      <div className="container">
        <header className="project-detail-header">
          <h1 className="page-title">{project.title}</h1>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </header>
        <img src={project.image.replace('w=400', 'w=1200')} alt={`Image pour ${project.title}`} className="project-detail-main-image" />
        <div className="project-detail-content">
          <p>{project.description}</p>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={handlePurchase} className="cta-button">
              Acheter ce produit
            </button>
          </div>
          {/* Vous pouvez ajouter plus de contenu détaillé ici */}
        </div>
        <nav className="project-navigation">
            {prevProject && <Link to={prevProject.link} className="prev-project">← Projet Précédent</Link>}
            {nextProject && <Link to={nextProject.link} className="next-project">Projet Suivant →</Link>}
        </nav>
      </div>
    </article>
  );
};

export default ProjectDetailPage;