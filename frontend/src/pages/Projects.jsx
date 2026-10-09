import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ProjectModal from '../components/ProjectModal';
import Pagination from '../components/Pagination';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProjectsAndClients = async () => {
    try {
      setLoading(true);
      const [projRes, clientRes] = await Promise.all([
        API.get('/projects'),
        API.get('/clients'),
      ]);
      setProjects(projRes.data);
      setClients(clientRes.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndClients();
  }, []);

  // Filter projects client-side based on search, status, and client selection
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client?.name && p.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.client?.company && p.client.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesClient =
      clientFilter === 'All' || (p.client?._id || p.client) === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter]);

  // Paginated subset
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Save (Create or Edit) Handler
  const handleSaveProject = async (formData) => {
    if (selectedProject) {
      await API.put(`/projects/${selectedProject._id}`, formData);
    } else {
      await API.post('/projects', formData);
    }
    fetchProjectsAndClients();
  };

  // Delete Handler
  const handleDeleteProject = async (id) => {
    try {
      setDeleting(true);
      await API.delete(`/projects/${id}`);
      setDeleteConfirmId(null);
      fetchProjectsAndClients();
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeleting(false);
    }
  };

  // CSV Export using PapaParse
  const handleExportCSV = () => {
    if (projects.length === 0) return;

    const csvData = projects.map((p) => ({
      Title: p.title,
      Client: p.client?.name || 'N/A',
      Company: p.client?.company || 'N/A',
      Fee: p.fee,
      AmountPaid: p.amountPaid || 0,
      Status: p.status,
      DueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A',
      PaidDate: p.paidDate ? new Date(p.paidDate).toLocaleDateString() : 'N/A',
      Description: p.description || '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Projects_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Invoice Generator using jsPDF & autoTable
  const handleGenerateInvoicePDF = (p) => {
    const doc = new jsPDF();

    // Invoice Header Background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 45, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FREELANCER INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Invoice ID: INV-${p._id.substring(18).toUpperCase()}`, 14, 38);

    // Client Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 14, 58);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${p.client?.name || 'Client'}`, 14, 65);
    if (p.client?.company) doc.text(`Company: ${p.client.company}`, 14, 71);
    if (p.client?.email) doc.text(`Email: ${p.client.email}`, 14, 77);

    // Project & Fee Table
    autoTable(doc, {
      startY: 88,
      head: [['Project Description / Deliverables', 'Status', 'Due Date', 'Total Amount ($)']],
      body: [
        [
          p.title + (p.description ? `\n${p.description}` : ''),
          p.status,
          p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A',
          `$${p.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        ],
      ],
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    // Total Amount Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Due: $${p.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 130, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for your business! Please settle invoice upon receipt.', 14, finalY + 20);

    // Save PDF
    doc.save(`Invoice_${p.title.replace(/\s+/g, '_')}_${p._id.substring(18)}.pdf`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-modal">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white my-0 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Projects Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your project pipeline, deliverables, fees, and invoice exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={projects.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 glass-card hover:bg-slate-800 disabled:opacity-40 flex items-center gap-2 transition-all"
            title="Export CSV data"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Paid">Paid</option>
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200 max-w-[150px] truncate"
          >
            <option value="All">All Clients</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
            <p className="text-xs text-slate-400">Loading projects data...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All' || clientFilter !== 'All'
                ? 'Try adjusting your search query or dropdown filters.'
                : 'Get started by creating your first client project.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                  <th className="py-4 px-6">Project Title</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {paginatedProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm my-0">{p.title}</p>
                      {p.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {p.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-200">{p.client?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400">{p.client?.company || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-indigo-300 text-sm">
                        ${p.fee?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {p.dueDate ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(p.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-500">Not specified</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleGenerateInvoicePDF(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="Generate PDF Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(p);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="px-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 rounded-2xl border border-slate-700 animate-modal text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to remove this project? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
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

      {/* Project Form Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveProject}
        project={selectedProject}
        clients={clients}
      />
    </div>
  );
};

export default Projects;
