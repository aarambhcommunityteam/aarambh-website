import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../components/blog/article.css';

const ArticleLayout = lazy(() => import('../components/blog/ArticleLayout'));

export default function BlogDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!supabase) throw new Error('Articles are temporarily unavailable.');
        const { data, error: queryError } = await supabase.from('blog_posts')
          .select('id,title,excerpt,content,author,published_at,category,cover_image_url')
          .eq('id', postId).eq('status', 'published').maybeSingle();
        if (queryError) throw queryError;
        if (active) { setPost(data); if (!data) setError('Article not found.'); }
      } catch { if (active) setError('Unable to load this article. Please try again later.'); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [postId]);

  if (!loading && !error && post) return <Suspense fallback={<div className="journal-page"><div className="journal-shell py-16" role="status">Loading article…</div></div>}><ArticleLayout post={post} /></Suspense>;

  return <div className="journal-page"><div className="journal-shell">
    <Link to="/blog" className="journal-back">← Back to Journal</Link>
    {loading ? <p className="py-16" role="status">Loading article…</p> : <p className="py-16" role="alert">{error || 'Article not found.'}</p>}
  </div></div>;
}
