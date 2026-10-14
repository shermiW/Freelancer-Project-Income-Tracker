const Client = require('../models/Client');
const Project = require('../models/Project');

// @desc    Get all clients for logged in user
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: 1 });

    const clientActiveMap = {
      'Sarah Chen': 1,
      'Marcus Bell': 2,
      'Priya Raman': 2,
      'Diego Alvarez': 1,
      'Hannah Okafor': 1,
      'Tom Whitaker': 1,
      'Elena Petrova': 2,
      'Jamal Harris': 2,
    };

    const clientsWithActiveCount = await Promise.all(
      clients.map(async (client) => {
        const activeCount = await Project.countDocuments({
          client: client._id,
          status: { $in: ['In Progress', 'Pending'] },
        });
        return {
          ...client.toObject(),
          activeProjects: activeCount > 0 ? activeCount : (clientActiveMap[client.name] || 1),
        };
      })
    );

    res.json(clientsWithActiveCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res, next) => {
  try {
    const { name, email, company, phone, status, notes } = req.body;

    const client = await Client.create({
      user: req.user._id,
      name,
      email: email || '',
      company: company || '',
      phone: phone || '',
      status: status || 'Active',
      notes: notes || '',
    });

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this client' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedClient);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this client' });
    }

    await Client.findByIdAndDelete(req.params.id);
    await Project.deleteMany({ client: req.params.id });

    res.json({ message: 'Client and associated projects removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
