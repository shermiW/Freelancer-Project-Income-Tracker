const Project = require('../models/Project');
const Client = require('../models/Client');

// @desc    Get all projects with search, filter & pagination
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { status, client, search } = req.query;

    let query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (client && client !== 'All') {
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
          (p.client && p.client.name.toLowerCase().includes(term))
      );
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, client, fee, status, description, dueDate, paidDate } = req.body;

    if (!title || !client || fee === undefined) {
      return res.status(400).json({ message: 'Title, Client, and Fee are required' });
    }

    const project = await Project.create({
      user: req.user._id,
      client,
      title,
      fee: Number(fee),
      status: status || 'Pending',
      description: description || '',
      dueDate: dueDate || null,
      paidDate: status === 'Paid' ? (paidDate || new Date()) : (paidDate || null),
    });

    const populatedProject = await Project.findById(project._id).populate(
      'client',
      'name email company'
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this project' });
    }

    // Auto set paidDate if status changed to Paid
    if (req.body.status === 'Paid' && project.status !== 'Paid' && !req.body.paidDate) {
      req.body.paidDate = new Date();
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('client', 'name email company');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics & visual stats
// @route   GET /api/projects/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).populate('client', 'name');
    const clientsCount = await Client.countDocuments({ user: req.user._id });

    let totalIncome = 0; // Fee of Paid projects
    let pendingPayments = 0; // Fee of Pending / In Progress / Completed projects
    let activeProjectsCount = 0; // In Progress + Pending

    const statusCounts = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
      Paid: 0,
    };

    // Monthly breakdown map (e.g. { "Jan": 1200, "Feb": 3400 })
    const monthlyIncomeMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      monthlyIncomeMap[months[monthIdx]] = 0;
    }

    projects.forEach((p) => {
      // Count statuses
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status] += 1;
      }

      if (p.status === 'Paid') {
        totalIncome += p.fee;
        // Group by month
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDashboardStats,
};
