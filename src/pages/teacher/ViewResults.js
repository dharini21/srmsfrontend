import { useState, useEffect } from 'react';
import { resultAPI } from '../../services/api';
import TeacherLayout from '../../components/common/TeacherLayout';
import toast from 'react-hot-toast';

const gradeColor = {
  'A+': '#059669', 'A': '#10b981', 'B': '#3b82f6',
  'C': '#f59e0b', 'D': '#f97316', 'Fail': '#ef4444'
};

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultAPI.getAll()
      .then(r => setResults(r.data.data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await resultAPI.delete(id);
      toast.success('Result deleted');
      setResults(results.filter(r => r._id !== id));
    } catch {
      toast.error('Failed to delete result');
    }
  };

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">📋 All Results</h2>
          <p className="page-subtitle">{results.length} result(s) recorded</p>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading-overlay"><div className="spinner" /></div> :
          results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No results yet</h3>
              <p>Add results using the Add Result page</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>%</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{r.studentId?.name}</td>
                      <td>
                        <span className="badge badge-primary">
                          {r.studentId?.class}-{r.studentId?.section}
                        </span>
                      </td>
                      <td>{r.subjectId?.subjectName}</td>
                      <td><strong>{r.marks}/100</strong></td>
                      <td>{r.percentage?.toFixed(1)}%</td>
                      <td>
                        <span style={{
                          color: gradeColor[r.grade] || '#333',
                          fontWeight: 700, fontSize: 15
                        }}>{r.grade}</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(r._id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </TeacherLayout>
  );
};

export default ViewResults;
