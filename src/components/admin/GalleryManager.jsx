import ContentManager from './ContentManager';
const initial = { title: '', description: '', category: 'Community', image_url: '', status: 'draft', order_index: 0 };
const fields = [
  { name: 'title', label: 'Photo title', required: true },
  { name: 'category', label: 'Category' },
  { name: 'order_index', label: 'Display order', type: 'number' },
  { name: 'description', label: 'Photo caption', type: 'textarea' },
];
export default function GalleryManager({ galleryItems, ...props }) {
  return <ContentManager {...props} title="Gallery" singular="Photo" items={galleryItems} initial={initial} fields={fields} imageKind="gallery" imageField="image_url" imageRequired />;
}
