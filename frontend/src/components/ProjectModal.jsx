import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';

const defaultClientList = [
  { _id: 'c1', name: 'Sarah Chen', company: 'Northwind Studio' },
  { _id: 'c2', name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
  { _id: 'c3', name: 'Priya Raman', company: 'Fieldnote Health' },
  { _id: 'c4', name: 'Diego Alvarez', company: 'Atlas Freight' },
  { _id: 'c5', name: 'Hannah Okafor', company: 'Brightside Learning' },
];

const ProjectModal = ({ isOpen, onClose, onSave, project, clients = [] }) => {
  const activeClients = clients.length > 0 ? clients : defaultClientList;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    fee: '',
    status: 'Pending',
    deadline: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to extract client ID or key from project
  const resolveClientId = (clientProp) => {
    if (!clientProp) return '';
    if (typeof clientProp === 'string') return clientProp;
    if (clientProp._id) return clientProp._id;
    const match = activeClients.find((c) => c.name === clientProp.name);
    return match ? match._id : clientProp.name;
  };

  useEffect(() => {
    if (project) {
      let deadlineVal = '';
      if (project.dueDate) {
        try {
          deadlineVal = new Date(project.dueDate).toISOString().split('T')[0];
        } catch {
          deadlineVal = '';
        }
      }

      setFormData({
        title: project.title || '',
        client: resolveClientId(project.client),
        fee: project.fee !== undefined ? String(project.fee) : '',
        status: project.status || 'Pending',
        deadline: deadlineVal,
        description: project.description || '',
      });
    } else {
      setFormData({
        title: '',
        client: '',
        fee: '0',
        status: 'Pending',
        deadline: '',
        description: '',
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project name is required.');
      return;
    }

    if (formData.deadline && formData.deadline < today) {
      setError('Deadline cannot be in the past. Please select today or a future date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        title: formData.title.trim(),
        client: formData.client || null,
        fee: formData.fee !== '' ? Number(formData.fee) : 0,
        status: formData.status,
        dueDate: formData.deadline || null,
        description: formData.description || '',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = Boolean(project);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl p-6 sm:p-7 animate-modal">
        {/* Header */}
        <div className="flex items-start justify-between pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 my-0 tracking-tight">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              {isEditMode
                ? 'Update the details for this project.'
                : 'Add a project to start tracking its fee and deadline.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Brand Identity Refresh"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5]"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Client
            </label>
            <div className="relative">
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] cursor-pointer appearance-none pr-9 font-normal"
              >
                <option value="">Select a client</option>
                {activeClients.map((c) => (
                  <option key={c._id || c.name} value={c._id || c.name}>
                    {c.name}{c.company ? ` — ${c.company}` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Project Fee (Rs.) & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Fee (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-semibold">Rs.</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] cursor-pointer appearance-none pr-9 font-normal"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Paid">Paid</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Deadline
              </label>
              <span className="text-[11px] text-slate-400">
                Today or future date
              </span>
            </div>
            <div className="relative">
              <input
                type="date"
                min={today}
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (error) setError('');
                }}
                onClick={(e) => {
                  try {
                    if (e.target.showPicker) e.target.showPicker();
                  } catch (err) {}
                }}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Scope, deliverables, notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5]"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] disabled:opacity-50 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
