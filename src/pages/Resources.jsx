import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Search, BookOpen } from 'lucide-react';
import { pageTransition } from '../utils/animations';

const fallbackCategories = [
  'Tutorial', 'Documentation', 'Tool', 'Article',
  'Video', 'Course', 'Book', 'Template', 'Other'
];

export default function Resources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const { data, error } = await supabase
          .from('resources')
          .select('id,title,description,category,resource_type,resource_url,cover_image_url,status,order_index,created_at')
          .eq('status', 'published')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (isMounted) setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        if (isMounted) setLoadError('Unable to load resources right now. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    return () => { isMounted = false; };
  }, []);

  const categories = useMemo(() => {
    const fromDatabase = [...new Set(resources.map(r => r.category).filter(Boolean))];
    const merged = [...new Set([...fallbackCategories, ...fromDatabase])];
    return ['All', ...merged];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return resources.filter(resource => {
      const categoryMatches = selectedCategory === 'All' || resource.category === selectedCategory;
      const searchMatches = !query || [
        resource.title,
        resource.description,
        resource.category,
        resource.resource_type
      ].some(value => (value || '').toLowerCase().includes(query));
      return categoryMatches && searchMatches;
    });
  }, [resources, selectedCategory, searchQuery]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative"
    >
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <section className="relative overflow-hidden min-h-[50vh] flex items-center bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-google-blue/10 to-transparent rounded-full blur-3xl opacity-40 dark:opacity-10"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -60, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-google-green/10 to-transparent rounded-full blur-3xl opacity-40 dark:opacity-10"
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
            <BookOpen className="w-4 h-4 text-google-blue" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Learning Resources</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Resources & <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-green to-google-yellow">Learning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Curated collection of tutorials, tools, and resources to help you learn and grow as a developer.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12 space-y-6">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-google-blue/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-google-blue text-white shadow-lg shadow-google-blue/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-google-blue/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-56 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="text-center py-20 text-red-600 dark:text-red-400">{loadError}</div>
        ) : filteredResources.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {resources.length === 0 ? 'No published resources yet' : 'No resources found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {resources.length === 0
                ? 'Published learning resources will appear here once they are added.'
                : 'Try adjusting your filters or search query.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredResources.map(resource => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/resources/${resource.id}`)}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-56 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  {resource.cover_image_url ? (
                    <img
                      src={resource.cover_image_url}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-4xl font-bold opacity-30">{resource.title?.charAt(0) || 'R'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-bold backdrop-blur-md shadow-sm border border-white/20 text-white ${
                      resource.category === 'Video' ? 'bg-red-500/80' :
                      resource.category === 'Course' ? 'bg-blue-500/80' : 'bg-gray-900/60'
                    }`}>
                      {resource.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-green-200 text-green-600 dark:border-green-900/30 dark:text-green-400">
                      {(resource.resource_type || 'link').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white group-hover:text-google-blue transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                    {resource.description || 'Explore this learning resource.'}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : ''}
                    </span>
                    <span className="text-xs font-semibold text-google-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-google-blue to-google-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
