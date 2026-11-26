// Shared field rules keep the browser form and server validation in sync.
export const applicationFields = {
  student: [
    { name: 'fullName', label: 'Full name', required: true, max: 120, autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', required: true, max: 254, autoComplete: 'email' },
    { name: 'college', label: 'College', required: true, max: 180, autoComplete: 'organization' },
    { name: 'yearOfStudy', label: 'Year of study', required: true, options: ['1st year', '2nd year', '3rd year', '4th year', '5th year or above', 'Postgraduate', 'Other'] },
    { name: 'motivation', label: 'Why do you want to test products?', required: true, type: 'textarea', max: 2000, hint: 'Tell us what interests you about trying new products and sharing feedback.' },
    { name: 'phone', label: 'Phone number', type: 'tel', max: 40, autoComplete: 'tel' },
    { name: 'interests', label: 'Areas of interest', max: 300, placeholder: 'For example: education, design, AI, finance' },
    { name: 'availability', label: 'Availability', max: 300, placeholder: 'For example: weekends, 2 hours a week' },
  ],
  startup: [
    { name: 'contactName', label: 'Founder or contact name', required: true, max: 120, autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, max: 254, autoComplete: 'email' },
    { name: 'startupName', label: 'Startup name', required: true, max: 180, autoComplete: 'organization' },
    { name: 'productLink', label: 'Product link', type: 'url', required: true, max: 1000, placeholder: 'https://your-product.com', hint: 'A product, demo or prototype link. Include https://.' },
    { name: 'productStage', label: 'Product stage', required: true, options: ['Prototype', 'MVP', 'Private beta', 'Public beta', 'Launched / early traction', 'Other'] },
    { name: 'testingGoals', label: 'What would you like tested?', type: 'textarea', required: true, max: 2000, hint: 'Describe the features, flows or questions you want feedback on.' },
    { name: 'testerProfile', label: 'Ideal tester profile', type: 'textarea', required: true, max: 2000, hint: 'Who is your product for? Share relevant interests, experience or needs.' },
    { name: 'phone', label: 'Phone number', type: 'tel', max: 40, autoComplete: 'tel' },
    { name: 'timeline', label: 'Desired timeline', max: 300, placeholder: 'For example: ready to start in January' },
    { name: 'notes', label: 'Additional notes', type: 'textarea', max: 2000 },
  ],
};

export function validateApplication(kind, input) {
  if (!Object.hasOwn(applicationFields, kind) || !input || typeof input !== 'object' || Array.isArray(input)) {
    return { values: {}, errors: { form: 'Please choose a valid application form.' } };
  }
  const values = {};
  const errors = {};
  for (const field of applicationFields[kind]) {
    const raw = input[field.name] ?? '';
    if (typeof raw !== 'string') {
      errors[field.name] = `Enter a valid ${field.label.toLowerCase()}.`;
      continue;
    }
    // Preserve multiline answers; remove control characters and never accept markup as HTML.
    const cleaned = Array.from(raw).filter(char => char.charCodeAt(0) >= 32 || char === '\n' || char === '\r' || char === '\t').join('');
    const value = (field.type === 'textarea' ? cleaned.replace(/\r\n?/g, '\n') : cleaned.replace(/\s+/g, ' ')).trim();
    values[field.name] = value;
    if (field.required && !value) errors[field.name] = `${field.label} is required.`;
    else if (raw.length > (field.max ?? 80)) errors[field.name] = `Use ${field.max ?? 80} characters or fewer.`;
    else if (value && field.options && !field.options.includes(value)) errors[field.name] = 'Choose an option from the list.';
    else if (value && field.type === 'email' && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) || /[\r\n]/.test(raw))) errors[field.name] = 'Enter a valid email address.';
    else if (value && field.type === 'url') {
      try {
        const url = new URL(value);
        if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error('Invalid URL');
      } catch {
        errors[field.name] = 'Enter a full http:// or https:// product link without login details.';
      }
    }
  }
  return { values, errors };
}

export async function submitApplication(payload, fetcher = fetch) {
  const response = await fetcher('/api/product-testing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  let result;
  try { result = await response.json(); } catch { throw new Error('We could not send your application. Your answers are still here. Please try again.'); }
  if (!response.ok || result?.success !== true) {
    const error = new Error(result?.message || 'We could not send your application. Please try again.');
    error.fields = result?.errors;
    throw error;
  }
  return result;
}
