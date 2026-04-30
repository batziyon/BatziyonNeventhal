import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [userType, setUserType] = useState('teacher'); 
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ idNumber: '', fullName: '', grade: '' });
  const navigate = useNavigate();

  const SIXTH_GRADES = ['ו1', 'ו2', 'ו3', 'ו4'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin 
      ? 'http://localhost:3000/auth/login' 
      : 'http://localhost:3000/auth/register';

    const payload = isLogin 
      ? { idNumber: formData.idNumber, role: userType } 
      : { ...formData, role: userType };

    try {
      const response = await axios.post(url, payload);
      const userData = response.data;

      sessionStorage.setItem('user', JSON.stringify({
        firstName: userData.firstName,
        role: userType,
        idNumber: userData.idNumber
      }));

      alert(`שלום ${userData.firstName || 'משתמשת'}, ${isLogin ? 'התחברת' : 'נרשמת'} בהצלחה!`);


      const targetPath = userType === 'teacher' ? '/teacher-dashboard' : '/';
      
      navigate(targetPath, {
        state: {
          userId: userData.idNumber,
          userName: userData.firstName,
          userGrade: userData.grade || formData.grade 
        }
      });

    } catch (error) {
      console.error("שגיאה בהתחברות:", error);
      alert(error.response?.data?.message || 'חלה שגיאה בתקשורת עם השרת');
    }
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', textAlign: 'center' }}>
      

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setUserType('teacher')}
          style={{ backgroundColor: userType === 'teacher' ? '#add8e6' : '#f0f0f0', marginLeft: '10px' }}
        >
          אני מורה
        </button>
        <button 
          onClick={() => setUserType('student')}
          style={{ backgroundColor: userType === 'student' ? '#add8e6' : '#f0f0f0' }}
        >
          אני תלמידה
        </button>
      </div>

      <h2>
        {isLogin ? 'כניסה' : 'רישום'}
        {userType === 'teacher' ? ' למערכת מורים' : ' לטיול שנתי'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'inline-flex', flexDirection: 'column', width: '250px', gap: '10px' }}>
        
        {!isLogin && (
          <input 
            name="fullName" 
            placeholder="שם מלא" 
            onChange={handleChange} 
            required 
            style={{ padding: '8px' }}
          />
        )}

        <input 
          name="idNumber" 
          placeholder="תעודת זהות" 
          onChange={handleChange} 
          required 
          style={{ padding: '8px' }}
        />

        {!isLogin && userType === 'student' && (
          <select name="grade" onChange={handleChange} required style={{ padding: '8px' }}>
            <option value="">בחרי כיתה...</option>
            {SIXTH_GRADES.map(g => <option key={g} value={g}>כיתה {g}</option>)}
          </select>
        )}

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'כניסה' : 'הרשמה'}
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'אין לך חשבון? הירשמי כאן' : 'כבר רשומה? התחברי כאן'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;