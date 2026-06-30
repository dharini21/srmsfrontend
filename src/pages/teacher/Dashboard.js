import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TeacherLayout from '../../components/common/TeacherLayout';

const gradeColor = {
  'A+': '#059669', 'A': '#10b981', 'B': '#3b82f6',
  'C': '#f59e0b', 'D': '#f97316', 'Fail': '#ef4444'
};

const Dashboard = () => {
  const { teacher } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await teacherAPI.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">Welcome back, {teacher?.name}! 👋</h2>
        <p className="page-subtitle">Here's what's happening in your school today.</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="stat-grid">
            {[
              { label: 'Total Students', value: stats?.totalStudents || 0, icon: '👨‍🎓', color: '#dbeafe', iconColor: '#1e40af' },
              { label: 'Total Classes', value: stats?.totalClasses || 0, icon: '🏫', color: '#d1fae5', iconColor: '#059669' },
              { label: 'Total Subjects', value: stats?.totalSubjects || 0, icon: '📚', color: '#ede9fe', iconColor: '#7c3aed' },
              { label: 'Results Added', value: stats?.recentResults?.length || 0, icon: '📝', color: '#fef3c7', iconColor: '#d97706' },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.color }}>
                  <span>{s.icon}</span>
                </div>
                <div className="stat-info">
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">📋 Recent Results</span>
                <Link to="/results/view" className="btn btn-sm btn-outline">View All</Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {stats?.recentResults?.length === 0 ? (
                  <div className="empty-state" style={{ padding: '32px' }}>
                    <div>No results added yet</div>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Subject</th>
                          <th>Marks</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentResults?.map((r) => (
                          <tr key={r._id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{r.studentId?.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Class {r.studentId?.class} - {r.studentId?.section}
                              </div>
                            </td>
                            <td>{r.subjectId?.subjectName}</td>
                            <td><strong>{r.marks}/100</strong></td>
                            <td>
                              <span style={{
                                color: gradeColor[r.grade] || '#333',
                                fontWeight: 700,
                                fontSize: 14
                              }}>{r.grade}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">⚡ Quick Actions</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { to: '/add-student', label: '➕ Add New Student', color: 'btn-primary' },
                    { to: '/subjects', label: '📚 Manage Subjects', color: 'btn-success' },
                    { to: '/results/add', label: '📝 Add Result', color: 'btn-warning' },
                    { to: '/students', label: '👥 View All Students', color: 'btn-outline' },
                  ].map((a) => (
                    <Link key={a.to} to={a.to} className={`btn ${a.color}`}
                      style={{ justifyContent: 'flex-start' }}>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TeacherLayout>
  );
};

export default Dashboard;
