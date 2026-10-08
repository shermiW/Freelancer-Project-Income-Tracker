const Project = require('../models/Project');
const Client = require('../models/Client');

// Helper to normalize status string from query parameters
const normalizeStatus = (statusStr) => {
  if (!statusStr || statusStr === 'All' || statusStr === 'all') return null;
  const s = statusStr.toString().trim().toLowerCase();
  if (['in-progress', 'in_progress', 'in progress', 'inprogress'].includes(s)) {
    return 'In Progress';
  }
  if (s === 'pending') return 'Pending';
  if (s === 'completed') return 'Completed';
  if (s === 'paid') return 'Paid';
  return statusStr;
};

// @desc    Get all projects with search, filter & query params
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { status, client, search } = req.query;

    let query = { user: req.user._id };

    const formattedStatus = normalizeStatus(status);
    if (formattedStatus) {
      query.status = formattedStatus;
    }

    if (client && client !== 'All' && client !== 'all') {
      query.client = client;
    }

    let projects = await Project.find(query)
      .populate('client', 'name email company')
      .sort({ createdAt: -1 });

    // Client-side text search filter if search parameter provided
    if (search) {
      const term = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.client && p.client.name && p.client.name.toLowerCase().includes(term))
      );
    }

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, client, fee, amountPaid, status, description, dueDate, paidDate } = req.body;

    // Verify client belongs to logged in user
    const clientExists = await Client.findOne({ _id: client, user: req.user._id });
    if (!clientExists) {
      return res.status(400).json({ message: 'Selected client not found or not owned by user' });
    }

    const normalizedStat = normalizeStatus(status) || 'Pending';

    const project = await Project.create({
      user: req.user._id,
      client,
      title,
      fee: Number(fee),
      amountPaid: amountPaid !== undefined ? Number(amountPaid) : 0,
      status: normalizedStat,
      description: description || '',
      dueDate: dueDate || null,
      paidDate: normalizedStat === 'Paid' ? (paidDate || new Date()) : (paidDate || null),
    });

    const populatedProject = await Project.findById(project._id).populate(
      'client',
      'name email company'
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this project' });
    }

    const updates = { ...req.body };
    if (updates.status) {
      updates.status = normalizeStatus(updates.status) || updates.status;
    }

    // Auto set paidDate if status changed to Paid
    if (updates.status === 'Paid' && project.status !== 'Paid' && !updates.paidDate) {
      updates.paidDate = new Date();
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('client', 'name email company');

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & visual stats
// @route   GET /api/dashboard/stats or GET /api/projects/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).populate('client', 'name company');
    const clientsCount = await Client.countDocuments({ user: req.user._id });

    let totalIncome = 0; // Fee of Paid projects
    let pendingPayments = 0; // Fee of non-Paid projects
    let activeProjectsCount = 0; // In Progress + Pending count

    const statusCounts = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
      Paid: 0,
    };

    // Monthly aggregation for charts (last 6 months)
    const monthlyIncomeMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      monthlyIncomeMap[months[monthIdx]] = 0;
    }

    projects.forEach((p) => {
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status] += 1;
      }

      if (p.status === 'Paid') {
        totalIncome += p.fee;
        const pDate = p.paidDate || p.updatedAt || p.createdAt;
        const monthName = months[new Date(pDate).getMonth()];
        if (monthlyIncomeMap[monthName] !== undefined) {
          monthlyIncomeMap[monthName] += p.fee;
        } else {
          monthlyIncomeMap[monthName] = p.fee;
        }
      } else {
        pendingPayments += p.fee;
      }

      if (p.status === 'In Progress' || p.status === 'Pending') {
        activeProjectsCount += 1;
      }
    });

    const monthlyIncome = Object.keys(monthlyIncomeMap).map((m) => ({
      month: m,
      income: monthlyIncomeMap[m],
    }));

    const statusBreakdown = [
      { name: 'Pending', count: statusCounts.Pending, color: '#f59e0b' },
      { name: 'In Progress', count: statusCounts['In Progress'], color: '#3b82f6' },
      { name: 'Completed', count: statusCounts.Completed, color: '#8b5cf6' },
      { name: 'Paid', count: statusCounts.Paid, color: '#10b981' },
    ];

    res.json({
      totalIncome,
      pendingPayments,
      activeProjects: activeProjectsCount,
      totalProjects: projects.length,
      totalClients: clientsCount,
      summary: {
        totalIncome,
        pendingPayments,
        activeProjects: activeProjectsCount,
        totalProjects: projects.length,
        totalClients: clientsCount,
      },
      statusBreakdown,
      monthlyIncome,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDashboardStats,
};
