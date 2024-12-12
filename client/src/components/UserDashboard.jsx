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

  const [expandedTask, setExpandedTask] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);

  const [viewMode, setViewMode] = useState('list');

  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
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
      if (taskToEdit) {
        // Update existing task
        const response = await axios.put(
          `http://localhost:5001/api/tasks/${taskToEdit._id}`, 
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setTasks(tasks.map(task => 
          task._id === taskToEdit._id ? response.data : task
        ));
      } else {
        // Create new task
        const response = await axios.post(
          'http://localhost:5001/api/tasks', 
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setTasks([...tasks, response.data]);
      }
      setTaskToEdit(null);
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error('Error handling task:', error);
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
  
  const handleTaskComplete = (taskId, e) => {
    e.stopPropagation();
    setTasks(tasks.map(task => 
      task._id === taskId._id 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
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
                          onChange={(e) => handleTaskComplete(task._id, e)}
                          onClick={(e) => e.stopPropagation()}
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
                                Due: {task.dueDate}
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
                                  Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
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
    </Box>
  );
};

export default UserDashboard;