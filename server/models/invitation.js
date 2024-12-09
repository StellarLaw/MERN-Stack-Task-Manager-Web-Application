const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: String,  // Email address
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7*24*60*60 // Automatically delete after 7 days if not accepted
  }
});

const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;