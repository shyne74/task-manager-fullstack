# Task Manager Backend (Express + PostgreSQL)

## Features
- User registration and login (JWT-based)
- Role-based access (user/admin)
- Task management (CRUD)
- File upload for tasks (up to 3 PDFs)
- PostgreSQL database

## Setup Instructions

### 1. Install Dependencies
```
npm install
```

### 2. Create a `.env` file from `.env.example` and fill in details.

### 3. Run PostgreSQL and create DB
Make sure PostgreSQL is running and DB name matches `.env`

### 4. Start Server
```
node app.js
```

### 5. Run with Docker (optional)
```
docker-compose up
```