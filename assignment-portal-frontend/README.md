# Assignment Workflow Portal – Frontend

## Overview

This project is the **frontend application** for the Assignment Workflow Portal built using **React.js**.

The portal allows teachers and students to log in through a **single login page** and access role-based dashboards.

After authentication:

* Teachers are redirected to the **Teacher Dashboard**
* Students are redirected to the **Student Dashboard**

---

## Features

### Login

* Single login page for both teachers and students
* Users enter **email and password**
* After authentication, users are redirected based on their role

### Teacher Dashboard

Teachers can manage the lifecycle of assignments.

Each assignment contains:

* Title
* Description
* Due Date
* Status

Assignment workflow:
Draft → Published → Completed

Teacher capabilities:

* Create assignments
* Edit assignments in Draft state
* Delete assignments in Draft state
* Publish assignments
* Mark assignments as Completed
* View student submissions

### Student Dashboard

Students can:

* View **Published assignments**
* Submit answers (text-based)
* View their submitted answers

Restrictions:

* Only one submission per assignment
* Submitted answers cannot be edited

---

## Technology Used

* React.js

---

## Setup Instructions

Clone the repository:

git clone <repository-url>

Navigate to the project directory:

cd assignment-portal-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The application will run locally on:

http://localhost:5173

---

## Project Structure

src/
components/
pages/
App.jsx
main.jsx

---

## Notes

* The frontend communicates with the backend APIs for authentication and assignment management.
* Role-based UI rendering ensures teachers and students see only relevant features.
* Basic form validation and error handling are implemented on the client side.

---

## Future Enhancements

* Pagination for assignment lists
* Prevent submissions after due date
* Dashboard analytics
