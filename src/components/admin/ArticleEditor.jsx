import { useId, useState } from 'react';
import ArticleContent from '../blog/ArticleContent';

export default function ArticleEditor({ value, onChange, required }) {
  const id = useId();
  const [preview, setPreview] = useState(false);
  return (
    <div className="sm:col-span-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">Full article{required && ' *'}</label>
        <button type="button" onClick={() => setPreview(!preview)} aria-expanded={preview} aria-controls={`${id}-preview`} className="rounded-lg border border-blue-400/40 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-300">{preview ? 'Hide preview' : 'Preview formatting'}</button>
      </div>
      <p id={`${id}-help`} className="mb-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
        Use #, ##, or ### for headings, **bold**, *italic*, - for bullets, and 1. for numbered lists. Leave a blank line between paragraphs. Existing HTML is supported too.
      </p>
      <textarea id={id} value={value ?? ''} onChange={event => onChange(event.target.value)} required={required} rows={14} aria-describedby={`${id}-help`} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 font-mono text-sm leading-7 text-gray-900 dark:text-white" />
      {preview && <div id={`${id}-preview`} className="journal-editor-preview" role="region" aria-label="Article formatting preview">{value ? <ArticleContent content={value} /> : <p className="text-gray-400">Write your article above to preview its formatting.</p>}</div>}
    </div>
  );
}
