import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, ArrowLeft, ArrowRight, Clock, Plus, Edit3, Navigation } from 'lucide-react';

function StopImage({ keyword, stopName }) {
  const [imageUrl, setImageUrl] = useState(null);
  
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const searchTerm = keyword || stopName ;
        const query = encodeURIComponent(searchTerm);
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
          { withCredentials: false }
        );
        if (response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
        }
      } catch (error) {
        console.error("Error fetching stop image", error);
      }
    };
    if (keyword || stopName) {
      fetchImage();
    }
  }, [keyword, stopName]);

  if (!imageUrl) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl"></div>;

  return <img src={imageUrl} alt={keyword} className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />;
}

/* another option to this function (problem with sum photos)
function StopImage({ keyword, stopName }) {
  const [imageUrl, setImageUrl] = useState(null);
  
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  
  useEffect(() => {
    const fetchImage = async () => {
      // אם ג'מיני לא סיפק מילת חיפוש באנגלית - אל תחפש כלום!
      if (!keyword) return;

      try {
        // אנחנו מחפשים *רק* את המילה המדויקת שג'מיני סיפק (keyword)
        // בלי להוסיף stopName (שעלול להיות בעברית מבלבלת) ובלי "travel famous"
        const query = encodeURIComponent(keyword); 

        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
          { withCredentials: false }
        );
        
        // מוודאים שאשכרה קיבלנו תוצאה
        if (response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
        }
      } catch (error) {
        console.error("Error fetching stop image", error);
      }
    };
    
    fetchImage();
  }, [keyword]);

  // אם לא מצאנו תמונה מדויקת (או שאין מילת חיפוש), מחזירים null (מסתירים את הריבוע האפור)
  if (!imageUrl) return null;

  return <img src={imageUrl} alt={stopName || keyword} className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />;
}
*/

function TripView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/trips/${tripId}`, { withCredentials: true });
        setTrip(response.data);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  // פונקציית הגלילה שהייתה חסרה לך!
  const scrollToDay = (dayNumber) => {
    setActiveDay(dayNumber);
    const element = document.getElementById(`day-${dayNumber}`);
    if (element) {
      // גלילה עם קצת מרווח מלמעלה שלא יסתיר את הכותרת
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!trip) return <div className="text-center py-20 text-slate-500">Trip not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 scroll-smooth">
      
      {/* סרגל עליון דביק ולבן - שומר על אחידות עם שאר העמודים! */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} // מחזיר לדף הקודם
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            Back
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Voyago<span className="text-blue-600">.</span></h1>
        </div>
      </div>

      {/* 1. HERO SECTION - תמונת המטוס (עכשיו מתחת לסרגל) */}
      <div className="relative h-[35vh] min-h-[300px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" 
          alt="Trip Cover" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 start-0 p-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
            {trip.destination}
          </h1>
          <div className="flex items-center gap-2 text-blue-200 font-medium text-lg drop-shadow-md">
            <Calendar className="w-5 h-5" />
            <span>{trip.startDate} — {trip.endDate}</span>
          </div>
        </div>
      </div>

      {/* 2. SPLIT VIEW: ניווט + מסלול */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* צד א': תפריט ניווט דביק (Sidebar) - ממלא את "החלל הריק" ופותר את בעיית הגלילה */}
        <aside className="lg:w-1/4">
          <div className="sticky top-24 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-500" />
              Trip Itinerary
            </h3>
            
            <div className="flex flex-col gap-2">
              {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                <button
                  key={day.id}
                  onClick={() => scrollToDay(day.dayNumber)}
                  className={`text-start px-5 py-4 rounded-2xl font-bold transition-all ${
                    activeDay === day.dayNumber 
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  Day {day.dayNumber}
                  <span className="block text-xs font-normal text-slate-400 mt-1 truncate">
                    {day.date || day.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* צד ב': המסלול עצמו (רחב ויוקרתי יותר) */}
        <main className="lg:w-3/4">
          <div className="space-y-16 relative">
            
            {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
              <div key={day.id} id={`day-${day.dayNumber}`} className="scroll-mt-24">
                
                {/* כותרת היום */}
                <div className="mb-8 pb-4 border-b-2 border-slate-100">
                  <h2 className="text-3xl font-black text-blue-600 flex items-center gap-2">
                    {day.date ? (
                      <>Day {day.dayNumber} <span className="text-blue-400 font-bold text-2xl">- {day.date}</span></>
                    ) : (
                      <>{day.description}</>
                    )}
                  </h2>
                </div>

                {/* התחנות של היום - כרטיסיות אופקיות ורחבות! */}
                <div className="relative border-s-2 border-blue-100 ms-4 md:ms-6 space-y-8 pb-4">
                  
                  {day.stops?.map((stop, stopIndex) => (
                    <div key={stop.id} className="relative ps-6 md:ps-10 group">
                      
                      {/* הנקודה הקטנה על ציר הזמן */}
                      <span className="absolute -start-[11px] top-12 w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow-sm transition-transform group-hover:scale-125"></span>
                      
                      {/* תמונת התחנה - עכשיו בצד ולא למעלה, מנצל את הרוחב */}
                      <div className="w-full md:w-2/5 h-48 md:h-auto rounded-3xl overflow-hidden relative shrink-0">
                        <StopImage 
                          keyword={stop.imageKeyword} 
                          stopName={stop.locationName || stop.stopName}
                        />
                        <div className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-black shadow-sm">
                          {stopIndex + 1}
                        </div>
                      </div>

                      {/* תוכן התחנה */}
                      <div className="w-full md:w-3/5 py-2 pe-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {stop.locationName || stop.stopName}
                          </h3>
                          
                          {stop.address && (
                            <p className="text-slate-500 text-sm font-medium mb-3 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-blue-500" /> {stop.address}
                            </p>
                          )}
                          
                          <p className="text-slate-600 leading-relaxed text-sm mb-4">
                            {stop.visitTime || stop.description}
                          </p>
                        </div>

                        {/* פתק אישי */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-auto cursor-pointer hover:bg-blue-50/50 transition-colors">
                          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm hover:text-blue-600">
                            <Plus className="w-4 h-4 bg-slate-200 text-slate-600 rounded-full p-0.5" />
                            Add a personal note for this stop...
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}

export default TripView;