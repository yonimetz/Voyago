import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

function Terms() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const lastUpdated = "June 2026";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-6 py-16">
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {isRTL ? 'תנאי שימוש ומדיניות פרטיות' : 'Terms Service & Privacy Policy'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isRTL ? `עודכן לאחרונה: ${lastUpdated}` : `Last Updated: ${lastUpdated}`}
          </p>
        </header>

        <div className="space-y-12 text-slate-600 leading-relaxed">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">{isRTL ? '1. הסכמה לתנאים' : '1. Acceptance of Terms'}</h2>
            </div>
            <p>
              {isRTL 
                ? 'על ידי גישה או שימוש באפליקציית Voyago, אתה מסכים להיות כפוף לתנאים אלו. אם אינך מסכים לכל התנאים, אינך מורשה לגשת לשירות. אנו שומרים לעצמנו את הזכות לעדכן או לשנות תנאים אלו בכל עת ללא הודעה מוקדמת.'
                : 'By accessing or using the Voyago application, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the Service. We reserve the right to update or change our Terms at any time without prior notice.'}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900">{isRTL ? '2. תוכן מבוסס בינה מלאכותית' : '2. AI-Generated Content Disclaimer'}</h2>
            </div>
            <p>
              {isRTL 
                ? 'Voyago עושה שימוש במודלים מתקדמים של בינה מלאכותית כדי ליצור מסלולי טיול והמלצות. יחד עם זאת, התוכן מיוצר באופן אוטומטי ועלול להכיל שגיאות, אי-דיוקים או מידע לא מעודכן לגבי זמני פתיחה, מחירים ומרחקים. המשתמש מצהיר כי באחריותו הבלעדית לוודא ולאמת את כל הפרטים לפני ביצוע הזמנות או נסיעות בפועל.'
                : 'Voyago utilizes advanced Artificial Intelligence to generate itineraries and travel recommendations. While we strive for accuracy, the content is automatically generated and may contain errors, inaccuracies, or outdated information regarding opening hours, prices, or distances. You agree that it is your sole responsibility to verify all details before making bookings or traveling.'}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">{isRTL ? '3. מדיניות פרטיות' : '3. Privacy Policy'}</h2>
            </div>
            <p className="mb-4">
              {isRTL 
                ? 'אנו מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך. המידע שאנו אוספים (כגון כתובת אימייל ושם משתמש) משמש אך ורק לצורך ניהול חשבונך ושמירת מסלולי הטיול שיצרת.'
                : 'We respect your privacy and are committed to protecting your personal data. The information we collect (such as email and username) is used solely to manage your account and save your generated itineraries.'}
            </p>
            <ul className="list-disc list-inside ms-4 space-y-2 text-slate-500">
              <li>{isRTL ? 'איננו מוכרים את המידע שלך לצדדים שלישיים.' : 'We do not sell your personal data to third parties.'}</li>
              <li>{isRTL ? 'הסיסמאות נשמרות בצורה מוצפנת ומאובטחת.' : 'Passwords are encrypted and stored securely.'}</li>
              <li>{isRTL ? 'מסמכים המועלים לאתר (כגון כרטיסי טיסה) נשמרים בענן מאובטח ונגישים רק לך.' : 'Documents uploaded to the platform (e.g., tickets) are securely stored and accessible only by you.'}</li>
            </ul>
          </section>

          <section className="pt-8 border-t border-slate-100 text-sm text-slate-400">
            <p>
              {isRTL 
                ? 'לשאלות נוספות בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת: voyagoAI@gmail.com'
                : 'For any questions regarding these Terms, please contact us at: voyagoAI@gmail.com'}
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Terms;