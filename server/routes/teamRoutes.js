const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createTeam, 
    getOrganizationTeams, 
    updateSupervisor, 
    addMember, 
    removeMember,
    deleteTeam
} = require('../controllers/teamController');

router.use(protect);

router.post('/', createTeam);
router.get('/organization/:organizationId', getOrganizationTeams);

router.put('/:teamId/supervisor', updateSupervisor);
router.put('/:teamId/members/add', addMember);
router.put('/:teamId/members/remove', removeMember);

router.delete('/:teamId', deleteTeam);

module.exports = router;