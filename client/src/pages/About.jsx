import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Bot, Map, Sparkles, Heart } from 'lucide-react';

function About() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* תפריט עליון פשוט */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            {isRTL ? 'חזרה' : 'Back'}
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Voyago<span className="text-blue-600">.</span>
          </h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* כותרת ראשית */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> {isRTL ? 'הסיפור שלנו' : 'Our Story'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            {isRTL ? 'מתכננים את העתיד של עולם הטיולים' : 'Redefining the Future of Travel'}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'אנחנו ב-Voyago מאמינים שתכנון הטיול צריך להיות מרגש כמו הטיול עצמו. בלי עשרות טאבים פתוחים, בלי לחץ – רק אתם וההרפתקה הבאה שלכם.' 
              : 'At Voyago, we believe planning your trip should be as exciting as the journey itself. No more endless tabs or stress – just you and your next adventure.'}
          </p>
        </div>

        {/* גריד מאפיינים */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{isRTL ? 'בינה מלאכותית מתקדמת' : 'Advanced AI Planning'}</h3>
            <p className="text-slate-500 leading-relaxed">
              {isRTL 
                ? 'המנוע החכם שלנו לומד את ההעדפות שלך ובונה מסלולים שמרגישים כאילו הורכבו על ידי סוכן נסיעות אישי שמכיר אותך הכי טוב.'
                : 'Our smart engine learns your preferences and builds itineraries that feel like they were crafted by a personal travel agent who knows you best.'}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Map className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{isRTL ? 'חוויה חלקה ואינטראקטיבית' : 'Seamless Experience'}</h3>
            <p className="text-slate-500 leading-relaxed">
              {isRTL 
                ? 'החל משלב הרעיון ועד לניהול המסמכים והכרטיסים בזמן אמת. המערכת שלנו מרכזת את כל הטיול שלך במקום אחד נגיש ויפהפה.'
                : 'From the initial idea to managing documents and tickets in real-time. Our system centralizes your entire trip in one beautiful, accessible place.'}
            </p>
          </div>
        </div>

        {/* מילות סיכום ויצירת קשר במקרה שצריך */}
        <div className="text-center bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <Heart className="w-12 h-12 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">{isRTL ? 'נוצר באהבה למטיילים' : 'Built with love for travelers'}</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            {isRTL ? 'יש לכם הצעות לשיפור? רעיונות לפיצ\'רים חדשים? נשמח לשמוע מכם.' : 'Have suggestions for improvement? Ideas for new features? We would love to hear from you.'}
          </p>
          <a href="mailto:voyagoAI@gmail.com" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors">
            voyagoAI@gmail.com
          </a>
        </div>
      </main>
    </div>
  );
}

export default About;