import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// ייבוא האייקונים המקצועיים
import { Calendar, Trash2, Loader2, Map } from 'lucide-react';

function TripCard({ trip, onDelete }) {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      return { label: t('in_progress', 'In Progress'), textColor: 'text-green-600' }; 
    } else {
      return { label: t('upcoming', 'Upcoming'), textColor: 'text-blue-600' };
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
      className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* אזור התמונה */}
      <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(trip.id);
          }}
          className="absolute top-4 left-4 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center z-20 shadow-sm transition-all duration-300"
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
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
      
        <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider z-10 shadow-sm ${status.textColor}`}>
          {status.label}
        </div>
      </div>
      
      {/* פרטי הטיול */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors capitalize flex items-center gap-2">
          {trip.destination}
        </h3>
        <div className="mt-4 mb-6 flex items-center text-slate-500 text-sm font-medium">
          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
          {trip.startDate} — {trip.endDate}
        </div>
        
        <div className="mt-auto w-full bg-slate-50 text-center text-slate-700 font-bold py-3.5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100 flex items-center justify-center gap-2">
          <Map className="w-4 h-4" /> {t('view_itinerary', 'View Itinerary')}
        </div>
      </div>
    </div>
  );
}

export default TripCard;