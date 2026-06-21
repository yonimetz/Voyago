import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, ArrowLeft, ArrowRight, Navigation, Printer } from 'lucide-react';
// ודא שהנתיב תואם למיקום של הקובץ החדש שיצרת
import StopCard from '../components/StopCard'; 

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
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* סרגל עליון */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            Back
          </button>
          
          <h1 className="text-xl font-black text-slate-800 tracking-tight absolute left-1/2 -translate-x-1/2">
            Voyago<span className="text-blue-600">.</span>
          </h1>

          <div className="w-20"></div> 
        </div>
      </div>

      <div className="print:bg-white print:pb-0">
        
        <div className="relative h-[35vh] min-h-[300px] w-full print:h-[250px] print:min-h-[250px]">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" 
            alt="Trip Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent print:from-slate-900/70"></div>

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

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 print:py-8 print:gap-0">
          
          {/* תפריט צד */}
          <aside className="lg:w-1/4 print:hidden">
            <div className="sticky top-24 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-indigo-500" />
                  Trip Itinerary
                </h3>
                
                {/* קריאה ישירה לדפדפן להדפיס! */}
                <button 
                  onClick={() => window.print()} 
                  className="flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:scale-105 rounded-xl transition-all"
                  title="Export to PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
              
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

          {/* המסלול ברוחב מלא בהדפסה */}
          <main className="lg:w-3/4 print:w-full">
            <div className="space-y-16 relative print:space-y-10">
              
              {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                <div key={day.id} id={`day-${day.dayNumber}`} className="scroll-mt-24 print:break-inside-avoid">
                  
                  <div className="mb-8 pb-4 border-b-2 border-slate-100 print:mb-6">
                    <h2 className="text-3xl font-black text-blue-600 flex items-center gap-2">
                      {day.date ? (
                        <>Day {day.dayNumber} <span className="text-blue-400 font-bold text-2xl">- {day.date}</span></>
                      ) : (
                        <>{day.description}</>
                      )}
                    </h2>
                  </div>
                  <div className="relative border-s-2 border-blue-100 ms-4 md:ms-6 space-y-8 pb-4 print:space-y-6 print:border-s-0 print:ms-0">
                    {day.stops?.map((stop, stopIndex) => (
                      <StopCard key={stop.id} stop={stop} stopIndex={stopIndex} trip={trip} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TripView;