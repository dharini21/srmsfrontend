import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/teacher/dashboard': 'Dashboard',
  '/students': 'Students',
  '/add-student': 'Add Student',
  '/subjects': 'Subjects',
  '/results/add': 'Add Result',
  '/results/view': 'View Results',
};

const TeacherLayout = ({ children }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'SRMS';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
