import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Edit3, Loader2 } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSave, project, clients = [] }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-modal">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-[#5046e5]">
              {project ? <Edit3 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 my-0">
                {project ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Fill in project specs, client, and fee structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., E-Commerce Platform Redesign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Client *
              </label>
              <select
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
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
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Project Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
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
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Description / Deliverables
            </label>
            <textarea
              rows="3"
              placeholder="Scope of work, milestones, key requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm resize-none focus:outline-none focus:border-[#5046e5] focus:ring-2 focus:ring-indigo-100"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
