import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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

  return <article className="max-w-3xl mx-auto px-5 py-24 text-gray-900 dark:text-white">
    <Link to="/blog" className="text-blue-600 dark:text-blue-400">← Back to Journal</Link>
    {loading ? <p className="py-16" role="status">Loading article…</p> : error ? <p className="py-16" role="alert">{error}</p> : post && <>
      <p className="mt-10 text-sm text-blue-600 dark:text-blue-400">{post.category}</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold leading-tight">{post.title}</h1>
      <p className="my-5 text-gray-500">{post.author}{post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}</p>
      {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="w-full rounded-2xl my-8" />}
      {post.excerpt && <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">{post.excerpt}</p>}
      <div className="whitespace-pre-wrap break-words text-lg leading-8">{post.content}</div>
    </>}
  </article>;
}
