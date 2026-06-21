import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Map, Compass, Users } from 'lucide-react';

function RegisterPage({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', { username, email, password });
      const userData = response.data;
      setCurrentUser(userData);
      localStorage.setItem('voyago_user', JSON.stringify(userData)); // שמירה בזיכרון המקומי
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username or email might be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה לגלילה חלקה למטה
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white overflow-x-hidden">
      
      {/* לוגו צף */}
      <nav className="absolute top-0 w-full z-50 p-8 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          Voyago<span className="text-blue-500">.</span>
        </h1>
      </nav>

      {/* 1. HERO SECTION (מסך מלא עם וידאו) */}
      <header className="relative w-full h-screen flex items-center justify-center">
        {/* סרטון רקע */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* שכבת הכהיה כדי שהטופס יבלוט (Overlay) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* תוכן ה-Hero מחולק ל-2 עמודות במסכים גדולים */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* צד שמאל: טקסט שיווקי ואווירה */}
          <div className="hidden lg:block text-white">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Plan Your Journey <br/> as you imagined
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-lg font-medium drop-shadow-md">
              Every great journey begins with a vision. Let us seamlessly weave your desires into a breathtaking, tailor-made adventure designed exclusively for you.
            </p>
          </div>

          {/* צד ימין: כרטיס זכוכית (Glassmorphism) להרשמה */}
          <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md">Voyago</h2>
              <p className="text-white/80 font-medium">Join the adventure! Create an account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-white mb-2 ml-1 drop-shadow-sm">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2 ml-1 drop-shadow-sm">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2 ml-1 drop-shadow-sm">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  required 
                />
              </div>
              
              {error && <p className="text-red-400 text-sm text-center font-semibold bg-red-900/50 p-2 rounded-lg backdrop-blur-sm">{error}</p>}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/50 transform active:scale-95 disabled:bg-slate-500/50 mt-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <p className="mt-8 text-center text-white/80 text-sm font-medium">
              Already have an account? 
              <Link to="/login" className="ml-2 text-white font-bold hover:text-blue-300 hover:underline transition-colors">Login here</Link>
            </p>
          </div>
        </div>

        {/* אינדיקטור גלילה למטה */}
        <div 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center animate-bounce cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] font-bold mb-2 tracking-widest uppercase">Discover More</span>
          <ChevronDown size={28} />
        </div>
      </header>

      {/* 2. תוכן שיווקי בגלילה (CONTENT & EXPLORATION) */}
      
      {/* אזור פיצ'רים מינימליסטי */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Compass size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI-Powered Planning</h3>
              <p className="text-slate-500 leading-relaxed">Generate personalized itineraries in seconds based on your specific travel style and preferences.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Map size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Interactive Routes</h3>
              <p className="text-slate-500 leading-relaxed">Visualize your daily schedule with real-world imagery and precise location mapping.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Users size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Collaborative Travel</h3>
              <p className="text-slate-500 leading-relaxed">Share your plans with travel partners and manage your upcoming adventures together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* אזור יעדים נבחרים (גריד כרטיסיות) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Trending Destinations</h2>
            <p className="text-lg text-slate-500">Discover popular routes created by the Voyago community.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kyoto" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">Culture</span>
                <h3 className="text-3xl font-bold text-white mb-2">Kyoto, Japan</h3>
                <p className="text-slate-200 text-sm">Ancient temples, gardens, and rich traditions.</p>
              </div>
            </div>

            <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Paris" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">Romantic</span>
                <h3 className="text-3xl font-bold text-white mb-2">Paris, France</h3>
                <p className="text-slate-200 text-sm">Art, history, and iconic architecture.</p>
              </div>
            </div>

            <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="New York" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">Urban Energy</span>
                <h3 className="text-3xl font-bold text-white mb-2">New York City</h3>
                <p className="text-slate-200 text-sm">Skyscrapers, Broadway, and endless possibilities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-slate-900 py-8 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm font-medium">© 2026 Voyago. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RegisterPage;