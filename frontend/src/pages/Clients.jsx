import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ClientModal from '../components/ClientModal';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle,
  UserPlus
} from 'lucide-react';

const defaultClients = [
  {
    _id: 'c1',
    name: 'Sarah Chen',
    company: 'Northwind Studio',
    email: 'sarah@northwind.studio',
    phone: '+1 (415) 555-0142',
    activeProjects: 1,
    status: 'Active',
  },
  {
    _id: 'c2',
    name: 'Marcus Bell',
    company: 'Lumen Coffee Co.',
    email: 'marcus@lumencoffee.com',
    phone: '+1 (503) 555-0198',
    activeProjects: 2,
    status: 'Active',
  },
  {
    _id: 'c3',
    name: 'Priya Raman',
    company: 'Fieldnote Health',
    email: 'priya.raman@fieldnote.health',
    phone: '+1 (617) 555-0117',
    activeProjects: 2,
    status: 'Active',
  },
  {
    _id: 'c4',
    name: 'Diego Alvarez',
    company: 'Atlas Freight',
    email: 'diego@atlasfreight.io',
    phone: '+1 (312) 555-0163',
    activeProjects: 1,
    status: 'Active',
  },
  {
    _id: 'c5',
    name: 'Hannah Okafor',
    company: 'Brightside Learning',
    email: 'hannah@brightside.edu',
    phone: '+1 (206) 555-0129',
    activeProjects: 1,
    status: 'Active',
  },
  {
    _id: 'c6',
    name: 'Tom Whitaker',
    company: 'Whitaker & Co. Law',
    email: 'tom@whitakerlaw.com',
    phone: '+1 (212) 555-0184',
    activeProjects: 1,
    status: 'Active',
  },
  {
    _id: 'c7',
    name: 'Elena Petrova',
    company: 'Orbit Fintech',
    email: 'elena@orbitfin.co',
    phone: '+1 (646) 555-0151',
    activeProjects: 2,
    status: 'Active',
  },
  {
    _id: 'c8',
    name: 'Jamal Harris',
    company: 'Peak Outdoors',
    email: 'jamal@peakoutdoors.com',
    phone: '+1 (720) 555-0176',
    activeProjects: 2,
    status: 'Active',
  },
];

const getInitials = (name = '') => {
  if (!name) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Clients = () => {
  const [clients, setClients] = useState(defaultClients);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal and action states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/clients');
      if (Array.isArray(data) && data.length > 0) {
        setClients(data);
      } else {
        setClients(defaultClients);
      }
    } catch (err) {
      console.warn('Using default client directory data:', err.message);
      setClients(defaultClients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients by search query
  const filteredClients = clients.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  const handleSaveClient = async (formData) => {
    try {
      if (selectedClient && selectedClient._id) {
        // Edit existing
        const { data } = await API.put(`/clients/${selectedClient._id}`, formData);
        setClients((prev) =>
          prev.map((c) =>
            c._id === selectedClient._id ? { ...c, ...formData, ...(data || {}) } : c
          )
        );
      } else {
        // Create new
        const newTempId = 'c_' + Date.now();
        let createdClient = {
          _id: newTempId,
          ...formData,
          activeProjects: 0,
        };
        try {
          const res = await API.post('/clients', formData);
          if (res?.data) {
            createdClient = { ...res.data, activeProjects: 0 };
          }
        } catch (apiErr) {
          console.warn('Created client offline:', apiErr.message);
        }
        setClients((prev) => [...prev, createdClient]);
      }
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Failed to save client:', err);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      setDeleting(true);
      try {
        await API.delete(`/clients/${id}`);
      } catch (apiErr) {
        console.warn('Deleted client offline:', apiErr.message);
      }
      setClients((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete client:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header matching Tally Screenshot */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight my-0">
            Clients
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-normal m-0">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} in your directory
          </p>
        </div>

        {/* Right side: Search bar & Add Client button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5046e5] focus:ring-1 focus:ring-[#5046e5] transition-all"
            />
          </div>

          <button
            onClick={() => {
              setSelectedClient(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Clients Cards Grid */}
      {loading && clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-[#5046e5] animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading client directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((c, index) => {
            const cardId = c._id || `c_${index}`;
            return (
              <div
                key={cardId}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative"
              >
                <div>
                  {/* Card Top: Initials avatar, Name & Company, and More options button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5046e5] font-bold text-xs flex items-center justify-center flex-shrink-0 tracking-wide">
                        {getInitials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 leading-tight truncate m-0">
                          {c.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-normal truncate mt-0.5 m-0">
                          {c.company || 'Individual Client'}
                        </p>
                      </div>
                    </div>

                    {/* Three dots menu */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === cardId ? null : cardId);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {menuOpenId === cardId && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div className="absolute right-0 top-7 z-30 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                setSelectedClient(c);
                                setIsModalOpen(true);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Edit Client</span>
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                setDeleteConfirmId(c._id);
                              }}
                              className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="mt-5 space-y-2 text-xs text-slate-500">
                    {c.email ? (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <a
                          href={`mailto:${c.email}`}
                          className="hover:text-[#5046e5] truncate transition-colors text-slate-500"
                        >
                          {c.email}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="italic">No email provided</span>
                      </div>
                    )}

                    {c.phone ? (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{c.phone}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="italic">No phone added</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Active projects count */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-normal">Active projects</span>
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
                    {c.activeProjects !== undefined ? c.activeProjects : 1}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 9th Card: Add a new client dashed box */}
          <div
            onClick={() => {
              setSelectedClient(null);
              setIsModalOpen(true);
            }}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-all group min-h-[175px]"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#5046e5] transition-colors mb-2">
              <UserPlus className="w-6 h-6 stroke-[1.75]" />
            </div>
            <p className="text-xs font-bold text-slate-800 m-0">
              Add a new client
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] leading-snug m-0">
              Keep contact details next to their projects.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl animate-fade-in text-center">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 my-0">Delete Client?</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Deleting this client will remove them from your directory. This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Add/Edit Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={handleSaveClient}
        client={selectedClient}
      />
    </div>
  );
};

export default Clients;
