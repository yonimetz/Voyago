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