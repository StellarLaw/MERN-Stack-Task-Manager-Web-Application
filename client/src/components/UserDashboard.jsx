import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import TaskCalendar from './TaskCalendar';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Collapse,
  Checkbox,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  AccountCircle,
  Assignment as TaskIcon,
  Group as TeamIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Business as OrgIcon
} from '@mui/icons-material';
import TaskForm from './TaskForm';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('dueDate');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { firstName: '', lastName: '', email: '' };
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);

  const [expandedTask, setExpandedTask] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);

  const [viewMode, setViewMode] = useState('list');

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
  
    const todayDate = today.toISOString().split('T')[0];
    const dueDateOnly = due.toISOString().split('T')[0];
  
    return dueDateOnly < todayDate;
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      let response;
      
      if (taskToEdit) {
        // Editing existing task
        response = await axios.put(
          `http://localhost:5001/api/tasks/${taskToEdit._id}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Update the task in the state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskToEdit._id ? response.data : task
          )
        );
      } else {
        // Creating new task
        response = await axios.post(
          'http://localhost:5001/api/tasks',
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Add the new task to the state
        setTasks(prevTasks => [...prevTasks, response.data]);
      }
      
      setIsTaskFormOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
        return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/tasks',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
}, [navigate]);

  const handleTaskClick = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };
  
  const openDeleteDialog = (task, e) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (task, e) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };
  
  const handleDeleteTask = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/tasks/${taskToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTasks(tasks.filter(task => task._id !== taskToDelete._id));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    switch(sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const statusOrder = { 'in-progress': 1, 'pending': 2, 'completed': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleTaskStatusChange = async (task, e) => {
    e.stopPropagation();
  
    // If task is assigned and user is the assignee
    if (task.assignedTo?._id === user.id) {
      // If trying to uncheck, don't allow it
      if (task.status === 'completed') {
        return;
      }
      // If trying to check, show confirmation
      setTaskToComplete(task);
      setConfirmDialogOpen(true);
      return;
    }
  
    // For non-assigned tasks or if user is supervisor
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${task._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      setTasks(tasks.map(t => 
        t._id === task._id ? response.data : t
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  const handleConfirmComplete = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${taskToComplete._id}/status`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      setTasks(tasks.map(t => 
        t._id === taskToComplete._id ? response.data : t
      ));
      setConfirmDialogOpen(false);
      setTaskToComplete(null);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management
          </Typography>
          <div>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                handleClose();
                navigate('/profile');
              }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  Welcome back, {user.firstName}!
                </Typography>
                <Typography color="textSecondary">
                  Here's your task overview
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {/* View toggle buttons */}
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    size="small"
                  >
                    List View
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('calendar')}
                    size="small"
                  >
                    Calendar View
                  </Button>

                  {/* Sort control (only show in list view) */}
                  {viewMode === 'list' && (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="dueDate">Due Date</MenuItem>
                        <MenuItem value="priority">Priority (High to Low)</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="createdAt">Created Date</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setIsTaskFormOpen(true)}
                >
                  New Task
                </Button>
              </Box>

              {/* Conditional rendering based on view mode */}
              {viewMode === 'list' ? (
                <List>
                  {sortedTasks.map((task) => (
                  <React.Fragment key={task._id}>
                    <ListItem 
                    key={task._id}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ 
                      width: '100%', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Box 
                        onClick={() => handleTaskClick(task._id)}
                        sx={{ flex: 1, display: 'flex', alignItems: 'center' }}
                      >
                        <Checkbox
                          checked={task.status === 'completed'}
                          onChange={(e) => handleTaskStatusChange(task, e)}  // Pass the whole task object
                          onClick={(e) => e.stopPropagation()}
                          disabled={task.assignedTo?._id === user.id && task.status === 'completed'}
                          sx={{ mr: 1 }}
                        />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                sx={{
                                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                  color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                }}
                              >
                                {task.title}
                              </Typography>
                              {isOverdue(task.dueDate) && task.status !== 'completed' && (
                                <Chip size="small" label="OVERDUE" color="error" />
                              )}
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" 
                                color={isOverdue(task.dueDate) && task.status !== 'completed' ? "error" : "textPrimary"}
                              >
                                Due: {new Date(task.dueDate).toISOString().split('T')[0]}
                              </Typography>
                              {` • Status: ${task.status}`}
                              {` • Priority: `}
                              <Chip 
                                size="small" 
                                label={task.priority}
                                color={
                                  task.priority === 'high' ? 'error' : 
                                  task.priority === 'medium' ? 'warning' : 
                                  'success'
                                }
                                sx={{ ml: 1 }}
                              />
                              {task.assignedTo && (
                              <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                                {task.assignedTo._id === user.id ? (
                                  // If current user is the assignee, show who assigned it
                                  `Assigned by: ${task.assignedBy?.firstName || ''} ${task.assignedBy?.lastName || ''}`
                                ) : (
                                  // If current user is the supervisor/creator, show who it's assigned to
                                  `Assigned to: ${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                                )}
                              </Typography>
                            )}
                            </React.Fragment>
                          }
                        />
                          <IconButton size="small" onClick={() => handleTaskClick(task._id)}>
                            {expandedTask === task._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => openEditDialog(task, e)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={(e) => openDeleteDialog(task, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        </Box>
                      </Box>
                      <Collapse in={expandedTask === task._id} timeout="auto" unmountOnExit sx={{ width: '100%', pl: 7 }}>
                        <Box sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {task.description || 'No description provided.'}
                          </Typography>
                        </Box>
                      </Collapse>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                </List>
              ) : (
                <TaskCalendar tasks={sortedTasks} />
              )}
            </CardContent>
          </Card>
        </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<TaskIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={() => setIsTaskFormOpen(true)}
                >
                  Create New Task
                </Button>
                <Button
                  variant="contained"
                  startIcon={<OrgIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={() => navigate("/organizations")}
                >
                  Organizations
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <TaskForm 
        open={isTaskFormOpen} 
        handleClose={() => {
          setIsTaskFormOpen(false);
          setTaskToEdit(null);  // Reset taskToEdit when closing
        }} 
        handleSubmit={handleTaskSubmit}
        task={taskToEdit}  // Pass the task if editing
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteTask}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setTaskToComplete(null);
        }}
      >
        <DialogTitle>Complete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this task as complete? 
            This action cannot be undone by you - only your supervisor can change it back.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setConfirmDialogOpen(false);
            setTaskToComplete(null);
          }}>Cancel</Button>
          <Button onClick={handleConfirmComplete} variant="contained">
            Complete Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;