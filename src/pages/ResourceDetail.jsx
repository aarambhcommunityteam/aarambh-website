import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ExternalLink, ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { pageTransition, fadeInUp } from '../utils/animations';

export default function ResourceDetail() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchResource = async () => {
      try {
        setLoading(true);
        setError('');

        // The current resources table has no slug column. The route segment is the row UUID.
        const { data, error: fetchError } = await supabase
          .from('resources')
          .select('id,title,description,category,resource_type,resource_url,cover_image_url,status,order_index,created_at')
          .eq('id', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          if (isMounted) setError('Resource not found');
          return;
        }

        if (isMounted) setResource(data);
      } catch (err) {
        console.error('Error fetching resource:', err);
        if (isMounted) setError('Unable to load this resource. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResource();
    return () => { isMounted = false; };
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage('Link copied to clipboard!');
    } catch {
      setShareMessage('Unable to copy the link on this device.');
    }
    window.setTimeout(() => setShareMessage(''), 2500);
  };

  const getCategoryColor = category => {
    const colors = {
      Tutorial: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      Documentation: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      Tool: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      Article: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      Video: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      Course: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      Book: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      Template: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      Other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-google-blue" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || 'Resource not found'}</h2>
          <Link to="/resources" className="text-google-blue hover:text-google-blue/80 font-medium inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <section className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/resources" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-google-blue mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Link>

          <motion.div
            variants={fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
              {resource.cover_image_url ? (
                <img src={resource.cover_image_url} alt={resource.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-9xl font-bold">
                  {resource.title?.charAt(0) || 'R'}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-6 left-6 flex gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-full font-semibold shadow-lg ${getCategoryColor(resource.category)}`}>
                  {resource.category || 'General'}
                </span>
                <span className="px-4 py-2 rounded-full font-semibold shadow-lg bg-white/90 text-gray-800">
                  {(resource.resource_type || 'link').replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {resource.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 dark:text-gray-400">
                <button onClick={handleShare} className="flex items-center gap-2 hover:text-google-blue transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>
                {resource.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">
                      {new Date(resource.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {shareMessage && (
                <p role="status" className="text-sm text-google-blue mb-5">{shareMessage}</p>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {resource.description || 'No description has been added for this resource yet.'}
                </div>
              </div>

              {resource.resource_url ? (
                <a
                  href={resource.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-google-blue to-google-green hover:shadow-xl text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] text-lg"
                >
                  <span>Visit Resource</span>
                  <ExternalLink className="w-6 h-6" />
                </a>
              ) : (
                <p className="text-sm text-gray-500">A resource link has not been added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
