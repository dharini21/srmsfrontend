import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '👨‍🎓' },
  { to: '/add-student', label: 'Add Student', icon: '➕' },
  { to: '/subjects', label: 'Subjects', icon: '📚' },
  { to: '/results/add', label: 'Add Result', icon: '📝' },
  { to: '/results/view', label: 'View Results', icon: '📋' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { teacher, logoutTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutTeacher();
    toast.success('Logged out successfully');
    navigate('/teacher/login');
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            SRMS
            <span>Student Result System</span>
          </div>
        </div>
        <button className="sidebar-close" aria-label="Close menu" onClick={onClose}>✕</button>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div className="sidebar-footer">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          padding: '10px 8px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)'
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0
          }}>
            {teacher?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{teacher?.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Teacher</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{
            width: '100%',
            justifyContent: 'center',
            borderColor: 'rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
