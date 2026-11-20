import { lazy, Suspense, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { contentError } from '../../lib/contentPayloads';
import { saveWithImages } from '../../lib/imageUploads';
import ImageField from './ImageField';

const ArticleEditor = lazy(() => import('./ArticleEditor'));

const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white';

export default function ContentManager({ title, singular, items, initial, fields, imageKind, imageField, imageRequired = false, onCreate, onEdit, onDelete, isLoading }) {
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const busy = useRef(false);

  const open = item => {
    setForm({ ...initial, ...item });
    setEditingId(item?.id || null);
    setFile(null);
    setError('');
    setMessage('');
  };
  const close = () => { if (!busy.current) { setForm(null); setFile(null); setError(''); } };
  const save = async event => {
    event.preventDefault();
    if (busy.current) return;
    setError('');
    if (!form.title.trim()) { setError('Enter a title.'); return; }
    if (fields.some(field => field.type === 'article' && field.required && !form[field.name]?.trim())) { setError('Enter the full article before saving.'); return; }
    if (imageRequired && !file && !form[imageField]) { setError('Choose a photo before saving.'); return; }
    for (const field of fields.filter(field => field.type === 'url')) {
      if (!form[field.name]) continue;
      try {
        if (!['http:', 'https:'].includes(new URL(form[field.name]).protocol)) throw new Error();
      } catch { setError(`Enter a valid https:// or http:// link for ${field.label.toLowerCase()}.`); return; }
    }
    busy.current = true;
    setSaving(true);
    try {
      await saveWithImages(supabase, form, [{ file, kind: imageKind, field: imageField }], payload => editingId ? onEdit(editingId, payload) : onCreate(payload));
      setMessage(`${singular} saved${form.status === 'published' ? ' and published.' : ' as a draft. Publish it when you want visitors to see it.'}`);
      setForm(null);
      setFile(null);
    } catch (err) { setError(contentError(err)); }
    finally { busy.current = false; setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2><p className="mt-2 text-gray-500">Create, edit, and publish community content.</p></div>
        {!form && <button onClick={() => open()} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"><Plus size={18} />Add {singular}</button>}
      </div>
      {message && <p role="status" className="rounded-xl bg-green-50 dark:bg-green-900/30 p-4 text-green-800 dark:text-green-200">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 dark:bg-red-900/30 p-4 text-red-700 dark:text-red-200">{error}</p>}
      {form && (
        <form onSubmit={save} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 sm:p-8">
          <fieldset disabled={saving} className="space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold dark:text-white">{editingId ? 'Edit' : 'Add'} {singular}</h3><button type="button" aria-label="Close form" onClick={close}><X /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(field => field.type === 'article' ? <Suspense key={field.name} fallback={<p role="status">Loading article editor…</p>}><ArticleEditor value={form[field.name]} onChange={value => setForm({ ...form, [field.name]: value })} required={field.required} /></Suspense> : <label key={field.name} className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${field.type === 'textarea' || field.name === 'title' ? 'sm:col-span-2' : ''}`}>
                <span className="mb-2 block">{field.label}{field.required && ' *'}</span>
                {field.options ? <select className={inputClass} value={form[field.name] ?? ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })}>{field.options.map(option => <option key={option} value={option}>{option}</option>)}</select>
                : field.type === 'textarea' ? <textarea className={inputClass} rows={field.name === 'content' ? 12 : 3} required={field.required} value={form[field.name] ?? ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} />
                : <input className={inputClass} type={field.type || 'text'} required={field.required} value={form[field.name] ?? ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} />}
              </label>)}
            </div>
            <ImageField kind={imageKind} value={form[imageField]} file={file} onFileChange={setFile} onRemove={() => setForm({ ...form, [imageField]: '' })} disabled={saving} required={imageRequired} />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Publication status
              <select className={`${inputClass} mt-2`} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft — visible to the team only</option><option value="published">Published — visible on the website</option>
              </select>
            </label>
            <div className="flex gap-3 justify-end"><button type="button" onClick={close} className="rounded-xl border border-gray-300 px-5 py-3 dark:text-white">Cancel</button><button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving photo and content…' : 'Save ' + singular}</button></div>
          </fieldset>
        </form>
      )}
      {items.length === 0 && !form && <p className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">{isLoading ? 'Loading…' : `No ${title.toLowerCase()} yet. Add your first ${singular.toLowerCase()}.`}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map(item => <article key={item.id} className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">{item[imageField] ? <img src={item[imageField]} alt={item.title} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}</div>
          <div className="min-w-0 flex-1"><span className={`text-xs font-semibold ${item.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>{item.status === 'published' ? 'Published' : 'Draft'}</span><h3 className="font-bold text-lg dark:text-white break-words">{item.title}</h3><p className="text-sm text-gray-500 line-clamp-2">{item.excerpt || item.description || item.category}</p>
            <div className="flex gap-4 mt-3"><button disabled={saving} onClick={() => open(item)} className="inline-flex gap-1 items-center text-blue-600 text-sm"><Pencil size={15} />Edit</button><button disabled={saving} onClick={async () => { try { await onDelete(item.id); } catch (err) { setError(contentError(err)); } }} className="inline-flex gap-1 items-center text-red-600 text-sm"><Trash2 size={15} />Delete</button></div>
          </div>
        </article>)}
      </div>
    </div>
  );
}
