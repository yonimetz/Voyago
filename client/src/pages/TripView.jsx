import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, ArrowLeft, ArrowRight, Clock, Plus, Edit3, Navigation, Save, X } from 'lucide-react';

// פונקציית התמונות המדויקת (מונעת תמונות לא קשורות)
function StopImage({ keyword, stopName, onImageLoad }) {
  const [imageUrl, setImageUrl] = useState(null);
  
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  
  useEffect(() => {
    const fetchImage = async () => {
      // אם ג'מיני לא סיפק מילת חיפוש באנגלית - אל תחפש כלום
      if (!keyword) {
          if(onImageLoad) onImageLoad(false);
          return;
      }

      try {
        const query = encodeURIComponent(keyword); 
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
          { withCredentials: false }
        );
        
        if (response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
          if(onImageLoad) onImageLoad(true);
        } else {
          if(onImageLoad) onImageLoad(false);
        }
      } catch (error) {
        console.error("Error fetching stop image", error);
        if(onImageLoad) onImageLoad(false);
      }
    };
    
    fetchImage();
  }, [keyword, onImageLoad]);

  if (!imageUrl) return null;

  return <img src={imageUrl} alt={stopName || keyword} className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />;
}

// קומפוננטת כרטיסיית התחנה - עכשיו סגורה ועובדת כמו שצריך!
function StopCard({ stop, stopIndex, trip }) {
    const [hasImage, setHasImage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(stop.personalNote || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveNote = async () => {
        try {
            setIsSaving(true);
            await axios.put(
                `http://localhost:8080/api/stops/${stop.id}/note`,
                { note: note },
                { withCredentials: true }
            );
            setIsEditing(false);
            stop.personalNote = note;
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
      <div className="relative ps-6 md:ps-10 group">
        <span className="absolute -start-[11px] top-12 w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow-sm transition-transform group-hover:scale-125"></span>
        
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-6">
          
          {hasImage && (
              <div className="w-full md:w-2/5 h-48 md:h-auto rounded-3xl overflow-hidden relative shrink-0 bg-slate-50">
                  <StopImage 
                      keyword={stop.imageKeyword} 
                      stopName={stop.locationName || stop.stopName}
                      onImageLoad={(success) => setHasImage(success)} 
                  />
                  <div className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-black shadow-sm">
                      {stopIndex + 1}
                  </div>
              </div>
          )}

          <div className={`py-2 pe-4 flex flex-col justify-between ${hasImage ? 'w-full md:w-3/5' : 'w-full'}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                 {!hasImage && (
                     <span className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0">
                         {stopIndex + 1}
                     </span>
                 )}
                 <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stop.locationName || stop.stopName}
                 </h3>
              </div>
              
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
            <div className="mt-auto pt-4">
              {isEditing ? (
                <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 animate-fade-in">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your thoughts, reservation details, or reminders here..."
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none text-sm min-h-[80px] p-1"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNote(stop.personalNote || '');
                      }}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSaving ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              ) : note ? (
                <div 
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-50 p-3 rounded-2xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors group/note relative"
                >
                  <div className="flex items-start gap-2">
                    <Edit3 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{note}</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-colors group/add"
                >
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm group-hover/add:text-blue-600">
                    <Plus className="w-4 h-4 bg-slate-200 text-slate-600 rounded-full p-0.5 group-hover/add:bg-blue-200 group-hover/add:text-blue-700 transition-colors" />
                    Add a personal note for this stop...
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    );
}

// קומפוננטת האב הראשי
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

  const scrollToDay = (dayNumber) => {
    setActiveDay(dayNumber);
    const element = document.getElementById(`day-${dayNumber}`);
    if (element) {
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
      
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            Back
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Voyago<span className="text-blue-600">.</span></h1>
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        
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

        <main className="lg:w-3/4">
          <div className="space-y-16 relative">
            
            {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
              <div key={day.id} id={`day-${day.dayNumber}`} className="scroll-mt-24">
                
                <div className="mb-8 pb-4 border-b-2 border-slate-100">
                  <h2 className="text-3xl font-black text-blue-600 flex items-center gap-2">
                    {day.date ? (
                      <>Day {day.dayNumber} <span className="text-blue-400 font-bold text-2xl">- {day.date}</span></>
                    ) : (
                      <>{day.description}</>
                    )}
                  </h2>
                </div>

                <div className="relative border-s-2 border-blue-100 ms-4 md:ms-6 space-y-8 pb-4">
                  {day.stops?.map((stop, stopIndex) => (
                    // הקריאה לקומפוננטה כאן קצרה ונקייה!
                    <StopCard key={stop.id} stop={stop} stopIndex={stopIndex} trip={trip} />
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