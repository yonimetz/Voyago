import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { Users, Map, Settings, Globe, LogOut, Sparkles, Mountain, Landmark, Coffee, Smile, Wand2, Bot, MapPin, PlaneTakeoff } from 'lucide-react';

function Dashboard({ currentUser, setCurrentUser }) {
  const [trips, setTrips] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState('Recommended');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const navigate = useNavigate();
  
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en');
  };

  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  useEffect(() => {
    if (destination.length < 2 || !showSuggestions) {
        setSuggestions([]);
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
        setIsSearchingLocation(true);
        try {
            const lang = i18n.language === 'he' ? 'he' : 'en';
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${destination}&format=json&limit=5&accept-language=${lang}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setIsSearchingLocation(false);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [destination, i18n.language, showSuggestions]);

  const handleSelectLocation = (placeName) => {
    setDestination(placeName);
    setShowSuggestions(false);
  };

  const travelStyles = [
    { 
        id: 'Recommended', 
        icon: <Sparkles className="w-6 h-6" />, 
        label: t('style_recommended_label', 'Recommended'), 
        desc: t('style_recommended_desc', 'A perfect balance of top highlights') 
    },
    { 
        id: 'Nature & Outdoors', 
        icon: <Mountain className="w-6 h-6" />, 
        label: t('style_nature_label', 'Nature Focus'), 
        desc: t('style_nature_desc', 'Emphasis on scenery & trails') 
    },
    { 
        id: 'Culture & History', 
        icon: <Landmark className="w-6 h-6" />, 
        label: t('style_culture_label', 'Culture Focus'), 
        desc: t('style_culture_desc', 'Emphasis on heritage & museums') 
    },
    { 
        id: 'Relaxing & Leisure', 
        icon: <Coffee className="w-6 h-6" />, 
        label: t('style_relaxing_label', 'Relaxing Vibes'), 
        desc: t('style_relaxing_desc', 'Emphasis on chill & slow pace') 
    },
    { 
        id: 'Family Friendly', 
        icon: <Smile className="w-6 h-6" />, 
        label: t('style_family_label', 'Family Friendly'), 
        desc: t('style_family_desc', 'Emphasis on fun for all ages') 
    }
  ];

  useEffect(() => {
    if (currentUser && currentUser.id) {
      setIsLoadingTrips(true);
      axios.get(`http://localhost:8080/api/trips/user/${currentUser.id}`, {
        withCredentials: true 
      })
        .then(res => {
            setTrips(res.data);
        })
        .catch(err => console.error('Error fetching trips:', err))
        .finally(() => {
            setIsLoadingTrips(false);
        });
    } else {
      setIsLoadingTrips(false);
    }
  }, [currentUser]);
  
  const handleLogout = () => {
    localStorage.removeItem('voyago_user');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();

    const start = new Date(startDate);  //וולידציה
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        toast.error("Start date cannot be in the past!");
        return;
    }

    if (end < start) {
        toast.error("End date must be after the start date!");
        return;
    }

    const diffTime = Math.abs(end - start);  //הגבלה 14 ימים
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays > 14) {
        toast.error(`Your trip is ${diffDays} days long. The maximum allowed is 14 days to ensure high-quality itineraries.`);
        return;
    }
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
        const response = await axios.post('http://localhost:8080/api/trips/generate', requestData, {
            withCredentials: true 
        });
        
        toast.success("הטיול נוצר ונשמר בהצלחה!");
        
        setTrips(prevTrips => [...prevTrips, response.data]);
        
        setShowCreateForm(false);
        setDestination('');
        setStartDate('');
        setEndDate('');
        
    } catch (error) {
        console.error("Error generating trip:", error);
        
        const fullErrorText = JSON.stringify(error.response?.data || error.message).toLowerCase();
        
        if (fullErrorText.includes("503") || fullErrorText.includes("demand") || fullErrorText.includes("unavailable")) {
            toast('The AI service is experiencing extremely high demand right now. Please wait a minute and try again.', {
                icon: <Bot className="w-5 h-5 text-white" />,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
            });
        } else {
            toast.error("Failed to generate your trip. Please try again.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`http://localhost:8080/api/trips/${tripId}`, {
          withCredentials: true 
        });
        
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
        toast.success("הטיול נמחק בהצלחה!");
        
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast.error("Failed to delete the trip. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      <Toaster position="bottom-center" />

      {/* סרגל צד */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Voyago
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">{t('travel_management', 'Travel Management')}</p>
        </div>
        
        <nav className="flex-1 p-6">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{t('account', 'Account')}</h3>
            <div className="flex items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200 me-3">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.username}</p>
                <p className="text-[10px] text-blue-500 font-medium">{t('logged_in', 'Logged In')}</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium group">
                <Map className="me-3 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" /> {t('my_trips', 'My Trips')} 
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium group">
                <Settings className="me-3 w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" /> {t('profile', 'Profile')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/community')}
                className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium group">
                <Users className="me-3 w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" /> 
                {t('community', 'Community')}
              </button>
            </li>
            <li> 
              <button 
                onClick={toggleLanguage}
                className="w-full flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold mt-4 border border-blue-100 group">
                <Globe className="me-3 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> {t('switch_lang', 'Switch Language')}
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium group"
              >
                <LogOut className="me-3 w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" /> {t('logout', 'Logout')}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* אזור מרכזי */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {showCreateForm ? t('plan_new_adventure', 'Plan a New Adventure') : `${t('welcome', 'Welcome back,')} ${currentUser?.username}`}
              </h1>
              <p className="text-slate-500 mt-2">
                {showCreateForm ? t('ai_craft_itinerary', 'Let our AI craft the perfect itinerary for you.') : t("subtitle", "Manage your adventures")}
              </p>
            </div>
            {!showCreateForm && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 transform active:scale-95">
                <MapPin className="w-5 h-5" /> {t('new_trip', 'New Trip')}
              </button>
            )}
          </header>
          
          {isLoadingTrips ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your adventures...</p>
            </div>
          ) : showCreateForm ? (
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                <form onSubmit={handleGenerateTrip} className="space-y-6 max-w-2xl mx-auto">
                    
                    {/* שדה היעד */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t('destination')}</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all pl-11" 
                                value={destination} 
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setShowSuggestions(true);
                                }} 
                                required 
                                placeholder={t('e.g. Paris, Tuscany, Spain...')} 
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            
                            {/* עיגול טעינה קטן כשמחפשים מקום */}
                            {isSearchingLocation && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
                                {suggestions.map((item) => (
                                    <div 
                                        key={item.place_id}
                                        onClick={() => handleSelectLocation(item.display_name)}
                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                    >
                                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.display_name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* סוף שדה היעד */}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('start_Date')}</label>
                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                   value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('end_Date')}</label>
                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                   value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">{t('Travel_Style')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {travelStyles.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setStyle(item.id)}
                                    className={`cursor-pointer border rounded-2xl p-4 transition-all duration-200 flex items-center gap-4 
                                        ${index === 0 ? 'md:col-span-2' : ''} 
                                        ${style === item.id 
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl flex items-center justify-center transition-colors 
                                        ${style === item.id ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm ${style === item.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {item.label}
                                        </h4>
                                        <p className={`text-xs mt-0.5 ${style === item.id ? 'text-blue-600/80' : 'text-slate-500'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors 
                                        ${style === item.id ? 'border-blue-500' : 'border-slate-300'}`}>
                                        {style === item.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isGenerating} 
                            className={`w-full py-4 flex items-center justify-center gap-2 rounded-2xl font-bold text-white transition-all ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300'}`}>
                        {isGenerating ? (
                            <><Bot className="w-5 h-5 animate-pulse" /> {t('generating')}</> 
                        ) : (
                            <><Wand2 className="w-5 h-5" /> {t('Generate Itinerary')}</>
                        )}
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        {t('Cancel')}
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
              <div className="text-blue-100 flex justify-center mb-6">
                 <MapPin className="w-20 h-20 text-blue-500 bg-blue-50 p-4 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{t('No trips planned yet')}</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                {t('Ready for a new adventure? Start by creating your first travel plan.')}
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="mt-8 flex items-center justify-center gap-2 mx-auto bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-100 transition-colors">
                <Sparkles className="w-4 h-4" /> {t('Create a trip now')}
              </button>
            </div>
          )}
        </div>
        
        {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white transition-all">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg"></div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('wait_crafting')}</h2>
          <p className="text-blue-200 text-lg font-medium animate-pulse flex items-center gap-2">
            {t('wait_finding')} <PlaneTakeoff className="w-5 h-5" />
          </p>
        </div>
      )}
      </main>
    </div>
  );
}

export default Dashboard;