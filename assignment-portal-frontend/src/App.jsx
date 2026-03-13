import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Teacher Routes */}
      <Route 
        path="/teacher/*" 
        element={
          <PrivateRoute>
            <TeacherRoute>
              {/* Note: In Task 5 and beyond, we will replace this div with TeacherLayout and nested routes */}
              <div className="p-8">Teacher Dashboard Placeholder</div>
            </TeacherRoute>
          </PrivateRoute>
        } 
      />

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
