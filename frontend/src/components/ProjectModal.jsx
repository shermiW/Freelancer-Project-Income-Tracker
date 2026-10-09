import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Edit3, Loader2 } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSave, project, clients }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    fee: '',
    amountPaid: '0',
    status: 'Pending',
    description: '',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        client: project.client?._id || project.client || '',
        fee: project.fee !== undefined ? project.fee : '',
        amountPaid: project.amountPaid !== undefined ? project.amountPaid : 0,
        status: project.status || 'Pending',
        description: project.description || '',
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        client: clients.length > 0 ? clients[0]._id : '',
        fee: '',
        amountPaid: '0',
        status: 'Pending',
        description: '',
        dueDate: '',
      });
    }
    setError('');
  }, [project, clients, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!formData.client) {
      setError('Please select a client.');
      return;
    }
    if (formData.fee === '' || isNaN(formData.fee) || Number(formData.fee) < 0) {
      setError('Please enter a valid non-negative project fee.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        ...formData,
        fee: Number(formData.fee),
        amountPaid: Number(formData.amountPaid || 0),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-modal">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {project ? <Edit3 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {project ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400">Fill in project specs, client, and fee structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., E-Commerce Platform Redesign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Client *
              </label>
              <select
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
              >
                <option value="" disabled>Select a client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Fee ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="2500.00"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Deliverables
            </label>
            <textarea
              rows="3"
              placeholder="Scope of work, milestones, key requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
