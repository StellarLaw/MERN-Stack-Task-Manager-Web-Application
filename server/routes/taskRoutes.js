const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
 } = require('../controllers/taskController');

// All task routes will require authentication
router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

router.put('/:taskId/status', updateTaskStatus);

module.exports = router;