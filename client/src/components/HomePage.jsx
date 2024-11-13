import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      setAlert({
        open: true,
        message: 'Login successful!',
        severity: 'success'
      });
      // TODO: Redirect to dashboard
      console.log('Login successful:', response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Login failed',
        severity: 'error'
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setAlert({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password
      });
      setAlert({
        open: true,
        message: 'Signup successful! Please login.',
        severity: 'success'
      });
      setTabValue(0); // Switch to login tab
      console.log('Signup successful:', response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Signup failed',
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Task Management
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Organize your teams and tasks efficiently
        </Typography>

        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            {tabValue === 0 && (
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </form>
            )}

            {tabValue === 1 && (
              <form onSubmit={handleSignup}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    margin="normal"
                    required
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    margin="normal"
                    required
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;