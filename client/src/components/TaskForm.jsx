import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert
} from '@mui/material';

const TaskForm = ({ open, handleClose, handleSubmit, task = null }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [dateError, setDateError] = useState('');
  const [supervisedTeams, setSupervisedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
      setSelectedTeam(task.teamId || '');
      setSelectedMember(task.assignedTo?._id || '');
    } else {
      setTaskData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
      });
      setSelectedTeam('');
      setSelectedMember('');
    }
  }, [task]);

  useEffect(() => {
    const fetchSupervisedTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/teams/supervised', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSupervisedTeams(response.data);
        setIsSupervisor(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching supervised teams:', error);
      }
    };

    fetchSupervisedTeams();
  }, []);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateDate = (date) => {
    const today = new Date(getTodayString());
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      setDateError('Due date cannot be in the past');
      return false;
    }
    setDateError('');
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
  
    if (!validateDate(taskData.dueDate)) {
      return;
    }
  
    handleSubmit({
      ...taskData,
      dueDate: taskData.dueDate,
      assignedTo: selectedMember || null,
      teamId: selectedTeam || null,
    });
  
    setTaskData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
    });
    setSelectedTeam('');
    setSelectedMember('');
  };
  

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              label="Task Title"
              fullWidth
              required
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={taskData.dueDate}
              onChange={(e) => {
                setTaskData({ ...taskData, dueDate: e.target.value });
                validateDate(e.target.value);
              }}
              inputProps={{
                min: getTodayString()
              }}
              error={!!dateError}
              helperText={dateError}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskData.priority}
                label="Priority"
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskData.status}
                label="Status"
                onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            {isSupervisor && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Assign to Team</InputLabel>
                  <Select
                    value={selectedTeam}
                    label="Assign to Team"
                    onChange={(e) => {
                      setSelectedTeam(e.target.value);
                      setSelectedMember('');
                    }}
                  >
                    {supervisedTeams.map((team) => (
                      <MenuItem key={team._id} value={team._id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedTeam && (
                  <FormControl fullWidth>
                  <InputLabel>Assign to Member</InputLabel>
                  <Select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    label="Assign to Member"
                  >
                    {supervisedTeams.find(team => team._id === selectedTeam)?.members.map(member => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.firstName} {member.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!!dateError}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;