import test from 'node:test';
import assert from 'node:assert/strict';
import { contentPayload, eventPayload } from '../src/lib/contentPayloads.js';
import { MAX_IMAGE_BYTES, validateImageFile, saveWithImages } from '../src/lib/imageUploads.js';

test('blog saves match the current schema without legacy author/date/image fields', () => {
  const data = contentPayload('blog_posts', {
    id: 'existing', title: ' Test article ', slug: 'test-article', status: 'published', content: 'Article body',
    cover_image_url: 'https://example.com/photo.jpg', created_by: 'old-admin-id', date: '', image_url: '', read_time: '', created_at: 'yesterday',
  });
  assert.equal(data.title, 'Test article');
  assert.equal(data.slug, 'test-article');
  assert.equal(data.cover_image_url, 'https://example.com/photo.jpg');
  assert.ok(data.published_at);
  for (const key of ['id', 'created_by', 'date', 'image_url', 'read_time', 'created_at']) assert.ok(!(key in data));
});

test('member hiding is preserved when saving a photo and publication maps correctly', () => {
  assert.deepEqual(contentPayload('members', { id: 'm', name: 'Jane', is_active: false, is_published: true, display_order: '4' }), { name: 'Jane', display_order: 4, is_published: false });
  assert.equal(contentPayload('members', { is_active: true }).is_published, true);
});

test('optional event dates are null and child rows do not send legacy fields', () => {
  const data = eventPayload({ title: 'Event', date: '', end_date: '', time: '', created_by: 'bad', timeline: [{ id: 'old', title: 'Welcome', date: '', time: '', created_by: 'bad' }], themes: [' Theme ', ''], prizes: [{ position: 'First', created_by: 'bad' }] });
  assert.equal(data.date, null);
  assert.equal(data.timeline[0].date, null);
  assert.deepEqual(data.themes, ['Theme']);
  assert.ok(!JSON.stringify(data).includes('created_by'));
  assert.ok(!('id' in data.timeline[0]));
});

test('resources and gallery omit unsupported columns', () => {
  assert.deepEqual(contentPayload('resources', { title: 'Tool', order_index: '3', created_by: 'bad', slug: 'old' }), { title: 'Tool', order_index: 3 });
  assert.deepEqual(contentPayload('gallery_items', { title: 'Moment', date: 'Jan', event_id: '', status: 'published' }), { title: 'Moment', status: 'published', event_id: null });
});

test('photo validation enforces the displayed size and supported formats', () => {
  validateImageFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES });
  validateImageFile({ type: 'image/png', size: 1 });
  validateImageFile({ type: 'image/webp', size: 1 });
  assert.throws(() => validateImageFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }), /5 MB/);
  assert.throws(() => validateImageFile({ type: 'image/jpeg', size: 0 }), /empty/);
  for (const type of ['image/svg+xml', 'image/gif', 'image/heic', 'text/html']) assert.throws(() => validateImageFile({ type, size: 10 }), /JPG, PNG, or WebP/);
});

function mockClient({ failUploadAt = 0, signedIn = true } = {}) {
  const calls = { uploads: [], removed: [] };
  return {
    calls,
    auth: { getUser: async () => ({ data: { user: signedIn ? { id: 'user-id' } : null } }) },
    storage: { from: bucket => ({
      upload: async (path, file, options) => { calls.uploads.push({ bucket, path, file, options }); return { error: calls.uploads.length === failUploadAt ? new Error('Upload refused') : null }; },
      getPublicUrl: path => ({ data: { publicUrl: `https://storage.example/${bucket}/${path}` } }),
      remove: async paths => { calls.removed.push({ bucket, paths }); return { error: null }; },
    }) },
  };
}
const file = { type: 'image/jpeg', size: 100, name: '../../dangerous.html' };
const images = [{ file, kind: 'blog', field: 'cover_image_url' }];

test('an uploaded photo is saved once using a unique, safe path', async () => {
  const client = mockClient();
  let saves = 0;
  const result = await saveWithImages(client, { title: 'Article' }, images, async data => { saves++; assert.match(data.cover_image_url, /blog-images\/user-id\/[a-f0-9-]+\.jpg$/); return { id: 'saved' }; });
  assert.equal(saves, 1);
  assert.equal(result.id, 'saved');
  assert.equal(client.calls.uploads[0].options.upsert, false);
  assert.deepEqual(client.calls.removed, []);
});

test('a rejected database save removes only newly uploaded files', async () => {
  const client = mockClient();
  const input = { cover_image_url: 'existing-photo.jpg' };
  await assert.rejects(saveWithImages(client, input, images, async () => { throw Object.assign(new Error('Denied'), { code: '42501' }); }), /Denied/);
  assert.equal(input.cover_image_url, 'existing-photo.jpg');
  assert.deepEqual(client.calls.removed[0].paths, [client.calls.uploads[0].path]);
});

test('a second failed upload cleans the first and never saves the event', async () => {
  const client = mockClient({ failUploadAt: 2 });
  let saved = false;
  await assert.rejects(saveWithImages(client, {}, [
    { file, kind: 'eventCover', field: 'cover_image_url' }, { file, kind: 'eventBanner', field: 'banner_image_url' },
  ], async () => { saved = true; }), /Upload refused/);
  assert.equal(saved, false);
  assert.equal(client.calls.removed.length, 1);
});

test('a lost save response cannot delete a photo that may already be in use', async () => {
  const client = mockClient();
  await assert.rejects(saveWithImages(client, {}, images, async () => { throw new TypeError('Failed to fetch'); }), /fetch/);
  assert.deepEqual(client.calls.removed, []);
});

test('expired sessions and oversized photos do not upload or save', async () => {
  const client = mockClient({ signedIn: false });
  await assert.rejects(saveWithImages(client, {}, images, async () => assert.fail()), /session has expired/);
  await assert.rejects(saveWithImages(client, {}, [{ ...images[0], file: { ...file, size: MAX_IMAGE_BYTES + 1 } }], async () => assert.fail()), /too large/);
  assert.equal(client.calls.uploads.length, 0);
});

test('saving without a replacement preserves the existing image', async () => {
  const data = await saveWithImages(null, { cover_image_url: 'existing.jpg' }, [], async value => value);
  assert.equal(data.cover_image_url, 'existing.jpg');
});
