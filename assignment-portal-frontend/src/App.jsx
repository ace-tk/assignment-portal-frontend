import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherSubmissions from './pages/teacher/TeacherSubmissions';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Teacher Routes */}
      <Route 
        path="/teacher" 
        element={
          <PrivateRoute>
            <TeacherRoute>
              <TeacherLayout />
            </TeacherRoute>
          </PrivateRoute>
        } 
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="submissions" element={<TeacherSubmissions />} />
        <Route path="" element={<Navigate to="/teacher/dashboard" replace />} />
      </Route>

      {/* Protected Student Routes */}
      <Route 
        path="/student" 
        element={
          <PrivateRoute>
            <StudentRoute>
               <StudentLayout />
            </StudentRoute>
          </PrivateRoute>
        } 
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        {/* Placeholder for Assignment Detail (Task 10) */}
        <Route path="assignment/:id" element={<div className="p-8 text-xl font-bold">Assignment Detail View (Coming in Task 10)</div>} />
        <Route path="" element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* Default Fallback Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
