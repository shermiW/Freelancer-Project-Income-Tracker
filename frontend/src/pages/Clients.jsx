import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ClientModal from '../components/ClientModal';
import Pagination from '../components/Pagination';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/clients');
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveClient = async (formData) => {
    if (selectedClient) {
      await API.put(`/clients/${selectedClient._id}`, formData);
    } else {
      await API.post('/clients', formData);
    }
    fetchClients();
  };

  const handleDeleteClient = async (id) => {
    try {
      setDeleting(true);
      await API.delete(`/clients/${id}`);
      setDeleteConfirmId(null);
      fetchClients();
    } catch (err) {
      console.error('Failed to delete client:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-modal">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white my-0 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Clients Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your client relationships, contact details, and company profiles.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedClient(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="All">All Clients</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients Grid Layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading clients roster...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Clients Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'All'
              ? 'No client matching your filter preferences.'
              : 'Add your first client to associate projects and track invoices.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedClients.map((c) => (
              <div
                key={c._id}
                className="glass-card p-6 rounded-2xl border border-slate-800 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white my-0 leading-tight">{c.name}</h4>
                        {c.company && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-indigo-400" />
                            <span>{c.company}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                    {c.email ? (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <a href={`mailto:${c.email}`} className="hover:text-indigo-400 truncate">
                          {c.email}
                        </a>
                      </p>
                    ) : (
                      <p className="text-slate-500 italic">No email added</p>
                    )}

                    {c.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{c.phone}</span>
                      </p>
                    )}

                    {c.notes && (
                      <div className="pt-1">
                        <p className="text-[11px] text-slate-400 italic line-clamp-2">
                          "{c.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Added {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedClient(c);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      title="Edit Client"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(c._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredClients.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 rounded-2xl border border-slate-700 animate-modal text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Client?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Deleting this client will also delete all associated project records in the database.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
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
