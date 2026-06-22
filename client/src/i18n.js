import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "register_welcome": "Join the adventure! Create an account.",
      "register_email": "Email",
      "register_btn": "Create Account",
      "register_connecting": "Creating Account...",
      "register_error": "Registration failed. Username or email might be taken.",
      "register_has_account": "Already have an account?",
      "register_login": "Login here",
      "nav_about": "About Us",
      "nav_blog": "Blog",
      "nav_support": "Support",
      "nav_contact": "Contact",
      "nav_terms": "Terms & Privacy",

      "hero_title": "Plan Your Journey as you imagined",
      "hero_subtitle": "Every great journey begins with a vision. Let us seamlessly weave your desires into a breathtaking, tailor-made adventure designed exclusively for you.",

      "login_welcome": "Welcome back! Please login.",
      "login_username": "Username",
      "login_password": "Password",
      "login_btn": "Login",
      "login_connecting": "Connecting...",
      "login_error": "Invalid username or password",
      "login_no_account": "Don't have an account?",
      "login_signup": "Sign Up",

      "discover_more": "Discover More",

      "feat_ai_title": "AI-Powered Planning",
      "feat_ai_desc": "Generate personalized itineraries in seconds based on your specific travel style and preferences.",
      "feat_routes_title": "Interactive Routes",
      "feat_routes_desc": "Visualize your daily schedule with real-world imagery and precise location mapping.",
      "feat_collab_title": "Collaborative Travel",
      "feat_collab_desc": "Share your plans with travel partners and manage your upcoming adventures together.",

      "trending_title": "Trending Destinations",
      "trending_subtitle": "Discover popular routes created by the Voyago community.",

      "tag_culture": "Culture",
      "tag_romantic": "Romantic",
      "tag_urban": "Urban Energy",

      "dest_kyoto": "Kyoto, Japan",
      "desc_kyoto": "Ancient temples, gardens, and rich traditions.",
      "dest_paris": "Paris, France",
      "desc_paris": "Art, history, and iconic architecture.",
      "dest_nyc": "New York City",
      "desc_nyc": "Skyscrapers, Broadway, and endless possibilities.",

      "footer_rights": "© 2026 Voyago. All rights reserved.",

      "support_modal_title": "How can we help?",
      "contact_modal_title": "Get in Touch",
      "support_modal_desc": "Our support team is available 24/7. Send us an email and we will get back to you shortly.",
      "contact_modal_desc": "We would love to hear from you! Reach out for partnerships, press, or general inquiries.",
      "modal_contact_btn": "Email Us",

      "travel_management": "Travel Management",
      "account": "Account",
      "logged_in": "Logged In",
      "my_trips": "My Trips",
      "profile": "Profile & Settings",
      "logout": "Logout",
      "switch_lang": "עברית",
      "welcome": "Welcome",
      "subtitle": "Manage and explore your upcoming travel.",
      "new_trip": "New Trip +",
      "generating": "Generating your perfect trip...",
      "view_itinerary": "View Itinerary",
      "upcoming": "UPCOMING",
      "completed": "COMPLETED",
      "in_progress": "NOW",
      "destination": "Destination",
      "e.g. Paris, Tuscany, Spain...": "e.g. Paris, Tuscany, Spain...",
      "start_Date": "Start Date",
      "end_Date": "End Date",
      "Travel_Style": "Travel_Style",
      
      "Generate Itinerary": "Generate Itinerary",
      "Cancel": "Cancel",
      "No trips planned yet": "No trips planned yet",
      "Ready for a new adventure?": "Ready for a new adventure? Start by creating your first travel plan.",
      "Create a trip now": "Create a trip now",
      "wait_crafting": "Crafting your journey...",
      "wait_finding": "finding the perfect plan for you",
      "community": "Community",
      "discover_communities": "Discover Communities",
      "community_desc": "Connect with fellow travelers, share itineraries, and plan together.",
      "create_community": "Create Community",
      "search_destination": "Search by destination (e.g., Japan)...",
      "public": "Public",
      "private": "Private",
      "members": "members"

    }
  },
  he: {
    translation: {
      "register_welcome": "הצטרף להרפתקה! צור חשבון.",
      "register_email": "אימייל",
      "register_btn": "צור חשבון",
      "register_connecting": "יוצר חשבון...",
      "register_error": "ההרשמה נכשלה. ייתכן ששם המשתמש או האימייל כבר תפוסים.",
      "register_has_account": "כבר יש לך חשבון?",
      "register_login": "התחבר כאן",
      "nav_about": "עלינו",
      "nav_blog": "בלוג",
      "nav_support": "תמיכה",
      "nav_contact": "צור קשר",
      "nav_terms": "תנאים ופרטיות",

      "hero_title": "תכנן את המסע שלך בדיוק כפי שדמיינת",
      "hero_subtitle": "כל מסע גדול מתחיל בחזון. תן לנו לשזור בצורה חלקה את הרצונות שלך להרפתקה עוצרת נשימה, המותאמת אישית רק עבורך.",

      "login_welcome": "ברוך שובך! אנא התחבר.",
      "login_username": "שם משתמש",
      "login_password": "סיסמה",
      "login_btn": "התחברות",
      "login_connecting": "מתחבר...",
      "login_error": "שם משתמש או סיסמה שגויים",
      "login_no_account": "אין לך חשבון?",
      "login_signup": "הירשם עכשיו",

      "discover_more": "גלה עוד",

      "feat_ai_title": "תכנון מבוסס בינה מלאכותית",
      "feat_ai_desc": "צור מסלולים מותאמים אישית בשניות, מבוססים על סגנון הטיול וההעדפות שלך.",
      "feat_routes_title": "מסלולים אינטראקטיביים",
      "feat_routes_desc": "הצג את הלו\"ז היומי שלך עם תמונות אמיתיות ומיפוי מיקומים מדויק.",
      "feat_collab_title": "טיול משותף",
      "feat_collab_desc": "שתף את התוכניות שלך עם שותפים לטיול ונהלו את ההרפתקאות הבאות שלכם יחד.",

      "trending_title": "יעדים מובילים",
      "trending_subtitle": "גלה מסלולים פופולריים שנוצרו על ידי קהילת Voyago.",

      "tag_culture": "תרבות",
      "tag_romantic": "רומנטיקה",
      "tag_urban": "אנרגיה אורבנית",

      "dest_kyoto": "קיוטו, יפן",
      "desc_kyoto": "מקדשים עתיקים, גנים ומסורות עשירות.",
      "dest_paris": "פריז, צרפת",
      "desc_paris": "אמנות, היסטוריה וארכיטקטורה אייקונית.",
      "dest_nyc": "ניו יורק",
      "desc_nyc": "גורדי שחקים, ברודווי ואפשרויות אינסופיות.",

      "footer_rights": "© 2026 Voyago. כל הזכויות שמורות.",

      "support_modal_title": "איך אפשר לעזור?",
      "contact_modal_title": "צור קשר",
      "support_modal_desc": "צוות התמיכה שלנו זמין 24/7. שלח לנו אימייל ונחזור אליך בהקדם.",
      "contact_modal_desc": "נשמח לשמוע ממך! פנה אלינו לשיתופי פעולה, עיתונות או שאלות כלליות.",
      "modal_contact_btn": "שלח אימייל",

      "travel_management": "מתכנן נסיעות",
      "account": "חשבון",
      "logged_in": "מחובר",
      "my_trips": "הטיולים שלי",
      "profile": "פרופיל והגדרות",
      "logout": "התנתק",
      "switch_lang": "English",
      "welcome": "ברוך שובך",
      "subtitle": "תכנן וגלה את הטיולים הבאים שלך.",
      "new_trip": "+ טיול חדש",
      "generating": "מתכנן את טיול החלומות שלך...",
      "view_itinerary": "צפה במסלול",
      "upcoming": "בקרוב",
      "completed":"הסתיים",
      "in_progress":"עכשיו",
      "destination": "יעד",
      "e.g. Paris, Tuscany, Spain...": "לדוגמא פריז, טוסקנה, ספרד...",
      "start_Date": "תאריך התחלה",
      "end_Date": "תאריך סיום",
      "Travel_Style": "סגנון טיול",
      "style_recommended_label": "מומלץ",
      "style_recommended_desc": "איזון מושלם של נקודות העניין המרכזיות",
      "style_nature_label": "בדגש על טבע",
      "style_nature_desc": "התמקדות בנופים ומסלולים",
      "style_culture_label": "בדגש על תרבות",
      "style_culture_desc": "התמקדות במורשת ומוזיאונים",
      "style_relaxing_label": "חופשת בטן-גב",
      "style_relaxing_desc": "התמקדות ברוגע וקצב איטי",
      "style_family_label": "ידידותי למשפחות",
      "style_family_desc": "התמקדות בכיף לכל הגילאים",
      "toast_trip_created": "הטיול נוצר ונשמר בהצלחה! ✨",
      "toast_trip_failed": "אירעה שגיאה ביצירת הטיול. אנא נסה שוב.",
      "toast_ai_busy": "שירותי ה-AI עמוסים כרגע. אנא המתן מספר שניות ונסה שוב.",
      "plan_new_adventure": "תכנן הרפתקה חדשה",
      "ai_craft_itinerary": "תן ל-AI שלנו להרכיב עבורך את המסלול המושלם.",
      "Generate Itinerary": "צור מסלול טיול",
      "Cancel": "ביטול",
      "No trips planned yet": "אין טיולים מתוכננים",
      "Ready for a new adventure?": "מוכנים להרפתקה חדשה? התחילו ביצירת תוכנית הטיול הראשונה שלכם.",
      "Create a trip now": "צור טיול עכשיו",

      "wait_crafting": "מתכנן עבורך את הטיול...",
      "wait_finding": "יוצר את התוכנית המושלמת בשבילך",
      "community": "קהילה",
      "discover_communities": "גלה קהילות",
      "community_desc": "התחבר למטיילים אחרים, שתף מסלולים ותכננו יחד.",
      "create_community": "צור קהילה",
      "search_destination": "חפש לפי יעד (למשל, יפן)...",
      "public": "ציבורי",
      "private": "פרטי",
      "members": "חברים"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // שפת ברירת המחדל בעליית האתר
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;