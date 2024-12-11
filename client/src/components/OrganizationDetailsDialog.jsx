import React, { useState, useEffect } from 'react';
import TeamDetailsDialog from './TeamDetailsDialog';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Dialog as SubDialog,
  DialogActions,
  DialogContent as SubDialogContent,
  DialogTitle as SubDialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Mail as InviteIcon,
  PersonAdd as AddMemberIcon,
} from '@mui/icons-material';
import axios from 'axios';

const OrganizationDetailsDialog = ({ 
  open, 
  onClose, 
  organization,
  onInvite,
  isAdmin,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);

  const handleCreateTeam = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/teams',
        {
          name: newTeamName,
          organizationId: organization._id
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setCreateTeamDialogOpen(false);
      setNewTeamName('');
      fetchTeams(); // Refresh teams list
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleInviteMember = () => {
    onInvite({
        organizationId: organization._id,
        email: inviteEmail
      });
    setInviteDialogOpen(false);
    setInviteEmail('');
  };

  useEffect(() => {
    if (organization) {
      fetchTeams();
    }
  }, [organization]);
  
  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/teams/organization/${organization._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{organization?.name}</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Teams" />
          <Tab label="Members" />
        </Tabs>

        {/* Teams Tab */}
        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateTeamDialogOpen(true)}
                sx={{ mb: 2 }}
              >
                Create Team
              </Button>
            )}
            <List>
            {teams.length > 0 ? (
                teams.map((team) => (
                <ListItem key={team._id}
                    button
                    onClick={() => {
                        setSelectedTeam(team);
                        setTeamDetailsOpen(true);
                    }}>
                    <ListItemText 
                    primary={team.name}
                    secondary={`Created by: ${team.createdBy.firstName} ${team.createdBy.lastName}`}
                    />
                </ListItem>
                ))
            ) : (
                <ListItem>
                <ListItemText 
                    primary="No teams yet"
                    secondary="Create a team to get started"
                />
                </ListItem>
            )}
            </List>
          </Box>
        )}

        {/* Members Tab */}
        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddMemberIcon />}
                onClick={() => setInviteDialogOpen(true)}
                sx={{ mb: 2 }}
              >
                Invite Member
              </Button>
            )}
            <List>
              {organization?.members?.map((member) => (
                <ListItem key={member.user._id}>
                  <ListItemText
                    primary={`${member.user.firstName} ${member.user.lastName}`}
                    secondary={`Role: ${member.role}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      {/* Create Team Dialog */}
      <Dialog
        open={createTeamDialogOpen}
        onClose={() => setCreateTeamDialogOpen(false)}
      >
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTeamDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTeam} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      >
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">Send Invitation</Button>
        </DialogActions>
      </Dialog>

      <TeamDetailsDialog
        open={teamDetailsOpen}
        onClose={() => setTeamDetailsOpen(false)}
        team={selectedTeam}
        organization={organization}
        isAdmin={isAdmin}
        />
    </Dialog>
  );
};

export default OrganizationDetailsDialog;