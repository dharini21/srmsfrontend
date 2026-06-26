import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { studentAPI, subjectAPI, resultAPI } from '../../services/api';
import TeacherLayout from '../../components/common/TeacherLayout';

const gradeInfo = [
  { range: '90-100', grade: 'A+', color: '#059669' },
  { range: '80-89', grade: 'A', color: '#10b981' },
  { range: '70-79', grade: 'B', color: '#3b82f6' },
  { range: '60-69', grade: 'C', color: '#f59e0b' },
  { range: '50-59', grade: 'D', color: '#f97316' },
  { range: 'Below 50', grade: 'Fail', color: '#ef4444' },
];

const AddResult = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ studentId: '', subjectId: '', marks: '' });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    studentAPI.getAll().then(r => setStudents(r.data.data));
  }, []);

  useEffect(() => {
    if (form.studentId) {
      const student = students.find(s => s._id === form.studentId);
      if (student) {
        subjectAPI.getByClass(student.class).then(r => setSubjects(r.data.data));
        setForm(f => ({ ...f, subjectId: '' }));
      }
    }
  }, [form.studentId, students]);

  useEffect(() => {
    const m = parseInt(form.marks);
    if (!isNaN(m) && m >= 0 && m <= 100) {
      let grade = 'Fail';
      if (m >= 90) grade = 'A+';
      else if (m >= 80) grade = 'A';
      else if (m >= 70) grade = 'B';
      else if (m >= 60) grade = 'C';
      else if (m >= 50) grade = 'D';
      setPreview({ marks: m, percentage: m, grade });
    } else {
      setPreview(null);
    }
  }, [form.marks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.subjectId || form.marks === '') {
      toast.error('All fields are required');
      return;
    }
    if (form.marks < 0 || form.marks > 100) {
      toast.error('Marks must be between 0 and 100');
      return;
    }
    setLoading(true);
    try {
      await resultAPI.add(form);
      toast.success('Result saved successfully');
      setForm({ studentId: '', subjectId: '', marks: '' });
      setSubjects([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = students.find(s => s._id === form.studentId);

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">📝 Add Result</h2>
          <p className="page-subtitle">Enter student marks for a subject</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        <div>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Student *</label>
                  <select className="form-control" value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} — Class {s.class} | {s.section}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStudent && (
                  <div style={{
                    padding: '12px 16px', background: '#f0f9ff', borderRadius: 8,
                    marginBottom: 18, display: 'flex', gap: 20
                  }}>
                    <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Name</span>
                      <div style={{ fontWeight: 600 }}>{selectedStudent.name}</div></div>
                    <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Class</span>
                      <div style={{ fontWeight: 600 }}>{selectedStudent.class}</div></div>
                    <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Section</span>
                      <div style={{ fontWeight: 600 }}>{selectedStudent.section}</div></div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Select Subject *</label>
                  <select className="form-control" value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    disabled={!form.studentId}>
                    <option value="">-- Choose Subject --</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.subjectName}</option>
                    ))}
                  </select>
                  {form.studentId && subjects.length === 0 && (
                    <small style={{ color: 'var(--warning)', fontSize: 12 }}>
                      ⚠️ No subjects found for this class. Add subjects first.
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Marks Obtained * (0 - 100)</label>
                  <input type="number" className="form-control" min={0} max={100}
                    placeholder="Enter marks (0-100)"
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: e.target.value })} />
                </div>

                {preview && (
                  <div style={{
                    padding: '14px 18px', borderRadius: 8, marginBottom: 18,
                    background: preview.grade === 'Fail' ? '#fee2e2' : '#d1fae5',
                    display: 'flex', gap: 24, alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Marks</div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{preview.marks}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Percentage</div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{preview.percentage}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Grade</div>
                      <div style={{
                        fontSize: 26, fontWeight: 800,
                        color: gradeInfo.find(g => g.grade === preview.grade)?.color
                      }}>{preview.grade}</div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '⏳ Saving...' : '✅ Save Result'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Grade reference */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">📊 Grade System</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr><th>Marks</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {gradeInfo.map(g => (
                    <tr key={g.grade}>
                      <td>{g.range}</td>
                      <td><span style={{ color: g.color, fontWeight: 700 }}>{g.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AddResult;
