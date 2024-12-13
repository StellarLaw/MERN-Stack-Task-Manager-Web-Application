const Team = require('../models/Team');
const User = require('../models/User');
const Organization = require('../models/Organization');

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, organizationId } = req.body;

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
      return res.status(403).json({ message: 'Not authorized to create teams' });
    }

    const team = await Team.create({
      name,
      organization: organizationId,
      createdBy: req.user._id
    });

    await team.populate('createdBy', 'firstName lastName');
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get organization teams
exports.getOrganizationTeams = async (req, res) => {
    try {
      const teams = await Team.find({ organization: req.params.organizationId })
        .populate('supervisor', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
        .populate('createdBy', 'firstName lastName');
  
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Add member to team
  exports.addMember = async (req, res) => {
    try {
      const team = await Team.findByIdAndUpdate(
        req.params.teamId,
        { $addToSet: { members: req.body.memberId } },
        { new: true }
      )
      .populate('members', 'firstName lastName email')
      .populate('supervisor', 'firstName lastName email');
  
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Remove member from team
  exports.removeMember = async (req, res) => {
    try {
      const team = await Team.findByIdAndUpdate(
        req.params.teamId,
        { $pull: { members: req.body.memberId } },
        { new: true }
      );
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Delete team
exports.deleteTeam = async (req, res) => {
    try {
      await Team.findByIdAndDelete(req.params.teamId);
      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.updateSupervisor = async (req, res) => {
    try {
      const { supervisorId } = req.body;
  
      // Verify team exists
      const team = await Team.findById(req.params.teamId).populate('supervisor');
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      // Verify the new supervisor is a team member
      if (supervisorId && !team.members.includes(supervisorId)) {
        return res.status(400).json({ message: 'Supervisor must be a team member' });
      }
  
      // If there is a previous supervisor, reset their flag
      if (team.supervisor && team.supervisor._id.toString() !== supervisorId) {
        await User.findByIdAndUpdate(team.supervisor._id, { isSupervisor: false });
      }
  
      // Update the new supervisor's flag
      if (supervisorId) {
        await User.findByIdAndUpdate(supervisorId, { isSupervisor: true });
      }
  
      // Update the team with the new supervisor
      const updatedTeam = await Team.findByIdAndUpdate(
        req.params.teamId,
        { supervisor: supervisorId || null },
        { new: true }
      )
        .populate('supervisor', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
        .populate('createdBy', 'firstName lastName');
  
      res.json(updatedTeam);
    } catch (error) {
      console.error('Error updating supervisor:', error);
      res.status(400).json({ message: error.message });
    }
  };

  exports.getSupervisedTeams = async (req, res) => {
    try {
      const teams = await Team.find({ supervisor: req.user._id })
        .populate('members', 'firstName lastName email')
        .populate('supervisor', 'firstName lastName');
        
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };