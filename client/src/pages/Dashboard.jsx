import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import TripCard from '../components/TripCard';
import AIdeaBotBubble from '../components/AIdeaBotBubble';
import { Users, Map, Settings, Globe, LogOut, Sparkles, Loader2, Mountain, Landmark, Coffee, Smile, Wand2, Bot, MapPin, PlaneTakeoff, Plus, X } from 'lucide-react';

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
  const isRTL = i18n.language === 'he';

  const toggleLanguage = () => {
    i18n.changeLanguage(isRTL ? 'en' : 'he');
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
            const lang = isRTL ? 'he' : 'en';
            
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
  }, [destination, isRTL, showSuggestions]);

  const handleSelectLocation = (placeName) => {
    setDestination(placeName);
    setShowSuggestions(false);
  };

  const travelStyles = [
    { 
        id: 'Recommended', 
        icon: <Sparkles className="w-5 h-5" />, 
        label: t('style_recommended_label', 'Recommended'), 
        desc: t('style_recommended_desc', 'A perfect balance of top highlights') 
    },
    { 
        id: 'Nature & Outdoors', 
        icon: <Mountain className="w-5 h-5" />, 
        label: t('style_nature_label', 'Nature Focus'), 
        desc: t('style_nature_desc', 'Emphasis on scenery & trails') 
    },
    { 
        id: 'Culture & History', 
        icon: <Landmark className="w-5 h-5" />, 
        label: t('style_culture_label', 'Culture Focus'), 
        desc: t('style_culture_desc', 'Emphasis on heritage & museums') 
    },
    { 
        id: 'Relaxing & Leisure', 
        icon: <Coffee className="w-5 h-5" />, 
        label: t('style_relaxing_label', 'Relaxing Vibes'), 
        desc: t('style_relaxing_desc', 'Emphasis on chill & slow pace') 
    },
    { 
        id: 'Family Friendly', 
        icon: <Smile className="w-5 h-5" />, 
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

    const start = new Date(startDate);
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

    const diffTime = Math.abs(end - start);
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
        
        toast.success(isRTL ? "הטיול נוצר ונשמר בהצלחה!" : "Trip generated successfully!");
        
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
        toast.success(isRTL ? "הטיול נמחק בהצלחה!" : "Trip deleted successfully!");
        
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast.error("Failed to delete the trip. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex font-sans text-slate-800 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <Toaster position="bottom-center" />

      {/* סרגל צד */}
      <aside className="w-72 bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 shrink-0">
        <div className="p-8 border-b border-slate-100">
          <h1 className="text-3xl font-extrabold text-slate-600 flex items-baseline">
            Voyago<span className="text-[#0770E8] font-black text-4xl leading-[0.5] ml-0.5">.</span>
          </h1>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-bold opacity-70">
            {t('travel_management', 'Travel Management')}
          </p>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium text-sm tracking-wide group">
                <Map className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" /> {t('my_trips', 'My Trips')} 
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium text-sm tracking-wide group">
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" /> {t('profile', 'Profile')}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/community')}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all font-medium text-sm tracking-wide group">
                <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" /> {t('community', 'Community')}
              </button>
            </li>
            <li className="pt-2"> 
              <button 
                onClick={toggleLanguage}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all font-medium text-sm tracking-wide group">
                <Globe className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" /> {t('switch_lang', 'Switch Language')}
              </button>
            </li>
          </ul>

          <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-4 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl transition-all">
              <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-500 truncate">{currentUser?.username}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('logged_in', 'Logged In')}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium text-sm tracking-wide group"
            >
              <LogOut className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" /> {t('logout', 'Logout')}
            </button>
          </div>
        </nav>
      </aside>

      {/* אזור מרכזי */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-light tracking-wide text-slate-900">
                {showCreateForm ? t('plan_new_adventure', 'Plan a New Adventure') : <>{t('welcome', 'Welcome')} <span className="font-medium">{currentUser?.username}</span></>}
              </h1>
              <p className="text-slate-500 mt-2 font-medium text-sm tracking-wide">
                {showCreateForm ? t('ai_craft_itinerary', 'Let our AI craft the perfect itinerary for you.') : t("subtitle", "Manage and explore your upcoming travel.")}
              </p>
            </div>
            {!showCreateForm && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#0770E8] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium tracking-wide transition-all shadow-sm transform active:scale-95 text-sm">
                <Plus className="w-4 h-4" /> {t('new_trip', 'New Trip')}
              </button>
            )}
          </header>
          
          {isLoadingTrips ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0770E8] mb-4"></div>
              <p className="text-slate-400 font-medium tracking-wide text-sm">Loading your adventures...</p>
            </div>
          ) : showCreateForm ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <form onSubmit={handleGenerateTrip} className="space-y-6 max-w-2xl mx-auto">
                    
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('destination')}</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                className={`w-full p-4 bg-slate-50/50 hover:bg-white text-sm border border-slate-200 rounded-xl focus:border-[#0770E8] focus:ring-4 focus:ring-[#0770E8]/10 outline-none transition-all ${isRTL ? 'pr-11' : 'pl-11'}`} 
                                value={destination} 
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setShowSuggestions(true);
                                }} 
                                required 
                                placeholder={t('e.g. Paris, Tuscany, Spain...')} 
                            />
                            <MapPin className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 ${isRTL ? 'right-4' : 'left-4'}`} />
                            
                            {isSearchingLocation && (
                                <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}`}>
                                    <div className="w-3.5 h-3.5 border-2 border-[#0770E8] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                                {suggestions.map((item) => (
                                    <div 
                                        key={item.place_id}
                                        onClick={() => handleSelectLocation(item.display_name)}
                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                    >
                                        <p className="text-xs font-medium text-slate-700 line-clamp-1">{item.display_name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('start_Date')}</label>
                            <input type="date" className="w-full p-4 bg-slate-50/50 text-sm border border-slate-200 rounded-xl focus:border-[#0770E8] outline-none transition-all" 
                                   value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('end_Date')}</label>
                            <input type="date" className="w-full p-4 bg-slate-50/50 text-sm border border-slate-200 rounded-xl focus:border-[#0770E8] outline-none transition-all" 
                                   value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t('Travel_Style')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {travelStyles.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setStyle(item.id)}
                                    className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-center gap-4 
                                        ${index === 0 ? 'md:col-span-2' : ''} 
                                        ${style === item.id 
                                            ? 'border-[#0770E8] bg-blue-50/30 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg flex items-center justify-center transition-colors 
                                        ${style === item.id ? 'bg-[#0770E8] text-white shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium text-sm tracking-wide ${style === item.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {item.label}
                                        </h4>
                                        <p className={`text-[11px] mt-0.5 ${style === item.id ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0
                                        ${style === item.id ? 'border-[#0770E8]' : 'border-slate-300'}`}>
                                        {style === item.id && <div className="w-1.5 h-1.5 bg-[#0770E8] rounded-full" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <button type="submit" disabled={isGenerating} 
                              className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-wide text-white transition-all ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0770E8] hover:bg-blue-700 shadow-sm active:scale-95'}`}>
                          {isGenerating ? (
                              <><Bot className="w-4 h-4 animate-pulse text-white" /> {t('generating')}</> 
                          ) : (
                              <><Wand2 className="w-4 h-4 text-blue-200" /> {t('Generate Itinerary')}</>
                          )}
                      </button>
                      <button type="button" onClick={() => setShowCreateForm(false)} className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">
                          {t('Cancel')}
                      </button>
                    </div>
                </form>
            </div>
          ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.isArray(trips) && trips.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip}/>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <div className="text-slate-200 flex justify-center mb-6">
                 <Map className="w-16 h-16 text-[#0770E8]/60 bg-blue-50/50 p-4 rounded-xl" />
              </div>
              <h3 className="text-xl font-medium tracking-wide text-slate-800">
                {isRTL ? 'אין טיולים מתוכננים' : t('No trips planned yet')}
              </h3>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto font-medium">
                {isRTL 
                  ? "מוכנים להרפתקה חדשה? התחילו ביצירת תוכנית הטיול הראשונה שלכם." 
                  : "Ready for a new adventure? Start by creating your first travel plan."}
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="mt-8 flex items-center justify-center gap-2 mx-auto bg-[#0770E8] text-white px-6 py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                <Sparkles className="w-4 h-4" /> {t('Create a trip now')}
              </button>
            </div>
          )}
        </div>
        
        {/* מסך טעינה */}
        {isGenerating && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white transition-all duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* כפתור יציאה */}
            <button 
              onClick={() => setIsGenerating(false)}
              className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-white/60 hover:text-white bg-slate-800/40 hover:bg-slate-700/60 p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95`}
              title={isRTL ? 'בטל יצירת טיול' : 'Cancel trip generation'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative flex items-center justify-center mb-8">
              <Loader2 className="w-20 h-20 text-[#0770E8] animate-spin" />
              <PlaneTakeoff className="w-8 h-8 text-white absolute transform -rotate-12" />
            </div>
            <h2 className="text-3xl font-light tracking-wide mb-3 text-white drop-shadow-sm">
              {t('wait_crafting')}
            </h2>
            <p className="text-slate-300 text-sm font-medium tracking-wide animate-pulse flex items-center gap-2 opacity-90">
              {t('wait_finding')}
            </p>
          </div>
        )}
      </main>

      {!isGenerating && (
        <AIdeaBotBubble currentUser={currentUser} 
          setShowCreateForm={setShowCreateForm} 
          setDestination={setDestination} 
        />
      )}
    </div>
  );
}

export default Dashboard;