import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import TeacherLayout from '../../components/common/TeacherLayout';

const INITIAL = { name: '', class: '', section: '', bloodGroup: '', phone: '', email: '' };

const AddStudent = () => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      studentAPI.getById(id)
        .then((res) => setForm(res.data.data))
        .catch(() => toast.error('Failed to load student'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.class) errs.class = 'Class is required';
    if (!form.section.trim()) errs.section = 'Section is required';
    if (!form.bloodGroup) errs.bloodGroup = 'Blood group is required';
    if (!form.phone) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit phone';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter valid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await studentAPI.update(id, form);
        toast.success('Student updated successfully');
      } else {
        await studentAPI.create(form);
        toast.success('Student added successfully');
      }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <TeacherLayout><div className="spinner" /></TeacherLayout>;

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isEdit ? '✏️ Edit Student' : '➕ Add Student'}</h2>
          <p className="page-subtitle">{isEdit ? 'Update student information' : 'Register a new student'}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/students')}>← Back</button>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" className="form-control"
                  placeholder="Student full name"
                  value={form.name} onChange={handleChange} />
                {errors.name && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.name}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Class *</label>
                <select name="class" className="form-control" value={form.class} onChange={handleChange}>
                  <option value="">Select Class</option>
                  {['1', '2', '3', '4', '5'].map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
                {errors.class && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.class}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Section *</label>
                <input type="text" name="section" className="form-control"
                  placeholder="e.g. A, B, C"
                  value={form.section} onChange={handleChange}
                  style={{ textTransform: 'uppercase' }} />
                {errors.section && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.section}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group *</label>
                <select name="bloodGroup" className="form-control" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg =>
                    <option key={bg} value={bg}>{bg}</option>
                  )}
                </select>
                {errors.bloodGroup && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.bloodGroup}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" name="phone" className="form-control"
                  placeholder="10-digit mobile number"
                  value={form.phone} onChange={handleChange} maxLength={10} />
                {errors.phone && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.phone}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" className="form-control"
                  placeholder="student@email.com"
                  value={form.email} onChange={handleChange} />
                {errors.email && <small style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</small>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving...' : isEdit ? '✅ Update Student' : '✅ Add Student'}
              </button>
              <button type="button" className="btn btn-outline"
                onClick={() => navigate('/students')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AddStudent;
