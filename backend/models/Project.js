const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Please select or assign a client'],
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fee: {
      type: Number,
      required: [true, 'Project fee/amount is required'],
      min: [0, 'Fee cannot be negative'],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Paid'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
