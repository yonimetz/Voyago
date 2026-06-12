import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Users, Globe, Lock, MapPin } from 'lucide-react';

function Community() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // 6 קהילות לדוגמה
  const mockCommunities = [
    {
      id: 1,
      name: "Tokyo Cherry Blossoms 2026",
      destination: "Tokyo, Japan",
      members: 12470,
      type: "public",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "ישראלים בקו סמוי 🌴",
      destination: "Koh Samui, Thailand",
      members: 2890,
      type: "public",
      image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Swiss Alps Hikers",
      destination: "Zurich, Switzerland",
      members: 13421,
      type: "public",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80" // תוקן!
    },

    {
      id: 4,
      name: "טיול משפחות צפון איטליה אוגוסט 26",
      destination: "Northern Italy",
      members: 256,
      type: "public",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"    },
        {
      id: 5,
      name: "Cohen Family Summer Trip",
      destination: "Crete, Greece",
      members: 6,
      type: "private",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      name: "Coast to Coast USA",
      destination: "United States",
      members: 24570,
      type: "public",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // הלוגיקה שמסננת את הקהילות לפי מה שהמשתמש מקליד (חיפוש חי)
  const filteredCommunities = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* סרגל עליון מינימליסטי */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <span className="me-2 text-xl">←</span> Back
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Voyago<span className="text-indigo-600">.</span></h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* אזור ה-Hero של הקהילה */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 flex items-center gap-3">
              <Users className="w-10 h-10 text-indigo-500" />
              {t('discover_communities')}
            </h1>
            <p className="text-lg text-slate-500 max-w-xl font-medium">
              {t('community_desc')}
            </p>
          </div>
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 transform active:scale-95 flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            {t('create_community')}
          </button>
        </div>

        {/* שורת חיפוש מחוברת לסטייט */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center mb-10 max-w-2xl relative z-10 transition-shadow focus-within:shadow-md focus-within:border-indigo-300">
          <Search className="w-6 h-6 text-slate-400 ms-4" />
          <input 
            type="text"
            placeholder={t('search_destination')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 bg-transparent border-none outline-none text-slate-700 font-medium placeholder-slate-400"
          />
        </div>

        {/* גריד קהילות (מציג את התוצאות המסוננות) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map((community) => (
              <div key={community.id} className="group relative h-[380px] rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100">
                <img src={community.image} alt={community.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute top-6 start-6 flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                    {community.type === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {t(community.type)}
                  </span>
                </div>

                <div className="absolute bottom-0 start-0 p-8 w-full">
                  <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold mb-2">
                    <MapPin className="w-4 h-4" />
                    {community.destination}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{community.name}</h3>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-3 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-300"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-400"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-500 flex items-center justify-center text-[10px] text-white font-bold">
                          +
                        </div>
                      </div>
                      <span className="text-slate-300 text-xs font-medium ms-2">
                        {community.members} {t('members')}
                      </span>
                    </div>
                    <button className="text-white text-sm font-bold hover:text-indigo-400 transition-colors">
                      Join →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* מצב אפס (Zero State) - כשאין תוצאות בחיפוש */
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No communities found</h3>
              <p className="text-slate-500">Try searching for a different destination or create a new community!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Community;