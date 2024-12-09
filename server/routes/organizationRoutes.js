const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrganization,
  getUserOrganizations,
  sendInvitation,
  getPendingInvitations,
  respondToInvitation
} = require('../controllers/organizationController');

router.use(protect);

router.route('/')
  .get(getUserOrganizations)
  .post(createOrganization);

router.route('/invitations')
  .get(getPendingInvitations)
  .post(sendInvitation);

router.route('/invitations/:id')
  .put(respondToInvitation);

module.exports = router;