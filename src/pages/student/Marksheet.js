import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resultAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const gradeColor = {
  'A+': '#059669', 'A': '#10b981', 'B': '#3b82f6',
  'C': '#f59e0b', 'D': '#f97316', 'Fail': '#ef4444'
};

const Marksheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { student, logoutStudent } = useAuth();
  const navigate = useNavigate();
  const marksheetRef = useRef(null);

  useEffect(() => {
    if (!student) return;
    resultAPI.getByStudent(student._id)
      .then(r => setData(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'No results found yet'))
      .finally(() => setLoading(false));
  }, [student]);

  const handleLogout = () => {
    logoutStudent();
    navigate('/student/login');
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    toast.loading('Generating PDF...');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;
      const canvas = await html2canvas(marksheetRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`marksheet_${student?.name?.replace(' ', '_')}.pdf`);
      toast.dismiss();
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.dismiss();
      toast.error('PDF download failed');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 'clamp(12px, 4vw, 20px)' }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 760, margin: '0 auto 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>
          📋 My Marksheet
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!error && (
            <>
              <button className="btn btn-outline btn-sm" onClick={handlePrint}>🖨️ Print</button>
              <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>⬇️ Download PDF</button>
            </>
          )}
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {error ? (
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Results Found</h3>
              <p>{error}</p>
              <p style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>
                Your teacher hasn't uploaded your results yet. Please check back later.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div ref={marksheetRef} className="marksheet" style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Header */}
          <div className="marksheet-header">
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏫</div>
            <div className="school-name">Sri Vidya Vikas School</div>
            <div className="marksheet-subtitle">Affiliated to Tamil Nadu State Board</div>
            <div style={{
              marginTop: 12, display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 20px', borderRadius: 20,
              fontSize: 13, fontWeight: 600, letterSpacing: '0.05em'
            }}>
              STUDENT MARK SHEET — Academic Year 2024–25
            </div>
          </div>

          <div className="marksheet-body">
            {/* Student details */}
            <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              Student Information
            </div>
            <div className="student-info-grid">
              {[
                { label: 'Student Name', value: data.student?.name },
                { label: 'Class', value: `Class ${data.student?.class}` },
                { label: 'Section', value: data.student?.section },
                { label: 'Blood Group', value: data.student?.bloodGroup },
              ].map(({ label, value }) => (
                <div className="info-item" key={label}>
                  <span className="info-label">{label}</span>
                  <span className="info-value">{value}</span>
                </div>
              ))}
            </div>

            {/* Marks table */}
            <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              Subject-wise Marks
            </div>
            <div className="table-container" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <table className="marks-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Subject</th>
                    <th style={{ textAlign: 'center' }}>Marks Obtained</th>
                    <th style={{ textAlign: 'center' }}>Total Marks</th>
                    <th style={{ textAlign: 'center' }}>Grade</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results?.map((r, i) => (
                    <tr key={r._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{r.subjectId?.subjectName}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{r.marks}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>100</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: gradeColor[r.grade], fontWeight: 800, fontSize: 15 }}>
                          {r.grade}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${r.grade === 'Fail' ? 'badge-danger' : 'badge-success'}`}>
                          {r.grade === 'Fail' ? 'Fail' : 'Pass'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="result-summary">
              {[
                { label: 'Total Marks', value: `${data.summary.totalMarks}/${data.summary.maxMarks}` },
                { label: 'Percentage', value: `${data.summary.overallPercentage}%` },
                { label: 'Overall Grade', value: data.summary.overallGrade },
                { label: 'Result', value: data.summary.status },
              ].map(({ label, value }) => (
                <div className="summary-item" key={label}>
                  <div className="summary-value" style={{
                    color: label === 'Result'
                      ? (data.summary.status === 'Pass' ? '#059669' : '#ef4444')
                      : label === 'Overall Grade'
                      ? gradeColor[data.summary.overallGrade]
                      : 'var(--primary)'
                  }}>{value}</div>
                  <div className="summary-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 28, paddingTop: 16, borderTop: '1px dashed var(--border)',
              display: 'flex', justifyContent: 'space-between', fontSize: 12,
              color: 'var(--text-muted)'
            }}>
              <span>Generated: {new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}</span>
              <span>Sri Vidya Vikas School — Official Marksheet</span>
            </div>
          </div>
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .marksheet, .marksheet * { visibility: visible; }
          .marksheet { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Marksheet;
