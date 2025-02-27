# Task Manager with Dashboard

A full-stack task management application built with Next.js, Express.js, and Tailwind CSS.

## Features

- User Authentication (Sign up/Login)
- Task Management (Create, Read, Update, Delete)
- Status tracking for tasks
- Responsive dashboard interface
- Local storage for data persistence

## Tech Stack

- **Frontend:**
  - Next.js 13+
  - Tailwind CSS
  - Hero Icons
  - TypeScript

- **Backend:**
  - Express.js
  - Node.js
  - MongoDB (configured but using localStorage for now)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nhoque101/Task-Manager-with-Dashboard.git
cd Task-Manager-with-Dashboard
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Run the development server:
```bash
# From the root directory
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
task-manager/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 13+ app directory
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
├── server/                # Express.js backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   └── config/           # Configuration files
```

## Features

- User authentication with secure password handling
- Create, edit, and delete tasks
- Set task status (pending, in-progress, completed)
- Responsive design for mobile and desktop
- Real-time updates
- Data persistence using localStorage (can be extended to use MongoDB)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
