# AWDF Practical 6: Full Stack Integration

## Project Overview
This project demonstrates full-stack integration using React, Node.js, Express.js, and MongoDB. It is a Task Manager application that allows users to create, view, update, complete, and delete tasks through a web interface.

## Objectives
- Connect the React frontend to the Node.js and Express.js backend.
- Connect the backend to MongoDB for persistent data storage.
- Implement CRUD operations.
- Handle loading states and errors.
- Display toast notifications for successful and failed operations.
- Verify that task data persists after refreshing the page.

## Technologies Used
- **Frontend:** React, Vite, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **API Communication:** Fetch API
- **Development Tools:** Visual Studio Code, Git, GitHub Desktop

## Project Structure
```text
AWDF-PR6-FullStack/
├── backend/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## Features
- View all tasks.
- Create new tasks.
- Update existing tasks.
- Mark tasks as completed or pending.
- Delete tasks with confirmation.
- Set task priorities.
- Display loading and error messages.
- Show success and error toast notifications.
- Store tasks in MongoDB so data remains available after refreshing the page.

## Installation and Setup

### Prerequisites
Install Node.js and npm, and ensure MongoDB is configured and accessible.

### 1. Start the Backend
Open a terminal in VS Code and run:

```bash
cd backend
npm install
npm start
```

The backend runs at:

```text
http://localhost:3000
```

Ensure your backend environment variables are configured in `backend/.env`. Use `backend/.env.example` as a reference and provide your own MongoDB connection string. Never upload your actual `.env` file or database credentials to GitHub.

### 2. Start the Frontend
Open a second terminal in VS Code and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal. It will usually be `http://localhost:5173` or another available port.

## API Endpoints

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Testing
1. Start the backend and frontend.
2. Create