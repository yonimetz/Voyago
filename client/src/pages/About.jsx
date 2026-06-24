import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Bot, Map, Sparkles, Heart, Zap, Globe, Users, Plane } from 'lucide-react';

function About() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const content = {
    badge: isRTL ? 'הכירו את Voyago' : 'Meet Voyago',
    title: isRTL ? <>מתכננים את העתיד של עולם הטיולים</> : <>Redefining the Future of Travel</>,
    subtitle: isRTL 
      ? 'מערכת חכמה שמחזירה את הקסם לתכנון החופשה הבאה שלכם. בלי אקסלים מסורבלים, בלי לחץ – רק אתם וההרפתקה.' 
      : 'A smart platform that brings the magic back to planning your next vacation. No messy spreadsheets, no stress – just the adventure.',
    
    storyTitle: isRTL ? 'למה הקמנו את Voyago?' : 'Why We Built Voyago',
    storyText1: isRTL
      ? 'כולנו מכירים את ההרגשה: סוגרים כרטיסי טיסה ואז מתחיל כאב הראש. עשרות טאבים פתוחים בדפדפן, קבצי אקסל מסורבלים, המלצות מפוזרות בקבוצות פייסבוק, ופחד תמידי לפספס את "הדבר האמיתי".'
      : 'We all know the feeling: you book the flights, and then the headache begins. Dozens of open browser tabs, messy spreadsheets, scattered recommendations, and the constant fear of missing out.',
    storyText2: isRTL
      ? 'הבנו שתכנון הטיול, שאמור להיות מרגש כמעט כמו הטיול עצמו, הפך למטלה מעייפת. החזון שלנו היה פשוט: לקחת את כל הכאוס הזה ולייצר עבורו פתרון אחד, חכם, נקי ואלגנטי. מערכת שתבין מי אתם, מה אתם אוהבים, ותבנה לכם מסלול מדויק בשניות.'
      : 'We realized that trip planning, which should be as exciting as the trip itself, had become a tedious chore. Our vision was simple: to take all this chaos and create one smart, clean, and elegant solution. A system that understands who you are and builds a precise itinerary in seconds.',

    // מאפיינים
    howTitle: isRTL ? 'איך אנחנו עושים את זה?' : 'How do we do it?',
    feat1Title: isRTL ? 'בינה מלאכותית בשירותך' : 'AI-Powered Intuition',
    feat1Desc: isRTL 
      ? 'המנוע החכם שלנו מנתח אלפי נתונים כדי להרכיב מסלול ייחודי שמתאים בול <strong class="text-slate-900 font-bold">להעדפות, לקצב ולתקציב</strong> שלכם. זה לא עוד מסלול גנרי, אלא תכנון אישי.'
      : 'Our smart engine analyzes thousands of data points to craft a unique itinerary that perfectly matches <strong class="text-slate-900 font-bold">your preferences, pace, and budget</strong>. It’s not generic; it’s personal.',
    feat2Title: isRTL ? 'הכל במקום אחד, תמיד' : 'Your Entire Trip, Centralized',
    feat2Desc: isRTL 
      ? 'מסלולים אינטראקטיביים, ניהול מסמכים וכרטיסים, פתקים אישיים ועדכונים בזמן אמת. <strong class="text-slate-900 font-bold">הכל נגיש מכל מכשיר</strong> בצורה היפה והנוחה ביותר.'
      : 'Interactive routes, document management, personal notes, and real-time updates. <strong class="text-slate-900 font-bold">Everything is accessible from any device</strong> in the most beautiful way.',
    feat3Title: isRTL ? 'שיתוף פעולה אמיתי' : 'Collaborative Planning',
    feat3Desc: isRTL
      ? 'יוצאים עם חברים או משפחה? <strong class="text-slate-900 font-bold">תכננו יחד.</strong> שתפו מסלולים, הוסיפו נקודות עניין, ונהלו את החוויה כקבוצה בצורה חלקה.'
      : 'Traveling with friends or family? <strong class="text-slate-900 font-bold">Plan together.</strong> Share itineraries, add points of interest, and manage the experience as a group.',
    
    ctaTitle: isRTL ? 'בואו נבנה משהו מדהים ביחד' : 'Let\'s build something amazing',
    ctaDesc: isRTL ? 'יש לכם רעיון לפיצ\'ר חדש? הצעות לשיפור? אנחנו תמיד שמחים לשמוע ממטיילים.' : 'Have an idea for a new feature? Suggestions? We love hearing from fellow travelers.',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* תפריט עליון נקי */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-[#0770E8] font-bold transition-colors group tracking-wide text-sm uppercase"
          >
            {isRTL ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
            {isRTL ? 'חזרה' : 'Back'}
          </button>
          
          <h1 className="text-2xl font-extrabold text-slate-600 tracking-tight absolute left-1/2 -translate-x-1/2 flex items-baseline">
            Voyago<span className="text-[#0770E8] font-black text-3xl leading-[0.5] ml-0.5">.</span>
          </h1>

          <div className="w-20"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-24">
        
        {/* סקשן פתיחה */}
        <section className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0770E8] rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-blue-100">
            <Sparkles className="w-4 h-4" /> {content.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            {content.subtitle}
          </p>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="absolute top-0 end-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="w-16 h-16 bg-[#0770E8]/10 text-[#0770E8] rounded-3xl flex items-center justify-center mx-auto transform rotate-12">
              <Plane className="w-8 h-8 -rotate-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">{content.storyTitle}</h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>{content.storyText1}</p>
              <p className="font-medium text-slate-800">{content.storyText2}</p>
            </div>
          </div>
        </section>

        {/* מאפיינים */}
        <section className="space-y-10">
          <div className="text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
             <h2 className="text-3xl font-extrabold text-slate-900">{content.howTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{animationDelay: '0.4s'}}>
              <div className="w-14 h-14 bg-blue-50 text-[#0770E8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{content.feat1Title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: content.feat1Desc }} />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{animationDelay: '0.5s'}}>
              <div className="w-14 h-14 bg-blue-50 text-[#0770E8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Map className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{content.feat2Title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: content.feat2Desc }} />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{animationDelay: '0.6s'}}>
              <div className="w-14 h-14 bg-blue-50 text-[#0770E8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{content.feat3Title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: content.feat3Desc }} />
            </div>
          </div>
        </section>

        {/* ליצירת קשר */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.7s'}}>
          <div className="text-center bg-slate-700 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0770E8] opacity-30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-inner">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{content.ctaTitle}</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base font-medium leading-relaxed">
                {content.ctaDesc}
              </p>
              <a href="mailto:voyagoAI@gmail.com" className="inline-flex items-center gap-2 bg-[#0770E8] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-blue-900/50 active:scale-95">
                <Zap className="w-4 h-4 text-blue-200" />
                voyagoAI@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 mt-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
          &copy; {new Date().getFullYear()} Voyago Labs. {isRTL ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
        </div>
      </footer>

    </div>
  );
}

export default About;