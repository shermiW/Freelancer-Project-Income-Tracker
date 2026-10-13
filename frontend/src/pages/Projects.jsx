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
  DollarSign,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filters and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 24 Reference Projects matching the Dashboard metrics exactly (fallback when DB is empty)
  const defaultProjects = [
    // 12 Completed ($35,950 total)
    {
      _id: 'p1',
      title: 'Design System & Component Kit',
      description: 'Comprehensive Figma token library and accessible component guidelines.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 4500,
      amountPaid: 4500,
      status: 'Completed',
      dueDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p2',
      title: 'iOS Mobile App Wireframes',
      description: 'Native mobile app user flows, wireframes, and interactive prototype.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 3800,
      amountPaid: 3800,
      status: 'Completed',
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p3',
      title: 'Fintech Dashboard Analytics UI',
      description: 'Real-time chart views, transaction ledger, and summary cards.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 5200,
      amountPaid: 5200,
      status: 'Completed',
      dueDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p4',
      title: 'SaaS Marketing Landing Page',
      description: 'Responsive high-converting landing page with 3D illustration assets.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 2900,
      amountPaid: 2900,
      status: 'Completed',
      dueDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p5',
      title: 'Brand Identity & Iconography Guide',
      description: 'Vector logo package, color palettes, and typographic scale.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 2400,
      amountPaid: 2400,
      status: 'Completed',
      dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p6',
      title: 'Dark Mode Web Application Theme',
      description: 'Color token mapping and high-contrast accessibility compliance.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 1850,
      amountPaid: 1850,
      status: 'Completed',
      dueDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p7',
      title: 'User Onboarding Flow Experience',
      description: 'Multi-step signup wizard and profile setup micro-interactions.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 3100,
      amountPaid: 3100,
      status: 'Completed',
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p8',
      title: 'Product Presentation Deck Design',
      description: 'Investor pitch slides and visual storytelling graphic assets.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 1600,
      amountPaid: 1600,
      status: 'Completed',
      dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p9',
      title: 'Checkout Flow UX Audit & Wireframes',
      description: 'Cart abandonment reduction and friction-free payment UI.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 2750,
      amountPaid: 2750,
      status: 'Completed',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p10',
      title: 'Customer Portal UI Redesign',
      description: 'Account settings, notification preferences, and billing portal.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 3450,
      amountPaid: 3450,
      status: 'Completed',
      dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p11',
      title: 'Mobile Navigation Animation Specs',
      description: 'Lottie animations and gesture transitions documentation.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 2150,
      amountPaid: 2150,
      status: 'Completed',
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p12',
      title: 'Email Newsletter Templates',
      description: 'Responsive transactional and promotional Figma designs.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 2250,
      amountPaid: 2250,
      status: 'Completed',
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // 6 In Progress
    {
      _id: 'p13',
      title: 'Enterprise Analytics Suite V2',
      description: 'Complex data tables, export dialogs, and customizable metric widgets.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 7500,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p14',
      title: 'AI Assistant Interface & Prompts',
      description: 'Conversational chat layout, streaming typography, and prompt suggestions.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 6200,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p15',
      title: 'Multi-Tenant Permissions Matrix',
      description: 'Role-based access control UI and audit logs viewer.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 4800,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p16',
      title: 'Creator Marketplace App UI',
      description: 'Discovery feed, creator profile cards, and tipping flow.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 5450,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p17',
      title: 'Cloud Billing & Invoice Portal',
      description: 'Usage-based metering charts, tax summary, and PDF download modals.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 4300,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p18',
      title: 'Design System Documentation Website',
      description: 'Storybook theme, usage examples, and token export tool.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 3900,
      amountPaid: 0,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // 6 Pending
    {
      _id: 'p19',
      title: 'Mobile App Tablet Responsive Layout',
      description: 'Adaptive iPad and Android tablet screen layouts.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 5100,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p20',
      title: 'Global Search & Command Palette',
      description: 'Keyboard navigation shortcut modal (Cmd+K) with recent searches.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 3600,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p21',
      title: 'Web Accessibility (WCAG AAA) Audit',
      description: 'Contrast checks, screen reader landmarks, and keyboard focus states.',
      client: { name: 'Acme Studio', company: 'Acme Corp' },
      fee: 4200,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p22',
      title: 'Interactive 3D Product Configurator',
      description: 'Three.js UI overlay, material switcher, and camera angle controls.',
      client: { name: 'Starlight Tech Inc', company: 'Starlight Inc' },
      fee: 6500,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p23',
      title: 'Cross-Platform Push Notifications UI',
      description: 'In-app banner styles, badge counts, and user preference toggles.',
      client: { name: 'Nexus Ventures', company: 'Nexus Group' },
      fee: 3800,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'p24',
      title: 'Referral & Affiliate Growth Engine',
      description: 'Share link generator, reward tier tracker, and payouts history.',
      client: { name: 'Apex Creative Lab', company: 'Apex Media' },
      fee: 4800,
      amountPaid: 0,
      status: 'Pending',
      dueDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
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

  // Use DB data if present, otherwise fallback to reference dataset
  const activeProjectsList = projects.length > 0 ? projects : defaultProjects;

  // Status counts
  const totalCount = activeProjectsList.length;
  const inProgressCount = activeProjectsList.filter((p) => p.status === 'In Progress').length;
  const pendingCount = activeProjectsList.filter((p) => p.status === 'Pending').length;
  const completedCount = activeProjectsList.filter((p) => p.status === 'Completed' || p.status === 'Paid').length;

  // Filter projects
  const filteredProjects = activeProjectsList.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client?.name && p.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.client?.company && p.client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Completed'
        ? p.status === 'Completed' || p.status === 'Paid'
        : p.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesClient =
      clientFilter === 'All' ||
      (p.client?._id && p.client._id === clientFilter) ||
      (p.client?.name && p.client.name === clientFilter);

    return matchesSearch && matchesStatus && matchesClient;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'fee-high') return (b.fee || 0) - (a.fee || 0);
    if (sortBy === 'fee-low') return (a.fee || 0) - (b.fee || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0; // default
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, sortBy]);

  // Paginated subset
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
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
      AmountPaid: p.amountPaid || 0,
      Status: p.status,
      DueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A',
      Description: p.description || '',
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

  // PDF Invoice Generator using jsPDF & autoTable
  const handleGenerateInvoicePDF = (p) => {
    const doc = new jsPDF();

    // Invoice Header
    doc.setFillColor(80, 70, 229); // #5046e5 purple brand
    doc.rect(0, 0, 210, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TALLY INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 32);

    // Client Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 14, 56);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${p.client?.name || 'Client Name'}`, 14, 63);
    if (p.client?.company) doc.text(`Company: ${p.client.company}`, 14, 69);

    // Project & Fee Table
    autoTable(doc, {
      startY: 80,
      head: [['Deliverables / Project Description', 'Status', 'Due Date', 'Amount ($)']],
      body: [
        [
          p.title + (p.description ? `\n${p.description}` : ''),
          p.status,
          p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'Upon Delivery',
          `$${Number(p.fee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        ],
      ],
      headStyles: { fillColor: [80, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Due: $${Number(p.fee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 130, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for partnering with us!', 14, finalY + 18);

    doc.save(`Invoice_${p.title.replace(/\s+/g, '_')}.pdf`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Paid':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'In Progress':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
        };
      case 'Pending':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200/80',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="space-y-6 animate-modal">
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-0 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-[#5046e5]" />
            Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Track deliverables, contract values, and payment milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Export CSV data"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#5046e5] hover:bg-[#4338ca] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Status Tabs / KPI Bar (Matching Dashboard metrics) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            statusFilter === 'All'
              ? 'bg-[#eff0fe] text-[#5046e5] border border-indigo-200 shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Projects</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('In Progress')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            statusFilter === 'In Progress'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>In Progress</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
            {inProgressCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            statusFilter === 'Pending'
              ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Pending</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Completed')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            statusFilter === 'Completed'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {completedCount}
          </span>
        </button>
      </div>

      {/* 3. Search and Dropdown Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by project, client, or deliverables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#5046e5]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Client:</span>
          </div>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 max-w-[160px] truncate focus:outline-none focus:border-[#5046e5]"
          >
            <option value="All">All Clients</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#5046e5]"
          >
            <option value="default">Default</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="title">Project Name</option>
          </select>
        </div>
      </div>

      {/* 4. Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#5046e5] animate-spin mb-2" />
            <p className="text-xs text-slate-400">Loading projects data...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All' || clientFilter !== 'All'
                ? 'Try adjusting your search filters.'
                : 'Get started by creating your first client project.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3.5 px-5">Project Title</th>
                  <th className="py-3.5 px-5">Client</th>
                  <th className="py-3.5 px-5">Fee</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedProjects.map((p) => {
                  const badgeStyle = getStatusBadge(p.status);
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 text-sm my-0 leading-tight">
                          {p.title}
                        </p>
                        {p.description && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5 font-normal">
                            {p.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {p.client?.name || 'Acme Studio'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {p.client?.company || 'Client'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 text-sm">
                          ${Number(p.fee || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}></span>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        {p.dueDate ? (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(p.dueDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">Flexible</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleGenerateInvoicePDF(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Generate PDF Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#5046e5] hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

        {/* Pagination Controls */}
        <div className="px-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedProjects.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* 5. Delete Confirmation Modal */}
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
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Project Form Modal */}
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
