// Writable fields verified against the connected AARAMBH database.
const fields = {
  blog_posts: ['title', 'slug', 'excerpt', 'content', 'author', 'published_at', 'category', 'cover_image_url', 'status'],
  gallery_items: ['title', 'description', 'category', 'status', 'image_url', 'event_id', 'order_index'],
  resources: ['title', 'description', 'category', 'resource_type', 'resource_url', 'cover_image_url', 'status', 'order_index'],
  members: ['name', 'email', 'profile_image_url', 'linkedin_url', 'github_url', 'x_url', 'instagram_url', 'bio', 'team_name', 'position', 'display_order', 'is_published'],
  events: ['title', 'slug', 'category', 'status', 'description', 'date', 'end_date', 'time', 'location', 'cover_image_url', 'banner_image_url', 'registration_link', 'color', 'featured', 'tags'],
};

export function contentPayload(table, input) {
  if (!fields[table]) throw new Error('Unsupported content type.');
  const data = { ...input };
  if (table === 'members' && input.is_active !== undefined) data.is_published = input.is_active;
  const payload = Object.fromEntries(fields[table].filter(key => data[key] !== undefined).map(key => [key, data[key]]));
  for (const key of ['title', 'name', 'email', 'slug']) {
    if (typeof payload[key] === 'string') payload[key] = payload[key].trim();
  }
  for (const key of ['date', 'end_date', 'time', 'published_at', 'event_id', 'slug']) {
    if (payload[key] === '') payload[key] = null;
  }
  for (const key of ['display_order', 'order_index']) {
    if (key in payload) payload[key] = Number(payload[key]) || 0;
  }
  if (table === 'blog_posts') {
    if (!payload.slug && payload.title) {
      const prefix = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'article';
      payload.slug = `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
    }
    if (payload.status === 'published' && !payload.published_at) payload.published_at = new Date().toISOString();
  }
  return payload;
}

export function eventPayload(input) {
  return {
    ...contentPayload('events', input),
    timeline: (input.timeline || []).map((item, index) => ({
      title: item.title, date: item.date || null, time: item.time || null,
      description: item.description || '', label: item.label || '', order_index: index,
    })),
    themes: (input.themes || []).map(theme => theme.trim()).filter(Boolean),
    prizes: (input.prizes || []).map((item, index) => ({
      position: item.position, amount: item.amount || '', description: item.description || '',
      icon: item.icon || null, order_index: index,
    })),
  };
}

export function contentError(error) {
  if (/fetch|network|connection/i.test(error?.message || '')) {
    return 'The connection was interrupted. Refresh the list to check whether the item was saved before trying again. Your form has been kept.';
  }
  if (error?.code === '42501' || /row.level security/i.test(error?.message || '')) {
    return 'Your account does not have permission to save this item. Ask the founder to check your team role and database permissions.';
  }
  if (error?.code === '23505') return 'An item with these details already exists. Check the title, link slug, or member email.';
  if (error?.code === 'PGRST202') return 'Event saving needs the admin content setup SQL applied in Supabase. Your form has been kept so you can retry.';
  return error?.message || 'Unable to save. Check your connection and try again.';
}
