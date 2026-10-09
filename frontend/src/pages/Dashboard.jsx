import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import ProjectModal from '../components/ProjectModal';
import { 
  DollarSign, 
  Clock, 
  FolderCheck, 
  Users, 
  Plus, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, clientsRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/clients'),
      ]);
      setStats(statsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (projectData) => {
    await API.post('/projects', projectData);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading dashboard analytics...</p>
      </div>
    );
  }

  const {
    totalIncome = 0,
    pendingPayments = 0,
    activeProjects = 0,
    totalClients = 0,
    monthlyIncome = [],
    statusBreakdown = [],
    recentProjects = []
  } = stats || {};

  // Custom colors for Donut chart
  const STATUS_COLORS = {
    'Pending': '#f59e0b',
    'In Progress': '#3b82f6',
    'Completed': '#8b5cf6',
    'Paid': '#10b981',
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
    <div className="space-y-8 animate-modal">
      {/* Top Banner Action */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Financial Performance</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white my-0">
            Welcome back to your workspace!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            You have <span className="text-indigo-400 font-semibold">{activeProjects} active projects</span> underway and <span className="text-amber-400 font-semibold">${pendingPayments.toLocaleString()}</span> in pending invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 glass-card hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Earnings"
          value={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Paid client invoices"
          icon={DollarSign}
          color="emerald"
          trend="Paid Out"
        />
        <StatCard
          title="Pending Payments"
          value={`$${pendingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Uncollected fees"
          icon={Clock}
          color="amber"
          trend="Outstanding"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Pending & In Progress"
          icon={FolderCheck}
          color="indigo"
          trend="In Flight"
        />
        <StatCard
          title="Total Clients"
          value={totalClients}
          subtitle="Registered client accounts"
          icon={Users}
          color="purple"
          trend="Active Roster"
        />
      </div>

      {/* Visual Data Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Earnings Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white my-0 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Monthly Earnings Overview
              </h3>
              <p className="text-xs text-slate-400 mt-1">Paid invoice income aggregated over recent months</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncome} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Income']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="income" fill="url(#incomeGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white my-0 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Project Status Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-1">Breakdown by project lifecycle state</p>
          </div>

          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || entry.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, 'Projects']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-medium text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Projects Table Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white my-0">Recent Projects</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest project additions & status updates</p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl">
            <p className="text-sm text-slate-400">No projects added yet.</p>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="mt-3 text-xs font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Create your first project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {recentProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{p.title}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.client?.name || 'Unassigned'}
                      {p.client?.company ? ` (${p.client.company})` : ''}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-300">
                      ${p.fee?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
        clients={clients}
      />
    </div>
  );
};

export default Dashboard;
