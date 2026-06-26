import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import TeacherLayout from '../../components/common/TeacherLayout';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass, filterSection]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterClass) params.class = filterClass;
      if (filterSection) params.section = filterSection;
      const res = await studentAPI.getAll(params);
      setStudents(res.data.data);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentAPI.delete(id);
      toast.success('Student deleted successfully');
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const bloodGroupColor = {
    'A+': 'badge-danger', 'A-': 'badge-danger',
    'B+': 'badge-info', 'B-': 'badge-info',
    'O+': 'badge-success', 'O-': 'badge-success',
    'AB+': 'badge-purple', 'AB-': 'badge-purple'
  };

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">{students.length} student(s) found</p>
        </div>
        <Link to="/add-student" className="btn btn-primary">➕ Add Student</Link>
      </div>

      {/* Filters */}
      <div className="search-bar">
        <div className="search-input-wrap" style={{ flex: 2 }}>
          <span className="search-icon">🔍</span>
          <input
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ maxWidth: 140 }}
          value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {['1', '2', '3', '4', '5'].map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <input
          className="form-control"
          style={{ maxWidth: 120 }}
          placeholder="Section"
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
        />
        {(search || filterClass || filterSection) && (
          <button className="btn btn-outline" onClick={() => {
            setSearch(''); setFilterClass(''); setFilterSection('');
          }}>✕ Clear</button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-overlay"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🎓</div>
            <h3>No students found</h3>
            <p>Add your first student to get started</p>
            <Link to="/add-student" className="btn btn-primary" style={{ marginTop: 16 }}>
              ➕ Add Student
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0
                        }}>
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">Class {s.class}</span></td>
                    <td><span className="badge badge-info">{s.section}</span></td>
                    <td><span className={`badge ${bloodGroupColor[s.bloodGroup] || 'badge-info'}`}>{s.bloodGroup}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.phone}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-outline"
                          onClick={() => navigate(`/students/edit/${s._id}`)}>✏️</button>
                        <button className="btn btn-sm btn-danger"
                          onClick={() => setDeleteId(s._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">⚠️ Confirm Delete</span>
              <button className="close-btn" onClick={() => setDeleteId(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this student? This action also removes all their results and cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default Students;
