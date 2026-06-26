import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTeacher = localStorage.getItem('teacher');
    const storedStudent = sessionStorage.getItem('student');
    if (storedTeacher) setTeacher(JSON.parse(storedTeacher));
    if (storedStudent) setStudent(JSON.parse(storedStudent));
    setLoading(false);
  }, []);

  const loginTeacher = (data) => {
    setTeacher(data);
    localStorage.setItem('teacher', JSON.stringify(data));
  };

  const logoutTeacher = () => {
    setTeacher(null);
    localStorage.removeItem('teacher');
  };

  const loginStudent = (data) => {
    setStudent(data);
    sessionStorage.setItem('student', JSON.stringify(data));
  };

  const logoutStudent = () => {
    setStudent(null);
    sessionStorage.removeItem('student');
  };

  return (
    <AuthContext.Provider value={{
      teacher, student, loading,
      loginTeacher, logoutTeacher,
      loginStudent, logoutStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
