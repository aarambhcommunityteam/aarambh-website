import ContentManager from './ContentManager';
const initial = { title: '', description: '', category: 'Other', resource_type: 'link', resource_url: '', cover_image_url: '', status: 'draft', order_index: 0 };
const fields = [
  { name: 'title', label: 'Resource title', required: true },
  { name: 'category', label: 'Category', options: ['Tutorial', 'Documentation', 'Tool', 'Article', 'Video', 'Course', 'Book', 'Template', 'Other'] },
  { name: 'resource_type', label: 'Resource type', options: ['link', 'video', 'course', 'article', 'document', 'tool'] },
  { name: 'resource_url', label: 'Resource link', type: 'url', required: true },
  { name: 'order_index', label: 'Display order', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea' },
];
export default function ResourcesManager({ resources, ...props }) {
  return <ContentManager {...props} title="Resources" singular="Resource" items={resources} initial={initial} fields={fields} imageKind="resource" imageField="cover_image_url" />;
}
