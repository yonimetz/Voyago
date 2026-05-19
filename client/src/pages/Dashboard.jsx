import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard({ currentUser, setCurrentUser }) {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  // שליפת טיולים עבור המשתמש הספציפי
  useEffect(() => {
    if (currentUser) {
      axios.get(`http://localhost:8080/api/trips/user/${currentUser.id}`,{
        withCredentials: true
      })
        .then(res => setTrips(res.data))
        .catch(err => console.error('Error fetching trips:', err));
    }
  }, [currentUser]);

  // פונקציית התנתקות - מנקה את הסטייט ועוברת לדף הלוגין
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* סרגל צד */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Voyago
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Travel Management</p>
        </div>
        
        <nav className="flex-1 p-6">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Account</h3>
            <div className="flex items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200 mr-3">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.username}</p>
                <p className="text-[10px] text-blue-500 font-medium">Logged In</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium">
                <span className="mr-3">🗺️</span> My Trips
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
              >
                <span className="mr-3">🚪</span> Logout
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
                Welcome, {currentUser?.username}
              </h1>
              <p className="text-slate-500 mt-2">Manage and explore your upcoming travel.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 transform active:scale-95">
              + New Trip
            </button>
          </header>
          
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trips.map(trip => (
                <div key={trip.id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center relative">
                     <span className="text-5xl transform group-hover:scale-110 transition-transform duration-500">✈️</span>
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                       Upcoming
                     </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {trip.destination}
                    </h3>
                    <div className="mt-4 flex items-center text-slate-500 text-sm font-medium">
                      <span className="mr-2">📅</span>
                      {trip.startDate} — {trip.endDate}
                    </div>
                    <button className="mt-6 w-full bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-100">
                      View Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-inner">
              <div className="text-6xl mb-6">🌍</div>
              <h3 className="text-2xl font-bold text-slate-800">No trips planned yet</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Ready for a new adventure? Start by creating your first travel plan.
              </p>
              <button className="mt-8 bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-100 transition-colors">
                Create a trip now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;