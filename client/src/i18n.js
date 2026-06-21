import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
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