const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', clientSchema);
