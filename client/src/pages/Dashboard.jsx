import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { useTranslation } from 'react-i18next';
import {Users } from 'lucide-react';

function Dashboard({ currentUser, setCurrentUser }) {
  const [trips, setTrips] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState('Adventure');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en');
  };

  // שליפת טיולים עבור המשתמש הספציפי
useEffect(() => {
    if (currentUser && currentUser.id) {
      axios.get(`http://localhost:8080/api/trips/user/${currentUser.id}`, {
        withCredentials: true 
      })
        .then(res => {
            console.log("Trips loaded from server:", res.data);
            setTrips(res.data);
        })
        .catch(err => console.error('Error fetching trips:', err));
    }
  }, [currentUser]);

  // פונקציית התנתקות - מנקה את הסטייט ועוברת לדף הלוגין
  const handleLogout = () => {
    localStorage.removeItem('voyago_user');
    //localStorage.removeItem('voyago_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const requestData = {
        userId: currentUser.id,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        style: style,
        language: i18n.language
    };

try {
        console.log("Sending request to AI engine...", requestData);
        const response = await axios.post('http://localhost:8080/api/trips/generate', requestData, {
            withCredentials: true // חשוב כדי שה-JWT יעבור
        });
        
        console.log("Trip saved successfully to DB!", response.data);
        alert("הטיול נוצר ונשמר בהצלחה!");
        
        // מוסיף את הטיול החדש לרשימה במסך בלי לרענן את העמוד!
        setTrips(prevTrips => [...prevTrips, response.data]);
        
        setShowCreateForm(false);
        setDestination('');
        setStartDate('');
        setEndDate('');
        
    } catch (error) {
        console.error("Failed to generate trip with AI:", error);
        alert("שגיאה ביצירת הטיול: " + (error.response?.data?.error || error.message));
    } finally {
        setIsGenerating(false);
    }
  };

  // פונקציה למחיקת טיול
  const handleDeleteTrip = async (tripId) => {
    // נוודא שהמשתמש באמת רוצה למחוק כדי למנוע לחיצות בטעות
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`http://localhost:8080/api/trips/${tripId}`, {
          withCredentials: true 
        });
        
        // מעדכן את המסך מיד: מסנן החוצה את הטיול שנמחק בלי לרענן את העמוד
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
        
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete the trip. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* סרגל צד */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Voyago
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">{t('travel_management')}</p>
        </div>
        
        <nav className="flex-1 p-6">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{t('account')}</h3>
            <div className="flex items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200 me-3">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.username}</p>
                <p className="text-[10px] text-blue-500 font-medium">{t('logged_in')}</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium">
                <span className="me-3">🗺️</span> {t('my_trips')} 
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium">
                <span className="me-3">⚙️</span> {t('profile')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/community')}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium group">
                <Users className="me-3 w-5 h-5 group-hover:scale-110 transition-transform" /> 
                {t('community')}
              </button>
            </li>
            <li> 
              <button 
                onClick={toggleLanguage}
                className="w-full flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold mt-4 border border-blue-100">
                <span className="me-3">🌐</span> {t('switch_lang')}
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
              >
                <span className="me-3">🚪</span> {t('logout')}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* אזור מרכזי */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {showCreateForm ? "Plan a New Adventure" : `${t('welcome')} ${currentUser?.username}`}
              </h1>
              <p className="text-slate-500 mt-2">
                {showCreateForm ? "Let our AI craft the perfect itinerary for you." : t("subtitle")}
              </p>
            </div>
            {!showCreateForm && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 transform active:scale-95">
                {t('new_trip')}
              </button>
            )}
          </header>
          
          {/* החלפה דינמית בין טופס היצירה לבין רשימת הטיולים */}
          {showCreateForm ? (
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                <form onSubmit={handleGenerateTrip} className="space-y-6 max-w-2xl mx-auto">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                        <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" 
                               value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="e.g. Paris, Tokyo..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" 
                                   value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" 
                                   value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Travel Style</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                                value={style} onChange={(e) => setStyle(e.target.value)}>
                            <option value="Adventure">Adventure & Outdoors</option>
                            <option value="Relaxing">Relaxing & Spa</option>
                            <option value="Family">Family Friendly</option>
                            <option value="Culture">Culture & History</option>
                        </select>
                    </div>
                    
                    <button type="submit" disabled={isGenerating} 
                            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isGenerating ? '🤖 Generating your perfect trip...' : '✨ Generate Itinerary'}
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-700">
                        Cancel
                    </button>
                </form>
            </div>
          ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.isArray(trips) && trips.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip}/>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-inner">
              <div className="text-6xl mb-6">🌍</div>
              <h3 className="text-2xl font-bold text-slate-800">No trips planned yet</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Ready for a new adventure? Start by creating your first travel plan.
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="mt-8 bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-100 transition-colors">
                Create a trip now
              </button>
            </div>
          )}
        </div>
        {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white transition-all">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg"></div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('wait_crafting')}</h2>
          <p className="text-blue-200 text-lg font-medium animate-pulse">{t('wait_finding')}  ✈️</p>
        </div>
      )}
      </main>
    </div>
  );
}

export default Dashboard;