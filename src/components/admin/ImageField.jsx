import { useEffect, useId, useState } from 'react';
import { IMAGE_GUIDANCE, IMAGE_TYPES, validateImageFile } from '../../lib/imageUploads';

export default function ImageField({ kind, value, file, onFileChange, onRemove, disabled = false, required = false }) {
  const id = useId();
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [dimensions, setDimensions] = useState('');
  const guidance = IMAGE_GUIDANCE[kind];
  useEffect(() => {
    setDimensions('');
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const select = event => {
    const next = event.target.files?.[0];
    event.target.value = '';
    if (!next) return;
    try {
      validateImageFile(next);
      setError('');
      onFileChange(next);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-4">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        {guidance.label}{required ? ' *' : ' (optional)'}
      </label>
      <p id={`${id}-help`} className="text-sm text-gray-600 dark:text-gray-300">
        Recommended: <strong>{guidance.dimensions}</strong>.<br />
        JPG, PNG, or WebP · Maximum <strong>5 MB</strong> (5,000,000 bytes). Other dimensions are accepted; photos may be cropped to fit.
      </p>
      {(preview || value) && <img src={preview || value} alt={`${guidance.label} preview`} className="max-h-48 max-w-full rounded-lg object-contain" onLoad={event => setDimensions(`${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight} px`)} onError={() => setError('This photo cannot be displayed. Choose a valid photo file.')} />}
      {file && <p className="text-sm text-gray-600 dark:text-gray-300">{file.name} · {(file.size / 1_000_000).toFixed(2)} MB{dimensions && ` · ${dimensions}`} · Uploads when you save</p>}
      <input id={id} type="file" accept={Object.keys(IMAGE_TYPES).join(',')} onChange={select} disabled={disabled} aria-describedby={`${id}-help`} className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white disabled:opacity-50" />
      {(file || value) && <button type="button" disabled={disabled} onClick={() => { onFileChange(null); onRemove?.(); setError(''); }} className="text-sm text-red-600 dark:text-red-400">Remove photo</button>}
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
