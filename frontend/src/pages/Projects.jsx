import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ProjectModal from '../components/ProjectModal';
import Papa from 'papaparse';
import { 
  Plus, 
  Search, 
  Download, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Status Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state (5 items per page to match the screenshot view)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Exact 24 projects matching the screenshot
  const defaultProjects = [
    {
      _id: 'p1',
      title: 'Brand Identity Refresh',
      description: 'New logo system, typography and brand guidelines.',
      client: { name: 'Sarah Chen', company: 'Northwind Studio' },
      fee: 4800,
      status: 'In Progress',
      dueDate: '2026-10-24T00:00:00.000Z',
    },
    {
      _id: 'p2',
      title: 'E-commerce Storefront',
      client: { name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
      fee: 7200,
      status: 'In Progress',
      dueDate: '2026-11-08T00:00:00.000Z',
    },
    {
      _id: 'p3',
      title: 'Patient Portal UX Audit',
      client: { name: 'Priya Raman', company: 'Fieldnote Health' },
      fee: 3500,
      status: 'Pending',
      dueDate: '2026-11-15T00:00:00.000Z',
    },
    {
      _id: 'p4',
      title: 'Fleet Tracking Dashboard',
      client: { name: 'Diego Alvarez', company: 'Atlas Freight' },
      fee: 9600,
      status: 'In Progress',
      dueDate: '2026-12-01T00:00:00.000Z',
    },
    {
      _id: 'p5',
      title: 'Course Landing Pages',
      client: { name: 'Hannah Okafor', company: 'Brightside Learning' },
      fee: 2400,
      status: 'Completed',
      dueDate: '2026-10-03T00:00:00.000Z',
    },
    {
      _id: 'p6',
      title: 'Design System & Component Kit',
      client: { name: 'Sarah Chen', company: 'Northwind Studio' },
      fee: 4500,
      status: 'Completed',
      dueDate: '2026-09-18T00:00:00.000Z',
    },
    {
      _id: 'p7',
      title: 'Mobile App Wireframes & Flow',
      client: { name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
      fee: 3800,
      status: 'Completed',
      dueDate: '2026-09-12T00:00:00.000Z',
    },
    {
      _id: 'p8',
      title: 'Fintech Dashboard Analytics',
      client: { name: 'Priya Raman', company: 'Fieldnote Health' },
      fee: 5200,
      status: 'Completed',
      dueDate: '2026-08-25T00:00:00.000Z',
    },
    {
      _id: 'p9',
      title: 'SaaS Marketing Site Redesign',
      client: { name: 'Diego Alvarez', company: 'Atlas Freight' },
      fee: 2900,
      status: 'Completed',
      dueDate: '2026-08-15T00:00:00.000Z',
    },
    {
      _id: 'p10',
      title: 'Brand Iconography Suite',
      client: { name: 'Hannah Okafor', company: 'Brightside Learning' },
      fee: 2150,
      status: 'Completed',
      dueDate: '2026-07-28T00:00:00.000Z',
    },
    {
      _id: 'p11',
      title: 'Dark Mode Web Application Theme',
      client: { name: 'Sarah Chen', company: 'Northwind Studio' },
      fee: 1850,
      status: 'Completed',
      dueDate: '2026-07-10T00:00:00.000Z',
    },
    {
      _id: 'p12',
      title: 'User Onboarding Flow Experience',
      client: { name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
      fee: 3100,
      status: 'Completed',
      dueDate: '2026-06-20T00:00:00.000Z',
    },
    {
      _id: 'p13',
      title: 'Product Presentation Deck',
      client: { name: 'Priya Raman', company: 'Fieldnote Health' },
      fee: 1600,
      status: 'Completed',
      dueDate: '2026-06-05T00:00:00.000Z',
    },
    {
      _id: 'p14',
      title: 'Checkout Flow UX Audit',
      client: { name: 'Diego Alvarez', company: 'Atlas Freight' },
      fee: 2750,
      status: 'Completed',
      dueDate: '2026-05-18T00:00:00.000Z',
    },
    {
      _id: 'p15',
      title: 'Customer Portal UI Redesign',
      client: { name: 'Hannah Okafor', company: 'Brightside Learning' },
      fee: 3450,
      status: 'Completed',
      dueDate: '2026-04-22T00:00:00.000Z',
    },
    {
      _id: 'p16',
      title: 'Email Newsletter Templates',
      client: { name: 'Sarah Chen', company: 'Northwind Studio' },
      fee: 2250,
      status: 'Completed',
      dueDate: '2026-03-14T00:00:00.000Z',
    },
    {
      _id: 'p17',
      title: 'AI Assistant Interface & Prompts',
      client: { name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
      fee: 6500,
      status: 'In Progress',
      dueDate: '2026-11-22T00:00:00.000Z',
    },
    {
      _id: 'p18',
      title: 'Multi-Tenant Permissions Matrix',
      client: { name: 'Priya Raman', company: 'Fieldnote Health' },
      fee: 5200,
      status: 'In Progress',
      dueDate: '2026-11-28T00:00:00.000Z',
    },
    {
      _id: 'p19',
      title: 'Creator Marketplace App UI',
      client: { name: 'Diego Alvarez', company: 'Atlas Freight' },
      fee: 4800,
      status: 'In Progress',
      dueDate: '2026-12-05T00:00:00.000Z',
    },
    {
      _id: 'p20',
      title: 'Mobile App Tablet Responsive Layout',
      client: { name: 'Hannah Okafor', company: 'Brightside Learning' },
      fee: 5100,
      status: 'Pending',
      dueDate: '2026-12-10T00:00:00.000Z',
    },
    {
      _id: 'p21',
      title: 'Global Search & Command Palette',
      client: { name: 'Sarah Chen', company: 'Northwind Studio' },
      fee: 3600,
      status: 'Pending',
      dueDate: '2026-12-15T00:00:00.000Z',
    },
    {
      _id: 'p22',
      title: 'Web Accessibility (WCAG AAA) Audit',
      client: { name: 'Marcus Bell', company: 'Lumen Coffee Co.' },
      fee: 4200,
      status: 'Pending',
      dueDate: '2026-12-20T00:00:00.000Z',
    },
    {
      _id: 'p23',
      title: 'Interactive 3D Product Configurator',
      client: { name: 'Priya Raman', company: 'Fieldnote Health' },
      fee: 6800,
      status: 'Pending',
      dueDate: '2026-12-24T00:00:00.000Z',
    },
    {
      _id: 'p24',
      title: 'Cross-Platform Push Notifications UI',
      client: { name: 'Diego Alvarez', company: 'Atlas Freight' },
      fee: 4800,
      status: 'Pending',
      dueDate: '2026-12-30T00:00:00.000Z',
    },
  ];

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

    const handleOpenModal = () => {
      setSelectedProject(null);
      setIsModalOpen(true);
    };
    window.addEventListener('open-project-modal', handleOpenModal);
    return () => window.removeEventListener('open-project-modal', handleOpenModal);
  }, []);

  const activeProjectsList = projects.length > 0 ? projects : defaultProjects;

  // Filter projects based on search query and status dropdown
  const filteredProjects = activeProjectsList.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client?.name && p.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.client?.company && p.client.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All Statuses'
        ? true
        : statusFilter === 'Completed'
        ? p.status === 'Completed' || p.status === 'Paid'
        : p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Save (Create or Edit) Handler
  const handleSaveProject = async (formData) => {
    if (selectedProject && !selectedProject._id?.startsWith('p')) {
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
      if (!id.startsWith('p')) {
        await API.delete(`/projects/${id}`);
      }
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
    if (activeProjectsList.length === 0) return;

    const csvData = activeProjectsList.map((p) => ({
      Title: p.title,
      Client: p.client?.name || 'N/A',
      Company: p.client?.company || 'N/A',
      Fee: p.fee,
      Status: p.status,
      Deadline: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tally_Projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date helper: "Oct 24, 2026"
  const formatDeadline = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Status badge styling with dot matching the screenshot pills
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Paid':
        return {
          pill: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
          dot: 'bg-emerald-500',
          label: 'Completed',
        };
      case 'In Progress':
        return {
          pill: 'bg-blue-50 text-blue-600 border border-blue-200/60',
          dot: 'bg-blue-500',
          label: 'In Progress',
        };
      case 'Pending':
        return {
          pill: 'bg-amber-50 text-amber-600 border border-amber-200/60',
          dot: 'bg-amber-500',
          label: 'Pending',
        };
      default:
        return {
          pill: 'bg-slate-50 text-slate-600 border border-slate-200/60',
          dot: 'bg-slate-400',
          label: status,
        };
    }
  };

  const startItem = filteredProjects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProjects.length);

  return (
    <div className="space-y-6 animate-modal">
      {/* 1. Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 my-0 tracking-tight">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Track fees, deadlines and progress across every client.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Project</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar: Search Input on Left, Status Dropdown on Right */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by project or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#5046e5] shadow-2xs"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#5046e5] cursor-pointer appearance-none shadow-2xs pr-8 font-medium"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Paid">Paid</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#5046e5] animate-spin mb-2" />
            <p className="text-xs text-slate-400">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-sm font-semibold text-slate-700">No Projects Found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-6">Project Title</th>
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Fee ($)</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Deadline</th>
                  <th className="py-3.5 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedProjects.map((p) => {
                  const badge = getStatusBadge(p.status);
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Project Title */}
                      <td className="py-4 px-6 font-semibold text-slate-900 text-sm">
                        {p.title}
                      </td>

                      {/* Client Name & Company */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800 text-xs my-0 leading-tight">
                          {p.client?.name || 'Sarah Chen'}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5 my-0">
                          {p.client?.company || 'Northwind Studio'}
                        </p>
                      </td>

                      {/* Fee ($) */}
                      <td className="py-4 px-6 font-bold text-slate-800 text-xs">
                        ${Number(p.fee || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${badge.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {formatDeadline(p.dueDate)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setIsModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Bottom Pagination: Showing on left, Previous/Next on right */}
        <div className="py-3 px-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{startItem}</span> to{' '}
            <span className="font-semibold text-slate-700">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-700">{filteredProjects.length}</span> projects
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium text-xs shadow-2xs"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium text-xs shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl border border-slate-100 shadow-xl animate-modal text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 my-0">Delete Project?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to remove this project? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Project Modal */}
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
