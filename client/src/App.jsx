import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
  // שמירת מצב המשתמש ברמת האפליקציה כדי שכל הדפים יוכלו לגשת אליו
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Routes>
      {/* דף התחברות */}
      <Route 
        path="/login" 
        element={<LoginPage setCurrentUser={setCurrentUser} />} 
      />
      
      {/* דף הרשמה */}
      <Route 
        path="/register" 
        element={<RegisterPage setCurrentUser={setCurrentUser} />} 
      />
      
      {/* דף הבית (דשבורד) */}
      {/* אם המשתמש מחובר - מציגים דשבורד. אם לא - מעבירים אותו אוטומטית ללוגין */}
      <Route 
        path="/" 
        element={
          currentUser 
            ? <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} /> 
            : <Navigate to="/login" />
        } 
      />

      {/* נתיב ברירת מחדל לכל כתובת לא מוכרת - חזרה ללוגין */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;