import React, { useState } from 'react';
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
} from '@mui/icons-material';
import TaskForm from './TaskForm';

const UserDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Project Proposal', dueDate: '2024-12-01', status: 'In Progress', priority: 'high' },
    { id: 2, title: 'Review Team Updates', dueDate: '2024-12-05', status: 'Pending', priority: 'medium' },
    { id: 3, title: 'Client Meeting', dueDate: '2024-12-10', status: 'Upcoming', priority: 'low' }
  ]);
  const [sortBy, setSortBy] = useState('dueDate');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { firstName: '', lastName: '', email: '' };
  });

  const [expandedTask, setExpandedTask] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);

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
        // Editing existing task
        setTasks(tasks.map(task => 
          task.id === taskToEdit.id ? { ...task, ...taskData } : task
        ));
      } else {
        // Creating new task
        const newTask = {
          id: tasks.length + 1,
          ...taskData
        };
        setTasks([...tasks, newTask]);
      }
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error handling task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };
  
  const handleTaskComplete = (taskId, e) => {
    e.stopPropagation();
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };
  
  const openDeleteDialog = (taskId, e) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (task, e) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };
  
  const handleDeleteTask = () => {
    setTasks(tasks.filter(task => task.id !== taskToDelete));
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
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
              <MenuItem onClick={handleClose}>Settings</MenuItem>
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
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setIsTaskFormOpen(true)}
                  >
                    New Task
                  </Button>
                </Box>
                <List>
                {sortedTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <ListItem 
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
                          onClick={() => handleTaskClick(task.id)}
                          sx={{ flex: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <Checkbox
                            checked={task.status === 'completed'}
                            onChange={(e) => handleTaskComplete(task.id, e)}
                            onClick={(e) => e.stopPropagation()}  // Add this line
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
                              </React.Fragment>
                            }
                          />
                          <IconButton size="small" onClick={() => handleTaskClick(task.id)}>
                            {expandedTask === task.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                            onClick={(e) => openDeleteDialog(task.id, e)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Collapse in={expandedTask === task.id} timeout="auto" unmountOnExit sx={{ width: '100%', pl: 7 }}>
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
                  startIcon={<TeamIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  View Team
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