# Task Manager — Full Stack Application

A full-stack Task Management application built with React, Node.js, Express, and MongoDB. It allows users to authenticate securely and manage their personal tasks through a responsive dashboard.

This project was developed as **Task 2 of the AppRo8 Full Stack Developer Internship**.

## Live Demo

- **Frontend:** https://task-manager-fullstack-psi-ecru.vercel.app
- **Backend API:** https://task-manager-fullstack-95ih.vercel.app
- **API Documentation:** https://task-manager-fullstack-95ih.vercel.app/api-docs/

## Features

### Authentication

- User registration and login through the backend API.
- Secure password hashing using bcryptjs.
- JWT-based authentication.
- Protected dashboard routes.
- Automatic JWT attachment to API requests using Axios interceptors.
- Logout functionality.

### Task Management

- Create new tasks.
- View personal tasks.
- Update existing tasks.
- Delete tasks.
- Assign task statuses:
  - Pending
  - In Progress
  - Completed
- Search tasks.
- Filter tasks by status.

### User Experience

- Responsive dashboard layout.
- Loading and error states.
- Success and error feedback.
- Protected navigation.
- Clean and user-friendly interface.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Zod
- CORS
- dotenv
- Swagger UI
- Swagger JSDoc

## Application Architecture

The application follows a client-server architecture.

```text
React Frontend
      |
      | HTTP Requests (Axios)
      | JWT Authorization Header
      v
Express Backend
      |
      | Routes
      v
Authentication Middleware
      |
      v
Controllers
      |
      v
Mongoose Models
      |
      v
MongoDB Database
      |
      v
JSON Response
      |
      v
React Dashboard
```

## Project Structure

```text
task-manager-fullstack/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validateMiddleware.js
│   │   ├── models/
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── vercel.json
│
├── .gitignore
├── package-lock.json
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js (LTS recommended)
- npm
- MongoDB Atlas account or a MongoDB instance
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FatimaGhafoor/task-manager-fullstack.git

cd task-manager-fullstack
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

## Environment Variables

The application requires environment variables for frontend API configuration and backend services.

### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to your deployed backend API base URL.

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```

**Important:** Never commit `.env` files or expose database credentials and JWT secrets publicly.

## Running Locally

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### Start the Frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Authenticate a user |

### Task Routes

All task routes require a valid JWT access token.

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/tasks`     | Get authenticated user's tasks |
| POST   | `/tasks`     | Create a new task              |
| PUT    | `/tasks/:id` | Update a task                  |
| DELETE | `/tasks/:id` | Delete a task                  |

## Authentication Flow

1. A user registers or logs in through the authentication API.
2. The backend verifies credentials.
3. A JWT access token is generated and returned.
4. The frontend stores the token in localStorage.
5. Axios request interceptors automatically attach the token to protected API requests.
6. Authentication middleware verifies the token on the backend.
7. Authorized users can access their own tasks.

Authorization header format:

```http
Authorization: Bearer <your_jwt_token>
```

## API Documentation

Swagger UI provides interactive API documentation.

Visit:

https://task-manager-fullstack-95ih.vercel.app/api-docs/

You can explore available endpoints and test API requests using the Swagger interface.

## Validation and Error Handling

- Zod is used for request validation.
- Authentication middleware protects task routes.
- Centralized error handling manages API errors.
- Users can access and manage only their own tasks.

## Deployment

The application is deployed using Vercel.

- **Frontend:** Deployed as a Vite application using the `client` directory as the root directory.
- **Backend:** Deployed as a Node.js application using the `server` directory as the root directory.
- **Database:** MongoDB Atlas.

Production environment variables must be configured in the Vercel project settings.

## Author

**Fatima Ghafoor**

- GitHub: [FatimaGhafoor](https://github.com/FatimaGhafoor)
- LinkedIn: [Fatima Ghafoor](https://www.linkedin.com/in/fatima-ghafoor-a1b356225/)

## Acknowledgment

Developed as part of the **AppRo8 Full Stack Developer Internship**.
