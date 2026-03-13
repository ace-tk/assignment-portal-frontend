import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherSubmissions from './pages/teacher/TeacherSubmissions';

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
        path="/student/*" 
        element={
          <PrivateRoute>
            <StudentRoute>
               {/* Note: In Task 9 and beyond, we will replace this div with StudentLayout and nested routes */}
              <div className="p-8">Student Dashboard Placeholder</div>
            </StudentRoute>
          </PrivateRoute>
        } 
      />

      {/* Default Fallback Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
