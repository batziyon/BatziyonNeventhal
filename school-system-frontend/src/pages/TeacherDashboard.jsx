import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TeacherDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { userId, userName, userGrade } = location.state || {};

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const [teacherName, setTeacherName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [teachersList, setTeachersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  const handleSearch = async (e, type) => {
    e.preventDefault();
    const searchTerm = type === 'teacher' ? teacherName : studentName;
    
    const url = type === 'teacher'
      ? `http://localhost:3000/auth/search-teacher`
      : `http://localhost:3000/auth/search-student`;

    try {
      const response = await axios.get(url, { params: { name: searchTerm } });
      alert(response.data.message || "נמצאו תוצאות");
    } catch (error) {
      alert(error.response?.data?.message || 'חלה שגיאה בחיפוש');
    }
  };

  const findAllTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/teachers');
      setTeachersList(response.data);
    } catch (error) {
      alert('לא הצלחנו לטעון את רשימת המורות');
    }
  };
  const getStudentsByGrade = async () => {
    if (!userGrade) {
      alert("לא נמצאה כיתה משויכת");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/auth/students-by-grade`, {
        params: { grade: userGrade }
      });
      setStudentsList(response.data);
    } catch (error) {

      alert('שגיאה בטעינת תלמידות הכיתה');
    }
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #4CAF50', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1>שלום {userName || 'מורה'}!</h1>
        <p>כיתה מנהלת: <b style={{ color: '#2e7d32' }}>{userGrade || 'לא הוגדרה'}</b></p>
      </header>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
   
        <section style={{ flex: 1, minWidth: '300px' }}>
          <h3>חיפוש משתמשים</h3>
          <form onSubmit={(e) => handleSearch(e, 'teacher')} style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="חפשי מורה לפי שם..."
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              style={{ padding: '8px', marginLeft: '5px' }}
            />
            <button type="submit">חפשי</button>
          </form>

          <form onSubmit={(e) => handleSearch(e, 'student')} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="חפשי תלמידה לפי שם..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={{ padding: '8px', marginLeft: '5px' }}
            />
            <button type="submit">חפשי</button>
          </form>

          <div style={{ marginTop: '40px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            <h4>פעולות מהירות:</h4>
            <button 
              onClick={() => navigate('/ViewMap', { state: { userId, userName, userGrade } })} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              צפייה במיקומי הכיתה על המפה 
            </button>
          </div>
        </section>

        <section style={{ flex: 2, display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <button onClick={findAllTeachers} style={{ width: '100%' }}>כל המורות</button>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              {teachersList.map((t, i) => (
                <li key={i} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                  {t.firstName} {t.lastName} <small>({t.grade})</small>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1, border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <button onClick={getStudentsByGrade} style={{ width: '100%' }}>תלמידות כיתה {userGrade}</button>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              {studentsList.map((s, i) => (
                <li key={i} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                  {s.firstName} {s.lastName}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}

export default TeacherDashboard;