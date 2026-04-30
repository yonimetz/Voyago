import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [trips, setTrips] = useState([]);

  // שליפת משתמשים בטעינה ראשונה
  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  // שליפת טיולים כשבוחרים משתמש
  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:8080/api/trips/user/${selectedUser.id}`)
        .then(res => setTrips(res.data))
        .catch(err => console.error('Error fetching trips:', err));
    }
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* סרגל צד - רשימת משתמשים */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Voyago
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Travel Management</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-slate-500 mb-4 px-2">Select Traveler</h3>
          <ul className="space-y-1">
            {users.map(u => (
              <li 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                className={`group flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedUser?.id === u.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                   selectedUser?.id === u.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'
                }`}>
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{u.username}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* אזור מרכזי - טיולים */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        {selectedUser ? (
          <div className="max-w-5xl mx-auto">
            <header className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {selectedUser.username}'s Journeys
                </h1>
                <p className="text-slate-500 mt-2">Manage and explore your upcoming travel itineraries.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
                + New Trip
              </button>
            </header>
            
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {trips.map(trip => (
                  <div key={trip.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-32 bg-blue-100 flex items-center justify-center relative">
                       <span className="text-4xl">✈️</span>
                       <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase text-blue-600">
                         Upcoming
                       </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {trip.destination}
                      </h3>
                      <div className="mt-4 flex items-center text-slate-500 text-sm">
                        <span className="mr-2">📅</span>
                        {trip.startDate} — {trip.endDate}
                      </div>
                      <button className="mt-6 w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100">
                        View Itinerary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold text-slate-800">No trips planned yet</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  Ready for a new adventure? Start by creating your first travel plan.
                </p>
                <button className="mt-6 text-blue-600 font-bold hover:underline">Create a trip now</button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
               <span className="text-3xl">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome to Voyago</h2>
            <p className="text-slate-500 mt-2 max-w-sm">
              Please select a user from the sidebar to view their personalized travel dashboard and itineraries.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;