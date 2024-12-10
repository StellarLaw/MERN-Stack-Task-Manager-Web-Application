import React, { useState } from 'react';
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

  const handleCreateTeam = () => {
    // Add team creation logic here
    setCreateTeamDialogOpen(false);
    setNewTeamName('');
  };

  const handleInviteMember = () => {
    onInvite({
        organizationId: organization._id,
        email: inviteEmail
      });
    setInviteDialogOpen(false);
    setInviteEmail('');
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
              {/* Add team list here */}
              <ListItem>
                <ListItemText 
                  primary="No teams yet"
                  secondary="Create a team to get started"
                />
              </ListItem>
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
    </Dialog>
  );
};

export default OrganizationDetailsDialog;