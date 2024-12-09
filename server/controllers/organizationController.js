const Organization = require('../models/Organization');
const Invitation = require('../models/Invitation');
const User = require('../models/User');

// Create organization
exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's organizations
exports.getUserOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      'members.user': req.user._id
    }).populate('owner', 'firstName lastName email');

    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send invitation
exports.sendInvitation = async (req, res) => {
  try {
    const { organizationId, email } = req.body;

    // Check if user is admin of the organization
    const organization = await Organization.findOne({
      _id: organizationId,
      'members': { 
        $elemMatch: { 
          user: req.user._id, 
          role: 'admin' 
        }
      }
    });

    if (!organization) {
      return res.status(403).json({ message: 'Not authorized to send invitations' });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      organization: organizationId,
      to: email,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    const invitation = await Invitation.create({
      organization: organizationId,
      from: req.user._id,
      to: email
    });

    res.status(201).json(invitation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get pending invitations
exports.getPendingInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      to: req.user.email,
      status: 'pending'
    })
    .populate('organization', 'name')
    .populate('from', 'firstName lastName email');

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to invitation
exports.respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body;
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation || invitation.to !== req.user.email) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
      await Organization.findByIdAndUpdate(invitation.organization, {
        $push: { members: { user: req.user._id, role: 'member' } }
      });
    }

    res.json(invitation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};