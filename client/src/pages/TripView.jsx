import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, ArrowLeft, ArrowRight, Navigation, Printer } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0770E8]"></div>
      </div>
    );
  }

  if (!trip) return <div className="text-center py-20 text-slate-500 font-bold">Trip not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 scroll-smooth" dir={isRTL ? 'rtl' : 'ltr'}>
      <Toaster position="bottom-center" reverseOrder={false} />
      
      {/* סרגל עליון */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-[#0770E8] font-bold transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            {t('back', 'Back')}
          </button>
          
          <h1 className="text-2xl font-extrabold text-slate-600 tracking-tight absolute left-1/2 -translate-x-1/2 flex items-baseline">
            Voyago<span className="text-[#0770E8] font-black text-3xl leading-[0.5] ml-0.5">.</span>
          </h1>

          <div className="w-20"></div> 
        </div>
      </div>

      <div className="print:bg-white print:pb-0">
        
        {/* אזור תמונה */}
        <div className="relative h-[35vh] min-h-[300px] w-full print:h-[250px] print:min-h-[250px]">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" 
            alt="Trip Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent print:from-slate-900/70"></div>

          <div className="absolute bottom-0 start-0 p-8 w-full max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg capitalize">
              {trip.destination}
            </h1>
            <div className="flex items-center gap-2 text-blue-100 font-bold text-lg drop-shadow-md">
              <Calendar className="w-5 h-5" />
              <span>{trip.startDate} — {trip.endDate}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 print:py-8 print:gap-0">
          
          {/* תפריט צד */}
          <aside className="lg:w-1/4 print:hidden">
            <div className="sticky top-24 bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 tracking-wider text-sm flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0770E8]" />
                  {t('trip_itinerary', 'Trip Itinerary')}
                </h3>
                
                <button 
                  onClick={() => window.print()} 
                  className="flex items-center justify-center p-2.5 text-[#0770E8] bg-blue-50 hover:bg-blue-100 hover:scale-105 rounded-xl transition-all shadow-sm"
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
                        ? 'bg-[#0770E8] text-white shadow-lg shadow-blue-200 transform scale-[1.02]' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    Day {day.dayNumber}
                    <span className={`block text-xs mt-1 truncate ${activeDay === day.dayNumber ? 'text-blue-100 font-medium' : 'text-slate-400 font-normal'}`}>
                      {day.date || day.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* המסלול עצמו */}
          <main className="lg:w-3/4 print:w-full">
            <div className="space-y-16 relative print:space-y-10">
              
              {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                <div key={day.id} id={`day-${day.dayNumber}`} className="scroll-mt-24 print:break-inside-avoid">
                  
                  <div className="mb-8 pb-4 border-b-2 border-slate-100 print:mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                      {day.date ? (
                        <>
                          <span className="text-[#0770E8]">Day {day.dayNumber}</span> 
                          <span className="text-slate-400 font-bold text-2xl">— {day.date}</span>
                        </>
                      ) : (
                        <span className="text-[#0770E8]">{day.description}</span>
                      )}
                    </h2>
                  </div>
                  
                  <div className="relative border-s-2 border-slate-200 ms-4 md:ms-6 space-y-8 pb-4 print:space-y-6 print:border-s-0 print:ms-0">
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