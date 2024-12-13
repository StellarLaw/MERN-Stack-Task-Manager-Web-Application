const Task = require('../models/Task');
const Team = require('../models/Team');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    })
    .populate({
      path: 'assignedTo',
      select: 'firstName lastName'  // Make sure these fields exist
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    await task.save();
    
    // Fetch the newly created task with populated fields
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'firstName lastName')
      .populate('teamId', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user owns the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is authorized to update status
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
    const isSupervisor = await Team.exists({
      _id: task.teamId,
      supervisor: req.user._id
    });
    
    if (!isAssignee && !isSupervisor && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // If assignee is trying to uncomplete task, deny
    if (isAssignee && !isSupervisor && task.status === 'completed' && req.body.status === 'pending') {
      return res.status(403).json({ message: 'Only supervisors can mark completed tasks as pending' });
    }

    task.status = req.body.status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'firstName lastName')
      .populate('teamId', 'name');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};