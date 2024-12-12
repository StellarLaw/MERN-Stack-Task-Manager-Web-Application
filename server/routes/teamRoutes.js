const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createTeam, 
    getOrganizationTeams, 
    updateSupervisor, 
    addMember, 
    removeMember,
    deleteTeam,
    getSupervisedTeams  // Add this new function
} = require('../controllers/teamController');

router.use(protect);

// Base routes
router.post('/', createTeam);
router.get('/organization/:organizationId', getOrganizationTeams);
router.get('/supervised', getSupervisedTeams);  // Change this line to use the imported function directly

// Team member routes
router.put('/:teamId/supervisor', updateSupervisor);
router.put('/:teamId/members/add', addMember);
router.put('/:teamId/members/remove', removeMember);

// Team deletion
router.delete('/:teamId', deleteTeam);

module.exports = router;