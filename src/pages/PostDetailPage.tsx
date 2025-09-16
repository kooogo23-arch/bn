import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { allPosts, Post } from '../data/posts';
import './PostDetailPage.css';

// Composant optimisé pour les boutons de partage
const ShareButtons = ({ postTitle, postUrl }: { postTitle: string, postUrl: string }) => {
  const encodedUrl = useMemo(() => encodeURIComponent(postUrl), [postUrl]);
  const encodedTitle = useMemo(() => encodeURIComponent(postTitle), [postTitle]);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!navigator.clipboard) {
      alert('Copie non supportée par votre navigateur');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(postUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.warn('Échec de la copie:', err);
      alert('Impossible de copier le lien');
    }
  };

  return (
    <div className="post-share">
      <span>Partager :</span>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
         target="_blank" rel="noopener noreferrer" className="share-btn twitter" aria-label="Partager sur Twitter">
        <i className="fab fa-twitter"></i>
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
         target="_blank" rel="noopener noreferrer" className="share-btn linkedin" aria-label="Partager sur LinkedIn">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <button onClick={handleCopyLink} className="share-btn copy-link" aria-label="Copier le lien">
        {isCopied ? 'Copié !' : <i className="fas fa-link"></i>}
      </button>
    </div>
  );
};

const PostDetailPage = () => {
  const { postSlug } = useParams<{ postSlug: string }>();

  // Trouve l'article actuel
  const post = allPosts.find((p) => p.slug === postSlug);

  // Filtre les articles publiés pour la navigation (mémorisé pour les performances)
  const publishedPosts = useMemo(() => allPosts.filter(p => p.published), []);
  const currentPublishedIndex = publishedPosts.findIndex(p => p.slug === postSlug);

  const prevPost = currentPublishedIndex > 0 ? publishedPosts[currentPublishedIndex - 1] : null;
  const nextPost = currentPublishedIndex < publishedPosts.length - 1 ? publishedPosts[currentPublishedIndex + 1] : null;

  // Remonte en haut de la page au changement d'article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postSlug]);

  if (!post) {
    return (
      <section className="page-header">
        <div className="container text-center">
          <h1 className="page-title">Article non trouvé</h1>
          <p className="page-subtitle">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
          <Link to="/blog" className="cta-button">Retour au blog</Link>
        </div>
      </section>
    );
  }

  if (!post.published) {
    return (
      <section className="page-header">
        <div className="container text-center">
          <h1 className="page-title">Article à venir</h1>
          <p className="page-subtitle">Cet article n'est pas encore publié. Revenez bientôt !</p>
          <Link to="/blog" className="cta-button">Retour au blog</Link>
        </div>
      </section>
    );
  }

  return (
    <article className="post-full animated-section visible">
      <div className="container post-container">
        <header className="post-full-header">
          <h1 className="post-full-title">{post.title}</h1>
          <div className="post-meta">
            <span><i className="fas fa-calendar-alt"></i> {new Date(post.date).toLocaleDateString('fr-FR')}</span>
            <span><i className="fas fa-user"></i> Par {post.author}</span>
            <span><i className="fas fa-clock"></i> {Math.ceil(post.content.length / 1000)} min de lecture</span>
          </div>
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
            ))}
          </div>
        </header>

        <div className="post-full-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

        <footer className="post-full-footer">
          <ShareButtons postTitle={post.title} postUrl={window.location.href} />
          <nav className="project-navigation">
            {prevPost && <Link to={`/blog/${prevPost.slug}`} className="prev-project">← Article Précédent</Link>}
            {nextPost && <Link to={`/blog/${nextPost.slug}`} className="next-project">Article Suivant →</Link>}
          </nav>
        </footer>
      </div>
    </article>
  );
};

export default PostDetailPage;