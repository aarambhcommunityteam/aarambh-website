import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ArticleContent from './ArticleContent';

export default function ArticleLayout({ post }) {
  const published = post.published_at ? new Date(post.published_at) : null;
  const validDate = published && !Number.isNaN(published.getTime());

  return (
    <div className="journal-page">
      <article className="journal-shell" aria-labelledby="article-title">
        <Link to="/blog" className="journal-back"><ArrowLeft size={16} aria-hidden="true" /> Back to Journal</Link>
        <header className="journal-header">
          {post.cover_image_url && (
            <div className="journal-cover">
              <img src={post.cover_image_url} alt={post.title} width="1200" height="675" fetchPriority="high" />
            </div>
          )}
          <div className="journal-heading">
            {post.category && <p className="journal-category">{post.category}</p>}
            <h1 id="article-title" className="journal-title">{post.title}</h1>
            {(post.author || validDate) && (
              <div className="journal-meta">
                {post.author && <span className="journal-author">By {post.author}</span>}
                {post.author && validDate && <span className="journal-meta-dot" aria-hidden="true">·</span>}
                {validDate && <time dateTime={published.toISOString()}>{published.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}</time>}
              </div>
            )}
          </div>
        </header>
        {post.excerpt && (
          <aside className="journal-summary" aria-label="Article summary">
            <span className="journal-summary-label">In brief</span>
            <p>{post.excerpt}</p>
          </aside>
        )}
        <section className="journal-body" aria-label="Full article">
          <ArticleContent content={post.content} headerTitle={post.title} />
        </section>
        <div className="journal-end"><Link to="/blog" className="journal-back"><ArrowLeft size={16} aria-hidden="true" /> Explore the Journal</Link></div>
      </article>
    </div>
  );
}
