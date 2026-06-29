import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Trash2, Loader2, Map } from 'lucide-react';

function TripCard({ trip, onDelete }) {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'he';

  const getTripStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(trip.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(trip.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
      return { label: t('completed', 'Completed'), textColor: 'text-slate-500' }; 
    } else if (startDate <= today && endDate >= today) {
      return { label: t('in_progress', 'In Progress'), textColor: 'text-emerald-600' }; 
    } else {
      return { label: t('upcoming', 'Upcoming'), textColor: 'text-[#0770E8]' };
    }
  };

  const status = getTripStatus();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const searchTerm = trip.imageKeyword || trip.destination;
        const searchQuery = encodeURIComponent(`${searchTerm} travel landscape famous landmark`);
        const accessKey = 'rILzD5qgSzoPenbcXcgldZqVqac3UbXNz9RiUQ9C4Xw';
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${accessKey}&per_page=1&orientation=landscape&order_by=relevant`,
          {
            withCredentials: false
          }
        );
        
        if (response.data.results && response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
        }
      } catch (error) {
        console.error(`Failed to load image for ${trip.destination}:`, error);
      }
    };

    fetchImage();
  }, [trip.destination]);

  return (
    <div 
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="group bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(7,112,232,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* אזור התמונה */}
      <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden transform-gpu">
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(trip.id);
          }}
          className="absolute top-4 start-4 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center z-20 shadow-sm transition-all duration-300 transform-gpu"
          title="Delete Trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={trip.destination} 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-500"></div>
          </>
        ) : (
          <div className="h-full w-full bg-blue-50 flex items-center justify-center text-[#0770E8]/40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        <div className={`absolute top-4 end-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider z-10 shadow-sm transform-gpu ${status.textColor}`}>
          {status.label}
        </div>
      </div>
      
      {/* פרטי הטיול */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-[#0770E8] transition-colors capitalize flex items-center gap-2 transform-gpu">
          {trip.destination}
        </h3>
        
        <div className="mt-3 mb-6 flex items-center text-slate-500 text-sm font-medium transform-gpu">
          <Calendar className="w-4 h-4 me-2 text-slate-400" />
          {trip.startDate} <span className="mx-1.5 opacity-50">—</span> {trip.endDate}
        </div>
        
        <div className="mt-auto w-full bg-slate-50 text-center text-slate-600 font-bold py-3.5 rounded-2xl group-hover:bg-[#0770E8] group-hover:text-white transition-all duration-300 border border-slate-100 flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-blue-200 transform-gpu">
          <Map className="w-4 h-4" /> {t('view_itinerary', 'View Itinerary')}
        </div>
      </div>
    </div>
  );
}

export default TripCard;