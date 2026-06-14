import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // הכנה לתרגומים

function Profile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [preferencesList, setPreferencesList] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // הצעות להעדפות נפוצות
  const suggestedPreferences = [
    "👨‍👩‍👧‍👦 Traveling with young children (needs relaxed pace)",
    "💰 Budget-friendly options preferred",
    "🕍 Kosher food and Shabbat observant",
    "🥦 Vegetarian/Vegan food options",
    "🏛️ Focus on history and culture"
  ];

  // טעינת הנתונים הראשונית: הופך את הטקסט מהשרת למערך
  useEffect(() => {
    console.log("User data from server:", currentUser); // דיבאג: בודק מה באמת הגיע מהשרת

    // מושך את השדה, לא משנה אם השרת שלח אותו ב-CamelCase או באותיות קטנות
    const prefsFromServer = currentUser?.aiPreferences || currentUser?.ai_preferences || currentUser?.aipreferences;

    if (prefsFromServer) {
      try {
        // מקרה 1: השרת/Axios כבר הפכו את זה למערך אוטומטית
        if (Array.isArray(prefsFromServer)) {
          setPreferencesList(prefsFromServer);
          return;
        }

        // מקרה 2: זה טקסט שמתחיל כמו מערך JSON
        if (typeof prefsFromServer === 'string' && prefsFromServer.trim().startsWith('[')) {
          const parsedPrefs = JSON.parse(prefsFromServer);
          if (Array.isArray(parsedPrefs)) {
            setPreferencesList(parsedPrefs);
            return;
          }
        }

        // מקרה 3 (גיבוי): זה סתם טקסט ישן. ננקה מרכאות מיותרות ונהפוך למערך
        if (typeof prefsFromServer === 'string') {
          const cleanText = prefsFromServer.replace(/^"|"$/g, ''); 
          if (cleanText.includes(',')) {
            setPreferencesList(cleanText.split(',').map(p => p.trim()).filter(Boolean));
          } else {
            setPreferencesList([cleanText]);
          }
        }
      } catch (e) {
        console.error("Error parsing preferences:", e);
        setPreferencesList([prefsFromServer]); // ברירת מחדל אחרונה במקרה של קריסה
      }
    }
  }, [currentUser]);

  // הוספת העדפה חדשה לרשימה
  const handleAddPreference = (textToAdd) => {
    const text = textToAdd || currentInput;
    if (!text.trim()) return; // מונע הוספת שורות ריקות
    
    // מוודא שההעדפה לא קיימת כבר
    if (!preferencesList.includes(text.trim())) {
      setPreferencesList(prev => [...prev, text.trim()]);
    }
    setCurrentInput(''); // מנקה את תיבת הטקסט
  };

  // מחיקת העדפה
  const handleDelete = (indexToRemove) => {
    setPreferencesList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // עריכת העדפה (מוחק אותה מהרשימה ומחזיר לתיבת הטקסט)
  const handleEdit = (indexToEdit, text) => {
    setCurrentInput(text);
    handleDelete(indexToEdit);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // הופך את המערך בחזרה לטקסט בשביל השרת
      const stringifiedPrefs = JSON.stringify(preferencesList);

      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}/preferences`, 
        { aiPreferences: stringifiedPrefs },
        { withCredentials: true }
      );
      
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      localStorage.setItem('voyago_user', JSON.stringify(updatedUser));
      
      alert("Smart Travel Profile updated successfully! 🚀");
      
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            <span className="me-2">←</span> Back
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
          Profile & Settings
        </h1>

        <div className="space-y-8">
          {/* כרטיסיית פרטי חשבון */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="me-2">👤</span> Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <input type="text" disabled value={currentUser?.username || ''} className="w-full p-4 bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input type="email" disabled value={currentUser?.email || 'user@example.com'} className="w-full p-4 bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* כרטיסיית העדפות AI חכמות */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-[2rem] shadow-sm border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
              <span className="me-2">✨</span> Smart Travel Profile
            </h2>
            <p className="text-blue-700/80 text-sm mb-6 font-medium">
              Build your travel rules. Click suggestions or type your own. Our AI will automatically apply these to every trip!
            </p>
            
            {/* הצעות מהירות */}
            <div className="mb-6">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Suggested Preferences:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPreferences.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreference(suggestion)}
                    className="bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* אזור הקלדה */}
            <div className="flex gap-3 mb-6">
              <input 
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPreference()}
                placeholder="Add a custom rule (e.g., 'We hate early mornings')"
                className="flex-1 p-4 bg-white border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="button"
                onClick={() => handleAddPreference()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-sm active:scale-95 disabled:bg-slate-300"
                disabled={!currentInput.trim()}
              >
                Add
              </button>
            </div>

            {/* רשימת ההעדפות שנשמרו */}
            {preferencesList.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-inner">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ms-2">Your Saved Rules:</p>
                <ul className="space-y-2">
                  {preferencesList.map((pref, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors group">
                      <span className="text-sm font-medium text-slate-700">{pref}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => handleEdit(index, pref)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit">✏️</button>
                        <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 p-1" title="Delete">🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* כפתור שמירה לשרת */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 transform active:scale-95 disabled:bg-slate-400"
            >
              {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;