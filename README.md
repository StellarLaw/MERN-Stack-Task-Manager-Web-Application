# MERN Task Management Web Application

## Project Overview
This Task Management Web Application is built using the MERN stack (MongoDB, Express, React, and Node.js). It enables organizations to manage tasks, create teams, assign supervisors, and track task progress efficiently. The application features a comprehensive role-based permission system, allowing organizations to manage members, teams, and tasks with different levels of access.

## Key Features
- **User Authentication**: Secure login/signup system with JWT authentication
- **Organization Management**: 
  - Create and manage organizations
  - Invite members via email
  - Manage teams within organizations
  - Assign team supervisors
- **Task Management**:
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Set priorities (high, medium, low)
  - Track task status (pending, completed)
  - View task deadlines and details
- **Team Management**:
  - Create teams within organizations
  - Assign/remove team members
  - Designate team supervisors
- **Role-Based Permissions**:
  - Organization Admin: Full control over organization, teams, and members
  - Team Supervisor: Can assign and manage tasks for team members
  - Team Member: Can view and complete assigned tasks
- **Dashboard Views**:
  - List view with sorting options (due date, priority, status)
  - Calendar view for deadline visualization
  - Task details with description expansion

## Technologies Used
- **Frontend**: 
  - React.js
  - Material-UI for components
  - FullCalendar for calendar view
  - Axios for API requests
- **Backend**: 
  - Node.js and Express.js
  - MongoDB for database
  - JWT for authentication
  - Bcrypt for password hashing

## Installation

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

4. Start the server:
```bash
node server.js
```

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Features in Detail

### Organization Management
- Create new organizations
- Invite members via email
- Manage organization members
- Create and manage teams within organizations

### Task Management
- Create tasks with title, description, due date, and priority
- Assign tasks to team members
- Track task status
- View tasks in list or calendar format
- Sort tasks by various criteria
- Mark tasks as completed

### Team Management
- Create teams within organizations
- Add/remove team members
- Assign team supervisors
- Manage team tasks

## User Roles and Permissions

### Organization Admin
- Create and manage organizations
- Create teams
- Invite members
- Assign supervisors
- Manage all aspects of the organization

### Team Supervisor
- Assign tasks to team members
- Monitor task progress
- Change task status
- View team performance

### Team Member
- View assigned tasks
- Complete tasks
- Update task status
- View team information

## Future Enhancements
- Email notifications for task assignments and deadlines
- Advanced reporting features
- Task commenting system
- File attachments for tasks
- Mobile application
- Performance analytics and dashboards
