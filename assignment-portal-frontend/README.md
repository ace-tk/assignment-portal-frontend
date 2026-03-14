# Assignment Portal Frontend

A modern, responsive React-based frontend application for managing homework assignments and student submissions. 

Built with **ReactJS (Vite)**, **Tailwind CSS**, and **React Router v7**.

## Features

### Authentication
- Unified login system with JWT handling.
- Role-based routing automatically directing users to the Teacher or Student dashboards.
- Protected routes ensuring security.

### Teacher Dashboard
- **Analytics Overview**: View high-level metrics (Total Assignments, Drafts, Published, Completed).
- **Assignment Management**: 
  - Create, read, update, and delete (CRUD) capabilities via a clean modal interface.
  - Tabbed filtering system to separate Drafts, Published, and Completed work.
  - Easy 1-click publishing.
- **Submissions Review**: 
  - Select an assignment to view all student answers in a structured list.
  - Instantly mark submissions as "Reviewed" with optimistic UI updates.

### Student Dashboard
- **My Assignments**: Grid view of all published materials tailored to the student.
- **Detailed Workflow**: Visual alerts on cards for "Pending", "Submitted", and "Overdue" status.
- **One-Time Submission**: Beautiful detail view that accepts answers and locks down the form once submitted or if the deadline passes.

## Prerequisites

- Node.js (v16.0 or higher recommended)
- npm or yarn

## Installation & Setup

1. **Clone the repository** (or navigate to the project directory if provided):
   ```bash
   cd assignment-portal-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the project with your API path if it differs from the default:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## Design Notes
- **Tailwind CSS** handles all styling, providing a clean, responsive layout heavily utilizing flexbox, grids, and Tailwind's built-in color palettes.
- **React Hot Toast** is used across the application to provide non-intrusive feedback for actions like logging in, creating assignments, or throwing errors.
- **Axios Interceptors** manage all JWT header attachments and handle global 401 unauthenticated drops smoothly.
