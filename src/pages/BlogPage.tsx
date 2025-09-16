import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allPosts } from '../data/posts';
import './BlogPage.css';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 3;

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return ['all', ...Array.from(tags).sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedTag !== 'all') {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(lowercasedTerm) ||
        post.excerpt.toLowerCase().includes(lowercasedTerm)
      );
    }
    return posts;
  }, [searchTerm, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Notre Blog</h1>
          <p className="page-subtitle">Articles, tutoriels et réflexions sur la modélisation de données et Merise.</p>
        </div>
      </section>

      <section className="blog-section animated-section visible">
        <div className="container">
          <div className="blog-controls">
            <div className="tag-filter-container">
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag === 'all' ? 'Tous les articles' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
            <div className="blog-search-container">
              <form role="search" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Rechercher par mot-clé..."
                  aria-label="Rechercher des articles de blog"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
          </div>

          <div className="post-list">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map(post => (
                <article key={post.id} className="post-preview">
                  <div className="post-preview-content">
                    <h2><Link to={post.published ? `/blog/${post.slug}` : '#'} className={!post.published ? 'disabled' : ''}>{post.title}</Link></h2>
                    <div className="post-meta">
                      <span><i className="fas fa-calendar-alt"></i> {post.date}</span>
                      <span><i className="fas fa-user"></i> Par {post.author}</span>
                    </div>
                    <p>{post.excerpt}</p>
                    <div className="post-tags">
                      {post.tags.map(tag => <span key={tag} className="tag">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>)}
                    </div>
                    <Link to={post.published ? `/blog/${post.slug}` : '#'} className={`cta-button secondary ${!post.published ? 'disabled' : ''}`} title={!post.published ? 'Article à venir' : undefined} onClick={!post.published ? (e) => e.preventDefault() : undefined}>
                      Lire la suite
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p id="no-results-message" style={{ textAlign: 'center', marginTop: '2rem' }}>
                Aucun article ne correspond à votre sélection.
              </p>
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </section>
    </>
  );
};

export default BlogPage;