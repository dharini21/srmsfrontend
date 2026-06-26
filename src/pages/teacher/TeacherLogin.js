import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TeacherLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginTeacher } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await teacherAPI.login(form);
      loginTeacher(res.data.data);
      toast.success(`Welcome back, ${res.data.data.name}!`);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h1 className="auth-title">Teacher Login</h1>
          <p className="auth-subtitle">Student Result Management System</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="teacher@school.edu"
              value={form.email}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In as Teacher'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/teacher/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Register here
          </Link>
        </div>

        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          background: '#f0f9ff',
          borderRadius: 8,
          fontSize: 12,
          color: '#075985'
        }}>
          👨‍🎓 Looking for student portal?{' '}
          <Link to="/student/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
