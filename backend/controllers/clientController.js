const Client = require('../models/Client');
const Project = require('../models/Project');

// @desc    Get all clients for logged in user
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  try {
    const { name, email, company, phone, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
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
      { new: true }
    );

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this client' });
    }

    await Client.findByIdAndDelete(req.params.id);
    // Optionally delete or unassign projects associated with client
    await Project.deleteMany({ client: req.params.id });

    res.json({ message: 'Client and associated projects removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
