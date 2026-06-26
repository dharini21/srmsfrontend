import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { subjectAPI } from '../../services/api';
import TeacherLayout from '../../components/common/TeacherLayout';

const DEFAULT_SUBJECTS = {
  '1': ['English', 'Tamil', 'Mathematics', 'Science'],
  '2': ['English', 'Tamil', 'Mathematics', 'Science'],
  '3': ['English', 'Tamil', 'Mathematics', 'Science', 'Social Science'],
  '4': ['English', 'Tamil', 'Mathematics', 'Science', 'Social Science'],
  '5': ['English', 'Tamil', 'Mathematics', 'Science', 'Social Science'],
};

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({ subjectName: '', className: '' });
  const [adding, setAdding] = useState(false);
  const [activeClass, setActiveClass] = useState('all');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      setSubjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await subjectAPI.seed();
      toast.success(res.data.message);
      fetchSubjects();
    } catch (err) {
      toast.error('Failed to seed subjects');
    } finally {
      setSeeding(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.subjectName || !form.className) {
      toast.error('Subject name and class are required');
      return;
    }
    setAdding(true);
    try {
      await subjectAPI.create(form);
      toast.success('Subject added successfully');
      setForm({ subjectName: '', className: '' });
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await subjectAPI.delete(id);
      toast.success('Subject deleted');
      fetchSubjects();
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  const filtered = activeClass === 'all' ? subjects : subjects.filter(s => s.className === activeClass);

  // Group by class
  const grouped = filtered.reduce((acc, s) => {
    const cls = s.className;
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(s);
    return acc;
  }, {});

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">📚 Subjects</h2>
          <p className="page-subtitle">{subjects.length} subject(s) across all classes</p>
        </div>
        <button className="btn btn-success" onClick={handleSeed} disabled={seeding}>
          {seeding ? '⏳ Loading...' : '🌱 Load Default Subjects'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          {/* Class filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['all', '1', '2', '3', '4', '5'].map((cls) => (
              <button key={cls}
                onClick={() => setActiveClass(cls)}
                className={`btn btn-sm ${activeClass === cls ? 'btn-primary' : 'btn-outline'}`}>
                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            Object.keys(grouped).sort().length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3>No subjects found</h3>
                  <p>Click "Load Default Subjects" to populate all classes</p>
                </div>
              </div>
            ) : (
              Object.keys(grouped).sort().map((cls) => (
                <div className="card" key={cls} style={{ marginBottom: 16 }}>
                  <div className="card-header">
                    <span className="card-title">Class {cls}</span>
                    <span className="badge badge-primary">{grouped[cls].length} subjects</span>
                  </div>
                  <div className="card-body" style={{ padding: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Subject Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[cls].map((s, i) => (
                          <tr key={s._id}>
                            <td style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</td>
                            <td>
                              <span style={{ fontWeight: 500 }}>{s.subjectName}</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(s._id)}>🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Add Subject Form */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 88 }}>
            <div className="card-header">
              <span className="card-title">➕ Add Subject</span>
            </div>
            <div className="card-body">
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label className="form-label">Class *</label>
                  <select className="form-control" value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}>
                    <option value="">Select Class</option>
                    {['1', '2', '3', '4', '5'].map(c =>
                      <option key={c} value={c}>Class {c}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input type="text" className="form-control" placeholder="e.g. Mathematics"
                    value={form.subjectName}
                    onChange={(e) => setForm({ ...form, subjectName: e.target.value })} />
                </div>

                {form.className && (
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Quick Add:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {DEFAULT_SUBJECTS[form.className]?.map((sub) => (
                        <button key={sub} type="button"
                          className="badge badge-primary"
                          style={{ cursor: 'pointer', border: 'none', padding: '5px 10px' }}
                          onClick={() => setForm({ ...form, subjectName: sub })}>
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  disabled={adding}>
                  {adding ? '⏳ Adding...' : '✅ Add Subject'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default Subjects;
