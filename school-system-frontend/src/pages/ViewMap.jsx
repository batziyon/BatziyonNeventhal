import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const teacherIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const farStudentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ViewMap() {
  const location = useLocation();
  const { userId, userName, userGrade } = location.state || {};

  const [studentLocations, setStudentLocations] = useState([]);
  const [teacherLocation, setTeacherLocation] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/locations/by-user/${userId}`);
 
      const students = (response.data.students || []).filter(s => Number(s.lat) !== 0);
      const me = (response.data.teachers || []).find(t => String(t.id) === String(userId));

      setStudentLocations(students);
      setTeacherLocation(me);
      setLastUpdate(new Date().toLocaleTimeString('he-IL'));
      setError(null);
    } catch (err) {
      setError('שגיאה בתקשורת עם השרת');
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchAllLocations();
    const interval = setInterval(fetchAllLocations, 5000); 

    return () => clearInterval(interval);
  }, [userId]);

  
  useEffect(() => {
  
    const farStudents = studentLocations.filter(s => s.isFar === true);
    
    if (farStudents.length > 0) {
      const names = farStudents.map(s => `${s.firstName} ${s.lastName}`).join(', ');
      
      alert(`שים לב! התלמידות הבאות התרחקו מעל 3 ק"מ: ${names}`);
    }
  }, [studentLocations]);

  return (
    <div style={{ height: '100vh', width: '100%', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1000 }}>
        <h2 style={{ margin: 0 }}>שלום {userName}, מפת כיתה {userGrade}</h2>
        {lastUpdate && <small>עדכון אחרון: {lastUpdate}</small>}
    
        {studentLocations.some(s => s.isFar) && (
          <div >
            שימי לב: ישנן תלמידות מחוץ לטווח המותר!
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

      <MapContainer center={[32.0853, 34.7818]} zoom={13} style={{ height: 'calc(100% - 110px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  
        {studentLocations.map((student) => (
          <Marker 
            key={`student-${student.id}`} 
            position={[student.lat, student.lng]}
            icon={student.isFar ? farStudentIcon : new L.Icon.Default()}
          >
            <Tooltip permanent direction="top">
              <b>{student.firstName} {student.lastName}</b>
            </Tooltip>
            <Popup>
              <strong>{student.firstName} {student.lastName}</strong><br/>
              מרחק מהמורה: {student.distance} ק"מ <br/>
              {student.isFar ? <b style={{color: 'red'}}>מחוץ לטווח!</b> : <b style={{color: 'green'}}>בטווח תקין</b>}
            </Popup>
          </Marker>
        ))}

        {teacherLocation && (
          <Marker position={[teacherLocation.lat, teacherLocation.lng]} icon={teacherIcon}>
            <Tooltip permanent direction="top"><b>אני (המורה)</b></Tooltip>
            <Popup>המיקום הנוכחי שלי</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default ViewMap;