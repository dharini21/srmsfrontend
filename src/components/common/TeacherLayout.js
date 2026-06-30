import { useEffect, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="layout">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              ☰
            </button>
            <div className="topbar-title">{title}</div>
          </div>
          <div className="topbar-date">
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
