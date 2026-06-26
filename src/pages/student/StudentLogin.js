import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentLogin = () => {
  const [form, setForm] = useState({ email: '', class: '', section: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.class || !form.section) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const res = await studentAPI.login(form);
      loginStudent(res.data.data);
      toast.success(`Welcome, ${res.data.data.name}!`);
      navigate('/student/marksheet');
    } catch (err) {
      setError(err.response?.data?.message || 'No student found with these details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)'
    }}>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{
            background: 'linear-gradient(135deg, #059669, #10b981)'
          }}>🎓</div>
          <h1 className="auth-title">Student Portal</h1>
          <p className="auth-subtitle">View your digital marksheet</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control"
              placeholder="your@email.com"
              value={form.email} onChange={handleChange} autoFocus />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Class</label>
              <select name="class" className="form-control" value={form.class} onChange={handleChange}>
                <option value="">Select</option>
                {['1', '2', '3', '4', '5'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <input type="text" name="section" className="form-control"
                placeholder="e.g. A" value={form.section} onChange={handleChange}
                style={{ textTransform: 'uppercase' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-success"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            disabled={loading}>
            {loading ? '⏳ Searching...' : '📋 View My Marksheet'}
          </button>
        </form>

        <div style={{
          marginTop: 24, padding: '12px 16px', background: '#f0fdf4',
          borderRadius: 8, fontSize: 12, color: '#065f46'
        }}>
          👩‍🏫 Are you a teacher?{' '}
          <Link to="/teacher/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Teacher Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
