import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ViewMap from './pages/ViewMap';
import './App.css';

const ProtectedRoute = ({ children, allowedRole }) => {

  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user) {
  alert('אין לך הרשאה לגשת לדף זה');
    return <Navigate to="/" replace />;
  }


  if (allowedRole && user.role !== allowedRole) {
    alert('אין לך הרשאה לגשת לדף זה');
    return <Navigate to="/" replace />;
  }


  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ViewMap" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <ViewMap />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;