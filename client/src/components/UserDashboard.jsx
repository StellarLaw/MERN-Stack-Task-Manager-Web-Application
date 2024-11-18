import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Assignment as TaskIcon,
  Group as TeamIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const UserDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(() => {
    // Get user data from localStorage when component mounts
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { firstName: '', lastName: '', email: '' }; });
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Project Proposal', dueDate: '2024-12-01', status: 'In Progress' },
    { id: 2, title: 'Review Team Updates', dueDate: '2024-12-05', status: 'Pending' },
    { id: 3, title: 'Client Meeting', dueDate: '2024-12-10', status: 'Upcoming' }
  ]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
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

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
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

          {/* Tasks Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Your Tasks
                  </Typography>
                  <Button variant="contained" color="primary">
                    New Task
                  </Button>
                </Box>
                <List>
                  {tasks.map((task) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                Due: {task.dueDate}
                              </Typography>
                              {` — ${task.status}`}
                            </React.Fragment>
                          }
                        />
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
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
    </Box>
  );
};

export default UserDashboard;
