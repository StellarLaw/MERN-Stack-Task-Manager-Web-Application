# MERN Task Management Web Application

## Project Overview
This Task Management Web Application is being developed using the MERN stack (MongoDB, Express, React, and Node.js). It is designed to help users and organizations manage tasks, collaborate within teams, and track deadlines efficiently. The app provides role-based permissions, allowing administrators to manage users, assign tasks, and set task priorities. It also features calendar integration to visualize deadlines and monitor progress.

## Key Features
- **User Registration and Authentication**: Secure login system using JWT authentication.
- **Task Management**: Users can create, edit, and delete tasks.
- **Role-Based Permissions**: Admins can assign tasks to team members, manage roles, and track progress.
- **Calendar Integration**: View tasks and deadlines in a calendar format, with color-coded priorities.
- **Organization Creation**: Users can create or join organizations to collaborate on tasks.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js and Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Calendar Integration**: FullCalendar

## Installation

## Future Usage
Once the server and frontend are running, you can:
- Register or log in to your account.
- Create personal tasks or manage tasks within an organization.
- View tasks in a dashboard and calendar.
- Mark tasks as complete or incomplete.
- Admins can assign tasks to team members and monitor progress.

## Roadmap
### Current Focus
- **User authentication and task creation**: Implementing secure login and basic task management.
  
### Future Features
- **Calendar integration**: Visualizing tasks and deadlines on a calendar.
- **Role-based permissions**: Adding administrator roles for task delegation.
- **Notifications**: Reminders for upcoming deadlines.

Here’s the updated README excerpt with instructions for both the backend and client, along with the issue and resolution steps:

---

## How to Download, Compile, and Run

### **1. Clone the Repository**
To get started, clone the project repository from GitHub:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### **2. Install Dependencies**

#### **Backend**
Navigate to the `server` directory and install the backend dependencies:

```bash
cd server
npm install
```

#### **Client**
Navigate to the `client` directory and install the frontend dependencies:

```bash
cd ../client
npm install
```

---

### **3. Start the Project**

#### **Start the Backend**
From the `server` directory, start the Node.js backend server:

```bash
cd server
node server.js
```

The backend server will start, typically at `http://localhost:5000` (or the port configured in your server code). Ensure the backend is running before starting the client.

#### **Start the Client**
From the `client` directory, start the React development server:

```bash
cd ../client
npm start
```

The React application will launch in your default browser at `http://localhost:3000` (or another port if 3000 is in use).

---

### **Common Issue and Resolution**

**Issue:**  
While attempting to start the client with `npm start`, you might encounter an error like:

```plaintext
Error: Cannot find module './util'
```

**Cause:**  
This issue typically occurs due to a corrupted or incomplete `node_modules` installation.

**Resolution:**  
To resolve the issue:
1. Navigate to the `client` directory.
2. Remove the `node_modules` directory and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```
3. Reinstall the dependencies:
   ```bash
   npm install
   ```
4. Start the client again:
   ```bash
   npm start
   ```

This should fix the issue and allow the client to run as expected.

---

### **4. Notes**
- **Environment Variables**: Both the server and client may require `.env` files for configuration (e.g., API base URLs, database credentials). Refer to the project documentation for details on setting these up.
- **Build for Production**: To create a production build of the client:
  ```bash
  npm run build
  ```
  The build files will be created in the `client/build` directory, which can be served by the backend server or deployed separately.

--- 
