import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
     return null; // Let PrivateRoute handle loading state if used together, or a spinner here
  }

  if (user && user.role === 'teacher') {
    return children;
  }

  // If user is authenticated but not a teacher, maybe redirect to a forbidden page or student dashboard
  return <Navigate to="/student/dashboard" replace />;
};

export default TeacherRoute;
