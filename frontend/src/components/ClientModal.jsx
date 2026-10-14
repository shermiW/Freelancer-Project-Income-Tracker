import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const ClientModal = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        company: client.company || '',
        email: client.email || '',
        phone: client.phone || '',
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
      });
    }
    setError('');
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Client name is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(client);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-[480px] rounded-2xl border border-slate-100 shadow-2xl p-6 sm:p-7 relative animate-fade-in">
        {/* Header matching screenshot */}
        <div className="flex items-start justify-between pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 my-0 tracking-tight">
              {isEdit ? 'Edit Client' : 'Add Client'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-normal m-0">
              {isEdit
                ? 'Update contact details for this client.'
                : 'Save a client so you can attach projects to them.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - 2x2 grid */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 1: Client Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Cooper"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
            </div>

            {/* Field 2: Company / Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Brand
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
            </div>

            {/* Field 3: Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="jane@acme.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
            </div>

            {/* Field 4: Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] disabled:opacity-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
