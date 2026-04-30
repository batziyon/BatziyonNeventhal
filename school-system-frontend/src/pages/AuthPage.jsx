import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [userType, setUserType] = useState('teacher'); 
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ idNumber: '', fullName: '', grade: '' });
  const navigate = useNavigate();

  // רשימת הכיתות הרלוונטיות (ו' ו-ט')
  const ALL_GRADES = ['ו1', 'ו2', 'ו3', 'ו4', 'ט'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin 
      ? 'http://localhost:3000/auth/login' 
      : 'http://localhost:3000/auth/register';

    // בבניית ה-payload, אנחנו מוודאים שהכיתה נשלחת אם היא קיימת
    const payload = isLogin 
      ? { idNumber: formData.idNumber, role: userType } 
      : { ...formData, role: userType };

    try {
      const response = await axios.post(url, payload);
      const userData = response.data;

      // שמירה ב-SessionStorage לשימוש עתידי באפליקציה
      sessionStorage.setItem('user', JSON.stringify({
        firstName: userData.firstName || formData.fullName.split(' ')[0],
        role: userType,
        idNumber: userData.idNumber,
        grade: userData.grade || formData.grade
      }));

      alert(`שלום ${userData.firstName || 'משתמשת'}, ${isLogin ? 'התחברת' : 'נרשמת'} בהצלחה!`);

      // ניתוב לפי סוג המשתמש
      const targetPath = userType === 'teacher' ? '/teacher-dashboard' : '/';
      
      navigate(targetPath, {
        state: {
          userId: userData.idNumber,
          userName: userData.firstName,
          userGrade: userData.grade || formData.grade 
        }
      });

    } catch (error) {
      console.error("שגיאה בתקשורת:", error);
      alert(error.response?.data?.message || 'חלה שגיאה בתקשורת עם השרת');
    }
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      
      {/* בחירת סוג משתמש */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setUserType('teacher')}
          style={{ 
            padding: '10px 20px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '5px 0 0 5px',
            backgroundColor: userType === 'teacher' ? '#add8e6' : '#f0f0f0',
            fontWeight: userType === 'teacher' ? 'bold' : 'normal'
          }}
        >
          אני מורה
        </button>
        <button 
          onClick={() => setUserType('student')}
          style={{ 
            padding: '10px 20px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '0 5px 5px 0',
            backgroundColor: userType === 'student' ? '#add8e6' : '#f0f0f0',
            fontWeight: userType === 'student' ? 'bold' : 'normal'
          }}
        >
          אני תלמידה
        </button>
      </div>

      <h2>
        {isLogin ? 'כניסה' : 'הרשמה'}
        {userType === 'teacher' ? ' למערכת מורים' : ' לטיול שנתי'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'inline-flex', flexDirection: 'column', width: '280px', gap: '15px', margin: '0 auto' }}>
        
        {/* שם מלא - רק בהרשמה */}
        {!isLogin && (
          <input 
            name="fullName" 
            placeholder="שם מלא" 
            onChange={handleChange} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        )}

        {/* תעודת זהות - תמיד */}
        <input 
          name="idNumber" 
          placeholder="מספר תעודת זהות" 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        {/* בחירת כיתה - מופיע בהרשמה עבור תלמידות תמיד, ועבור מורות אם תרצי לשייך אותן לכיתה */}
        {!isLogin && (
          <select 
            name="grade" 
            onChange={handleChange} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">{userType === 'teacher' ? 'בחרי כיתה לניהול...' : 'בחרי כיתה...'}</option>
            {ALL_GRADES.map(g => <option key={g} value={g}>כיתה {g}</option>)}
          </select>
        )}

        <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          {isLogin ? 'כניסה למערכת' : 'בצע הרשמה'}
        </button>
      </form>

      {/* החלפה בין מצבי כניסה והרשמה */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
        >
          {isLogin ? 'אין לך חשבון? הירשמי כאן' : 'כבר רשומה במערכת? התחברי כאן'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;