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
  Typography,
  Dialog as SubDialog,
  DialogActions,
  DialogContent as SubDialogContent,
  DialogTitle as SubDialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  const [manageTeamsDialogOpen, setManageTeamsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null);

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
      // If a team is selected, update its details too
      if (selectedTeamDetails) {
        const updatedTeam = response.data.find(team => team._id === selectedTeamDetails._id);
        setSelectedTeamDetails(updatedTeam);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleManageTeams = (member) => {
    setSelectedMember(member);
    setManageTeamsDialogOpen(true);
  };

  const handleTeamAssignment = async (teamId, userId) => {
    try {
      const team = teams.find(t => t._id === teamId);
      // Check if member exists in the team
      const isCurrentMember = team.members.some(member => 
        member._id === userId || member === userId
      );
      
      const endpoint = isCurrentMember ? 'remove' : 'add';
      
      await axios.put(
        `http://localhost:5001/api/teams/${teamId}/members/${endpoint}`,
        { memberId: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
  
      // Refresh teams data
      fetchTeams();
  
    } catch (error) {
      console.error('Error updating team members:', error);
    }
  };
  
  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/teams/${teamId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setTeams(teams.filter(t => t._id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };
  
  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/organizations/${organization._id}/members/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      // Refresh organization data
      // This should be handled by your parent component
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleSupervisorChange = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/teams/${selectedTeamDetails._id}/supervisor`,
        { supervisorId: userId || null },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update both teams and selectedTeamDetails
      fetchTeams();
      setSelectedTeamDetails(response.data); // Update the selected team details with new data
    } catch (error) {
      console.error('Error updating supervisor:', error);
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
                <ListItem 
                key={team._id}
                button
                onClick={() => setSelectedTeamDetails(team)}
                secondaryAction={
                    isAdmin && (
                    <Button
                        color="error"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team._id);
                        }}
                    >
                        Delete
                    </Button>
                    )
                }
                >
                <ListItemText primary={team.name} />
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
                <ListItem
                key={member.user._id}
                secondaryAction={
                    isAdmin && member.user._id !== organization.owner && (
                    <Button
                        color="error"
                        onClick={() => handleRemoveMember(member.user._id)}
                    >
                        Remove
                    </Button>
                    )
                }
                >
                <ListItemText
                    primary={`${member.user.firstName} ${member.user.lastName}`}
                    secondary={
                    <React.Fragment>
                        <Typography component="span" variant="body2">
                        Role: {member.role}
                        </Typography>
                        <br />
                        <Button
                        size="small"
                        onClick={() => handleManageTeams(member.user)}
                        sx={{ display: isAdmin ? 'inline-flex' : 'none' }}
                        >
                        Manage Teams
                        </Button>
                    </React.Fragment>
                    }
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

        <Dialog
        open={manageTeamsDialogOpen}
        onClose={() => {
            setManageTeamsDialogOpen(false);
            setSelectedMember(null);
        }}
        >
        <DialogTitle>
            Manage Teams for {selectedMember?.firstName} {selectedMember?.lastName}
        </DialogTitle>
        <DialogContent>
            <List>
            {teams.map((team) => (
                <ListItem key={team._id}>
                <ListItemText primary={team.name} />
                {isAdmin && (  // Only show action buttons for admins
            <>
              <Button
                variant={team.members.some(member => 
                    member._id === selectedMember?._id || 
                    member === selectedMember?._id
                ) ? "contained" : "outlined"}
                onClick={() => handleTeamAssignment(team._id, selectedMember?._id)}
                >
                {team.members.some(member => 
                    member._id === selectedMember?._id || 
                    member === selectedMember?._id
                ) ? "Remove" : "Add"}
              </Button>
              <Button
                color="error"
                onClick={() => handleDeleteTeam(team._id)}
                sx={{ ml: 1 }}
              >
                Delete Team
              </Button>
            </>
          )}
                </ListItem>
            ))}
            </List>
        </DialogContent>
        </Dialog>

        {/* Team Details Dialog */}
        <Dialog
        open={Boolean(selectedTeamDetails)}
        onClose={() => setSelectedTeamDetails(null)}
        maxWidth="sm"
        fullWidth
        >
        <DialogTitle>{selectedTeamDetails?.name}</DialogTitle>
        <DialogContent>
            <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Supervisor</Typography>
            {isAdmin ? (
                <FormControl fullWidth>
                <Select
                    value={selectedTeamDetails?.supervisor?._id || ''}
                    onChange={(e) => handleSupervisorChange(e.target.value)}
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                    {selectedTeamDetails?.members?.map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                        {member.firstName} {member.lastName}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            ) : (
                <Typography>
                {selectedTeamDetails?.supervisor ? 
                    `${selectedTeamDetails.supervisor.firstName} ${selectedTeamDetails.supervisor.lastName}` : 
                    'No supervisor assigned'
                }
                </Typography>
            )}
            </Box>

            <Box>
            <Typography variant="h6" gutterBottom>Team Members</Typography>
            <List>
                {selectedTeamDetails?.members?.length > 0 ? (
                selectedTeamDetails.members.map((member) => (
                    <ListItem key={member._id}>
                    <ListItemText 
                        primary={`${member.firstName} ${member.lastName}`}
                        secondary={member._id === selectedTeamDetails?.supervisor?._id ? 'Supervisor' : 'Member'}
                    />
                    </ListItem>
                ))
                ) : (
                <ListItem>
                    <ListItemText primary="No members in this team" />
                </ListItem>
                )}
            </List>
            </Box>
        </DialogContent>
        </Dialog>
    </Dialog>
  );
};

export default OrganizationDetailsDialog;