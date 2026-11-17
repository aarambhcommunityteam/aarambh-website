import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Images } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!supabase) throw new Error('Gallery unavailable');
        const { data, error: queryError } = await supabase.from('gallery_items')
          .select('id,title,description,category,image_url,status,order_index')
          .eq('status', 'published').order('order_index', { ascending: true }).order('created_at', { ascending: false });
        if (queryError) throw queryError;
        if (active) setItems(data || []);
      } catch { if (active) setError('Photos are temporarily unavailable. Please try again later.'); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, []);
  return <div className="min-h-screen bg-white dark:bg-gray-900">
    <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-5 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Event Gallery</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">Moments, memories, and milestones from the AARAMBH community.</p>
    </section>
    <section className="max-w-7xl mx-auto px-5 py-16">
      {loading ? <p role="status" className="text-center text-gray-500">Loading photos…</p>
        : error ? <p role="alert" className="text-center text-red-600">{error}</p>
        : items.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => <figure key={item.id} className="overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            {item.image_url && <a href={item.image_url} target="_blank" rel="noopener noreferrer" aria-label={'View full photo: ' + item.title}><img src={item.image_url} alt={item.description || item.title} loading="lazy" className="w-full aspect-[4/3] object-cover" /></a>}
            <figcaption className="p-5"><p className="text-sm text-blue-600 dark:text-blue-400">{item.category}</p><h2 className="mt-1 font-bold text-xl dark:text-white">{item.title}</h2>{item.description && <p className="mt-2 text-gray-600 dark:text-gray-300">{item.description}</p>}</figcaption>
          </figure>)}
        </div>
        : <div className="max-w-2xl mx-auto text-center py-12"><Images className="w-16 h-16 text-blue-500 mx-auto mb-6" /><h2 className="text-3xl font-bold dark:text-white mb-4">Our Journey Starts Here</h2><p className="text-gray-600 dark:text-gray-400">We're preparing to share moments from AARAMBH events, workshops, collaborations, and community activities. Check back as our journey unfolds.</p></div>}
    </section>
  </div>;
}
