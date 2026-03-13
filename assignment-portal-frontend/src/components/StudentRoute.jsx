import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
      return null;
  }

  if (user && user.role === 'student') {
    return children;
  }

  // If user is authenticated but not a student, redirect to teacher dashboard
  return <Navigate to="/teacher/dashboard" replace />;
};

export default StudentRoute;
