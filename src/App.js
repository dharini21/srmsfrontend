import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TeacherRoute, StudentRoute } from './components/common/ProtectedRoute';

// Teacher pages
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherRegister from './pages/teacher/TeacherRegister';
import Dashboard from './pages/teacher/Dashboard';
import Students from './pages/teacher/Students';
import AddStudent from './pages/teacher/AddStudent';
import Subjects from './pages/teacher/Subjects';
import AddResult from './pages/teacher/AddResult';
import ViewResults from './pages/teacher/ViewResults';

// Student pages
import StudentLogin from './pages/student/StudentLogin';
import Marksheet from './pages/student/Marksheet';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '13.5px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/teacher/login" replace />} />

          {/* Teacher auth */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherRegister />} />

          {/* Teacher protected routes */}
          <Route path="/teacher/dashboard" element={
            <TeacherRoute><Dashboard /></TeacherRoute>
          } />
          <Route path="/students" element={
            <TeacherRoute><Students /></TeacherRoute>
          } />
          <Route path="/add-student" element={
            <TeacherRoute><AddStudent /></TeacherRoute>
          } />
          <Route path="/students/edit/:id" element={
            <TeacherRoute><AddStudent /></TeacherRoute>
          } />
          <Route path="/subjects" element={
            <TeacherRoute><Subjects /></TeacherRoute>
          } />
          <Route path="/results/add" element={
            <TeacherRoute><AddResult /></TeacherRoute>
          } />
          <Route path="/results/view" element={
            <TeacherRoute><ViewResults /></TeacherRoute>
          } />

          {/* Student routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/marksheet" element={
            <StudentRoute><Marksheet /></StudentRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexDirection: 'column', gap: 16
            }}>
              <div style={{ fontSize: 64 }}>🔍</div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif' }}>Page Not Found</h2>
              <a href="/" style={{ color: 'var(--primary)' }}>Go to Home</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
