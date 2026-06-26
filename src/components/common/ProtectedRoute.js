import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const TeacherRoute = ({ children }) => {
  const { teacher, loading } = useAuth();
  if (loading) return <div className="spinner"></div>;
  return teacher ? children : <Navigate to="/teacher/login" replace />;
};

export const StudentRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return <div className="spinner"></div>;
  return student ? children : <Navigate to="/student/login" replace />;
};
