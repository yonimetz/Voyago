import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Users, Globe, Lock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

function Community() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = i18n.language === 'he';

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
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "טיול משפחות צפון איטליה אוגוסט 26",
      destination: "Northern Italy",
      members: 256,
      type: "public",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
    },
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

  //  מסנן קהילות חי
  const filteredCommunities = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* סרגל עליון */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-500 hover:text-[#0770E8] font-bold transition-colors text-sm tracking-wide"
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-slate-900 mb-3 flex items-center gap-4">
              <Users className="w-10 h-10 text-[#0770E8]" />
              {t('discover_communities', 'Discover Communities')}
            </h1>
            <p className="text-sm tracking-wide text-slate-500 max-w-xl font-medium">
              {t('community_desc', 'Connect with fellow travelers, share itineraries, and find inspiration for your next journey.')}
            </p>
          </div>
          
          <button className="bg-[#0770E8] hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-blue-200 transform active:scale-95 flex items-center gap-2 whitespace-nowrap text-sm">
            <Plus className="w-5 h-5" />
            {t('create_community', 'Create Community')}
          </button>
        </div>

        {/* שורת חיפוש */}
        <div className="bg-white p-2 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200 flex items-center mb-12 max-w-2xl relative z-10 transition-shadow focus-within:shadow-[0_4px_24px_rgba(7,112,232,0.1)] focus-within:border-[#0770E8]/40">
          <Search className="w-5 h-5 text-slate-400 ms-4" />
          <input 
            type="text"
            placeholder={t('search_destination', 'Search destinations or communities...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 bg-transparent border-none outline-none text-slate-700 font-medium text-sm placeholder-slate-400"
          />
        </div>

        {/* קהילות גריד */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map((community) => (
              <div key={community.id} className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-500 border border-slate-100">
                <img src={community.image} alt={community.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                <div className="absolute top-6 start-6 flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-sm">
                    {community.type === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {t(community.type)}
                  </span>
                </div>

                <div className="absolute bottom-0 start-0 p-8 w-full">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5" />
                    {community.destination}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight drop-shadow-md group-hover:text-blue-100 transition-colors">{community.name}</h3>
                  
                  <div className="flex items-center justify-between mt-4 pt-5 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                        <div className="w-7 h-7 rounded-full border border-slate-800 bg-slate-300"></div>
                        <div className="w-7 h-7 rounded-full border border-slate-800 bg-slate-400"></div>
                        <div className="w-7 h-7 rounded-full border border-slate-800 bg-[#0770E8] flex items-center justify-center text-[9px] text-white font-black">
                          +
                        </div>
                      </div>
                      <span className="text-slate-300 text-[11px] font-bold uppercase tracking-wider ms-2">
                        {community.members.toLocaleString()} {t('members')}
                      </span>
                    </div>
                    <button className="text-white text-xs font-bold uppercase tracking-wider hover:text-blue-300 transition-colors flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-300">
                      Join {isRTL ? '←' : '→'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#0770E8]/50" />
              </div>
              <h3 className="text-xl font-medium tracking-wide text-slate-800 mb-2">No communities found</h3>
              <p className="text-sm font-medium text-slate-400">Try searching for a different destination or create a new community!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Community;