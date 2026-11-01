# AWDF Practical 7 – Task Management System with Authentication

## Project Overview
This project is a full-stack Task Management System developed using React, Node.js, Express.js, and MongoDB. It allows users to create, view, update, and delete tasks. Authentication and authorization middleware have been implemented using JSON Web Tokens (JWT) to secure access to protected routes.

## Objectives
- Develop a full-stack web application using React and Node.js.
- Connect the backend to MongoDB for data storage.
- Implement CRUD operations for task management.
- Implement user registration and login functionality.
- Generate and verify JWT tokens for authentication.
- Protect API routes using authentication middleware.
- Test API endpoints using Postman.

## Technologies Used
- **Frontend:** React, Vite, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt (if configured in the project)
- **API Testing:** Postman
- **Version Control:** Git and GitHub

## Features
- User registration and login
- JWT token generation after successful login
- Authentication middleware for protected routes
- Secure task management API
- Create new tasks
- Retrieve existing tasks
- Update task details and completion status
- Delete tasks
- Task priority management
- React frontend integrated with the backend API
- MongoDB database integration

## Project Structure

```text
AWDF-PR6-FullStack/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

*Note: The folder structure may vary depending on the final implementation.*

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive a JWT token |

### Task Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

**Authentication:** For protected task endpoints, include the JWT token in the request header:

```text
Authorization: Bearer <your_jwt_token>
```

*Use the exact authentication paths configured in your backend if they differ from those listed above.*

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack.git
cd AWDF-PR6-FullStack
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Configure the required environment variables in the backend `.env` file. For example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the variable names expected by your actual backend code. Do not commit the `.env` file or publish your database credentials or JWT secret.

Start the backend:

```bash
npm start
```

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## Testing with Postman

The following operations were tested during implementation:

1. User login using `POST /auth/login`.
2. Successful login response containing a JWT token.
3. Task creation using `POST /tasks`.
4. Retrieving tasks using `GET /tasks`.
5. Updating a task using `PUT /tasks/:id`.
6. Deleting a task using `DELETE /tasks/:id`.
7. Verifying that protected requests use the authentication token.

## Learning Outcomes
- Understanding full-stack application development.
- Connecting React with a REST API.
- Performing CRUD operations with MongoDB and Mongoose.
- Implementing JWT-based authentication.
- Using middleware to protect API routes.
- Testing APIs with Postman.
- Managing project changes using Git and GitHub.

## Conclusion
The project demonstrates a full-stack Task Management System with database integration, CRUD functionality, and JWT-based authentication. Practical 7 extends the earlier task management application by introducing authentication and middleware to protect API access.

## Repository
GitHub: https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack
