import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import Profile from './pages/Profile';
import Community from './pages/Community';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {

  const { i18n } = useTranslation();

  useEffect(() => {
    // מגדיר את הכיוון לפני השפה
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('voyago_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Routes> {/* דף התחברות */} <Route path="/login" 
        element={<LoginPage setCurrentUser={setCurrentUser} />} />
      
      {/* דף הרשמה */}
      <Route 
        path="/register" 
        element={<RegisterPage setCurrentUser={setCurrentUser} />} 
      />
      
      {/* דף הבית (דשבורד) */}
      {/* אם המשתמש מחובר - מציגים דשבורד. אם לא - מעבירים אותו אוטומטית ללוגין */}
      <Route path="/" element={ currentUser ? 
          <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} /> : 
          <Navigate to="/login" />} />
      {/* נתיב ברירת מחדל לכל כתובת לא מוכרת - חזרה ללוגין */}
      <Route path="*" element={<Navigate to="/login" />} />

      <Route path="/trip/:tripId" element={<TripView />} />
      <Route path="/profile" element={currentUser ? <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
      <Route path="/community" element={<Community />} />
    </Routes>
  );
}

export default App;