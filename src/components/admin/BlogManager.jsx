import ContentManager from './ContentManager';
const initial = { title: '', slug: '', excerpt: '', content: '', author: '', category: 'Community', cover_image_url: '', status: 'draft', published_at: null };
const fields = [
  { name: 'title', label: 'Article title', required: true },
  { name: 'author', label: 'Author' },
  { name: 'category', label: 'Category' },
  { name: 'excerpt', label: 'Short summary', type: 'textarea' },
  { name: 'content', label: 'Full article', type: 'textarea', required: true },
];
export default function BlogManager({ posts, ...props }) {
  return <ContentManager {...props} title="Blog posts" singular="Article" items={posts} initial={initial} fields={fields} imageKind="blog" imageField="cover_image_url" />;
}
