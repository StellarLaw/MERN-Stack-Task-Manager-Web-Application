import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';

const TeamDetailsDialog = ({ 
  open, 
  onClose, 
  team, 
  organization,
  isAdmin 
}) => {
  const [supervisor, setSupervisor] = useState(team?.supervisor || null);
  const [selectedMembers, setSelectedMembers] = useState(team?.members || []);

  const handleSupervisorChange = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5001/api/teams/${team._id}/supervisor`,
        { supervisorId: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setSupervisor(userId);
    } catch (error) {
      console.error('Error updating supervisor:', error);
    }
  };

  const handleMemberToggle = async (userId) => {
    try {
      const isCurrentMember = selectedMembers.includes(userId);
      const endpoint = isCurrentMember ? 'remove' : 'add';
      
      await axios.put(
        `http://localhost:5001/api/teams/${team._id}/members/${endpoint}`,
        { memberId: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setSelectedMembers(prev => 
        isCurrentMember 
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    } catch (error) {
      console.error('Error updating team members:', error);
    }
  };

  if (!organization || !team) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{team?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Supervisor</Typography>
          {isAdmin ? (
            <FormControl fullWidth>
              <InputLabel>Select Supervisor</InputLabel>
              <Select
                value={supervisor || ''}
                onChange={(e) => handleSupervisorChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {organization.members.map((member) => (
                  <MenuItem key={member.user._id} value={member.user._id}>
                    {member.user.firstName} {member.user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>
              {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'No supervisor assigned'}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Team Members</Typography>
          <List>
            {organization.members.map((member) => (
              <ListItem key={member.user._id}>
                <ListItemText
                  primary={`${member.user.firstName} ${member.user.lastName}`}
                />
                {isAdmin && (
                  <Button
                    variant={selectedMembers.includes(member.user._id) ? "contained" : "outlined"}
                    onClick={() => handleMemberToggle(member.user._id)}
                  >
                    {selectedMembers.includes(member.user._id) ? "Remove" : "Add"}
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsDialog;