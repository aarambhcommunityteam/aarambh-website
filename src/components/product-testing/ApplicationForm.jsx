import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { applicationFields, submitApplication, validateApplication } from '../../lib/productTesting';

export default function ApplicationForm({ kind }) {
  const fields = applicationFields[kind];
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(field => [field.name, ''])));
  const [startedAt] = useState(Date.now);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const notice = useRef(null);
  const student = kind === 'student';

  async function submit(event) {
    event.preventDefault();
    if (busy.current || status === 'success') return;
    const form = event.currentTarget;
    const validation = validateApplication(kind, values);
    setErrors(validation.errors);
    setMessage('');
    if (Object.keys(validation.errors).length) {
      setStatus('invalid');
      setMessage('Please check the highlighted fields.');
      form.elements.namedItem(Object.keys(validation.errors)[0])?.focus();
      return;
    }
    busy.current = true;
    setStatus('sending');
    try {
      await submitApplication({ kind, fields: values, startedAt, website });
      setStatus('success');
      setMessage(student
        ? 'Your tester application has been sent to AARAMBH. We’ll review your details and contact you by email about suitable testing opportunities.'
        : 'Your pilot application has been sent to AARAMBH. We’ll review your product and contact you by email if it is a fit for the first pilot.');
    } catch (error) {
      setStatus('error');
      setErrors(error.fields || {});
      setMessage(error.name === 'TimeoutError' || error.name === 'TypeError'
        ? 'We could not confirm your application was sent. Your answers are still here. Please try again.'
        : error.message);
    } finally {
      busy.current = false;
      // The persistent live region is focusable even before React paints the result.
      notice.current?.focus();
    }
  }

  return (
    <form className="pt-form" onSubmit={submit} noValidate aria-label={student ? 'Student tester application' : 'Startup pilot application'} aria-busy={status === 'sending'}>
      <div className="pt-form-heading">
        <span className="pt-eyebrow">{student ? 'Your next first step' : 'Tell us what you’re building'}</span>
        <h2>{student ? 'Apply to be a tester' : 'Apply for the first pilot'}</h2>
        <p>Fields marked <span aria-hidden="true">*</span> are required. Everything else is optional.</p>
      </div>
      <fieldset disabled={status === 'sending' || status === 'success'}>
        <legend className="sr-only">{student ? 'Student details' : 'Startup and product details'}</legend>
        <div className="pt-form-grid">
          {fields.map(field => {
            const id = `${kind}-${field.name}`;
            const description = [field.hint && `${id}-hint`, errors[field.name] && `${id}-error`].filter(Boolean).join(' ') || undefined;
            const props = {
              id, name: field.name, required: field.required, value: values[field.name],
              maxLength: field.max, autoComplete: field.autoComplete, placeholder: field.placeholder,
              'aria-invalid': errors[field.name] ? true : undefined, 'aria-describedby': description,
              onChange: event => {
                setValues(previous => ({ ...previous, [field.name]: event.target.value }));
                setErrors(previous => ({ ...previous, [field.name]: undefined }));
              },
            };
            return (
              <div className={`pt-field ${field.type === 'textarea' ? 'pt-field-wide' : ''}`} key={field.name}>
                <label htmlFor={id}>{field.label} {field.required ? <span aria-hidden="true">*</span> : <span className="pt-optional">(optional)</span>}</label>
                {field.hint && <p className="pt-field-hint" id={`${id}-hint`}>{field.hint}</p>}
                {field.options ? (
                  <select {...props}><option value="">Select an option</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
                ) : field.type === 'textarea' ? <textarea {...props} rows={4} /> : <input {...props} type={field.type || 'text'} />}
                {errors[field.name] && <p className="pt-field-error" id={`${id}-error`}>{errors[field.name]}</p>}
              </div>
            );
          })}
        </div>
        <div className="pt-honeypot" aria-hidden="true">
          <label htmlFor={`${kind}-website`}>Leave this field empty</label>
          <input id={`${kind}-website`} name="website" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </div>
        <p className="pt-form-privacy">Your details will be emailed to the AARAMBH team to review your application and contact you about this program.</p>
        <button className="pt-button" type="submit">
          {status === 'sending' ? <><LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> Sending application…</>
            : status === 'success' ? <><CheckCircle2 size={19} aria-hidden="true" /> Application sent</>
              : <>{status === 'error' ? 'Try sending again' : student ? 'Submit Tester Application' : 'Submit Pilot Application'}<ArrowRight size={19} aria-hidden="true" /></>}
        </button>
      </fieldset>
      <div className={`pt-notice ${message ? `pt-notice-${status}` : ''}`} ref={notice} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
        {message && <><strong>{status === 'success' ? 'Application sent' : 'Please review your application'}</strong><p>{message}</p></>}
      </div>
    </form>
  );
}
