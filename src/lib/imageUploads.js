export const MAX_IMAGE_BYTES = 5_000_000;
export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const IMAGE_GUIDANCE = {
  member: { label: 'Member photo', dimensions: '800 × 800 px (square)', bucket: 'member-profiles' },
  blog: { label: 'Blog cover photo', dimensions: '1200 × 675 px (16:9)', bucket: 'blog-images' },
  resource: { label: 'Resource cover photo', dimensions: '1200 × 675 px (16:9)', bucket: 'resource-thumbnails' },
  gallery: { label: 'Gallery photo', dimensions: '1600 × 1200 px (4:3)', bucket: 'gallery-images' },
  eventCover: { label: 'Event cover photo', dimensions: '1200 × 675 px (16:9)', bucket: 'event-images' },
  eventBanner: { label: 'Event banner photo', dimensions: '1920 × 720 px (8:3)', bucket: 'event-images' },
};

export function validateImageFile(file) {
  if (!file || !IMAGE_TYPES[file.type]) throw new Error('Choose a JPG, PNG, or WebP photo.');
  if (file.size === 0) throw new Error('This file is empty. Choose another photo.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('This photo is too large. Maximum size: 5 MB (5,000,000 bytes).');
}

// Upload first, then save the row once. Never overwrite/delete the existing photo.
// If saving fails, remove only new uploads from this attempt and retain form data.
export async function saveWithImages(client, input, images, save) {
  const selected = images.filter(image => image.file);
  selected.forEach(image => validateImageFile(image.file));
  const payload = { ...input };
  const uploaded = [];
  let saving = false;
  try {
    if (selected.length) {
      const { data, error } = await client.auth.getUser();
      if (error || !data?.user) throw new Error('Your session has expired. Sign in again before uploading photos.');
      for (const { file, kind, field } of selected) {
        const bucket = IMAGE_GUIDANCE[kind].bucket;
        const path = `${data.user.id}/${crypto.randomUUID()}.${IMAGE_TYPES[file.type]}`;
        const storage = client.storage.from(bucket);
        const { error: uploadError } = await storage.upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false });
        if (uploadError) {
          if (/bucket.*not found/i.test(uploadError.message)) throw new Error('Photo storage is not ready. The founder needs to apply the admin content setup SQL in Supabase. Your photo is still selected.');
          throw uploadError;
        }
        uploaded.push({ bucket, path });
        payload[field] = storage.getPublicUrl(path).data.publicUrl;
      }
    }
    saving = true;
    return await save(payload);
  } catch (error) {
    // A lost response can follow a committed save. Keep the new photos when
    // the outcome is unknown so a successful row cannot reference deleted files.
    if (!saving || error?.code) {
      await Promise.allSettled(uploaded.map(({ bucket, path }) => client.storage.from(bucket).remove([path])));
    }
    throw error;
  }
}
