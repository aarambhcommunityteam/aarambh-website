import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink
} from 'react-icons/fi';

const initialForm = {
  title: '',
  description: '',
  category: 'General',
  resource_type: 'link',
  resource_url: '',
  cover_image_url: '',
  status: 'draft',
  order_index: 0
};

const categories = [
  'General', 'Tutorial', 'Documentation', 'Tool', 'Article',
  'Video', 'Course', 'Book', 'Template', 'Other'
];

const resourceTypes = ['link', 'video', 'course', 'article', 'document', 'tool'];

export default function ResourcesManager() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('id,title,description,category,resource_type,resource_url,cover_image_url,status,order_index,created_at,updated_at')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      alert(`Failed to fetch resources: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingResource(null);
    setFormData({ ...initialForm });
    setShowModal(true);
  };

  const openEdit = resource => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || 'General',
      resource_type: resource.resource_type || 'link',
      resource_url: resource.resource_url || '',
      cover_image_url: resource.cover_image_url || '',
      status: resource.status || 'draft',
      order_index: Number(resource.order_index) || 0
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingResource(null);
    setFormData({ ...initialForm });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a resource title.');
      return;
    }

    if (formData.resource_url.trim()) {
      try {
        new URL(formData.resource_url.trim());
      } catch {
        alert('Please enter a valid resource URL, including https://');
        return;
      }
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      resource_type: formData.resource_type,
      resource_url: formData.resource_url.trim(),
      cover_image_url: formData.cover_image_url.trim(),
      status: formData.status,
      order_index: Number(formData.order_index) || 0,
      updated_at: new Date().toISOString()
    };

    try {
      setSaving(true);
      if (editingResource) {
        const { error } = await supabase
          .from('resources')
          .update(payload)
          .eq('id', editingResource.id);
        if (error) throw error;
        alert('Resource updated successfully.');
      } else {
        const { error } = await supabase
          .from('resources')
          .insert([payload]);
        if (error) throw error;
        alert('Resource created successfully.');
      }

      setShowModal(false);
      setEditingResource(null);
      setFormData({ ...initialForm });
      await fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert(`Failed to save resource: ${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      await fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(`Failed to delete resource: ${error.message || error}`);
    }
  };

  const toggleStatus = async resource => {
    const nextStatus = resource.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('resources')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', resource.id);
      if (error) throw error;
      await fetchResources();
    } catch (error) {
      console.error('Error updating resource status:', error);
      alert(`Failed to update status: ${error.message || error}`);
    }
  };

  const activeCount = resources.filter(resource => resource.status === 'published').length;
  const draftCount = resources.filter(resource => resource.status !== 'published').length;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resources Manager</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage learning resources for the community</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus /> Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total Resources</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{resources.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Published</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activeCount}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Drafts</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{draftCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 text-lg">No resources yet</p>
          <p className="text-gray-400">Click “Add Resource” to create your first resource.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category / Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {resources.map(resource => (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 overflow-hidden">
                          {resource.cover_image_url ? (
                            <img src={resource.cover_image_url} alt={resource.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {resource.title?.charAt(0) || 'R'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white">{resource.title}</p>
                          {resource.resource_url && (
                            <a href={resource.resource_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                              View Link <FiExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{resource.category}</span>
                      <span className="ml-2 text-xs text-gray-500">{resource.resource_type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{resource.order_index}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(resource)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          resource.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {resource.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(resource)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" aria-label="Edit resource">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(resource.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" aria-label="Delete resource">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resource URL</label>
                <input
                  type="url"
                  value={formData.resource_url}
                  onChange={e => setFormData({ ...formData, resource_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={e => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.cover_image_url && (
                  <img src={formData.cover_image_url} alt="Cover preview" className="mt-3 h-36 w-full object-cover rounded-lg" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {categories.map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resource Type</label>
                  <select
                    value={formData.resource_type}
                    onChange={e => setFormData({ ...formData, resource_type: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={e => setFormData({ ...formData, order_index: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="draft">Draft (not public)</option>
                    <option value="published">Published (visible publicly)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
                </button>
                <button type="button" onClick={closeModal} disabled={saving} className="px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
