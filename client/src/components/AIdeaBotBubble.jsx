import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { X, Sparkles, Wand2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

function AIdeaBotBubble({ currentUser, setShowCreateForm, setDestination }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const initialMessage = {
    role: 'bot',
    text: isRTL 
      ? `היי ${currentUser?.username || ''}! אני יוגי, העוזר AI האישי שלך. איזה סוג טיול מתחשק לך היום?`
      : `Hi ${currentUser?.username || ''}! I'm Yogi, your personal assistant. What kind of trip are you looking for today?`
  };

  const [messages, setMessages] = useState([initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([initialMessage]);
    }
  }, [i18n.language]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMessages = [...messages, { role: 'user', text: userText }];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const responseLanguage = isRTL ? "Israeli Hebrew" : "English";
    const userPrefs = currentUser?.aiPreferences || currentUser?.ai_preferences || "Relaxing, Budget";

    const conversationHistory = newMessages.map(msg => 
      `${msg.role === 'bot' ? 'AIdea' : 'User'}: ${msg.text}`
    ).join('\n');

    // עדכנו את הפרומפט שיבקש כוכביות (Markdown) שזה הפורמט הטבעי של המודל
    const promptContext = `You are AIdea, a friendly, proactive travel advisor for user ${currentUser?.username || 'the user'}.
      User saved preferences: [${userPrefs}].
      
      Conversation history so far:
      ${conversationHistory}
      
      Instructions:
      1. Respond directly to the User's last message naturally and engagingly.
      2. IMPORTANT: If providing destination recommendations, YOU MUST NOT REPEAT any destinations that were already mentioned. Give entirely new suggestions.
      3. When suggesting a destination, YOU MUST wrap the city name in double asterisks exactly like this: **City Name**.
      4. The response MUST be entirely in ${responseLanguage}.
      5. Keep it concise, engaging, and under 50 words.`;

    try {
      const response = await axios.post('http://localhost:8080/api/ai/chat', 
        { prompt: promptContext }, 
        { withCredentials: true }
      );

      let botReply = response.data.text || response.data.reply || response.data; 
      
      // אנו ממירים את הכוכביות של המודל לתגיות HTML כדי שיוצגו יפה וכדי שהחילוץ יעבוד
      botReply = botReply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
      setIsLoading(false);

    } catch (err) {
      console.error("AIdea API Error:", err);
      toast.error(isRTL ? "AIdea קצת עמוס עכשיו, נסה שוב." : "AIdea is busy right now, try again.");
      setIsLoading(false);
      setMessages(messages); 
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  const handlePlanNow = () => {
    const lastBotMessage = messages[messages.length - 1];
    if (lastBotMessage && lastBotMessage.role === 'bot') {
      
      // עכשיו הבדיקה עובדת מצוין כי אנחנו ממירים ל-strong לפני השמירה
      const regex = /<strong>(.*?)<\/strong>/; 
      const match = lastBotMessage.text.match(regex);
      
      if (match && match[1]) {
        let destino = match[1].trim(); 
        
        // אם המודל החזיר "עיר, ארץ", ניקח רק את העיר (מה שלפני הפסיק)
        if (destino.includes(',')) {
          destino = destino.split(',')[0].trim();
        }

        setDestination(destino); 
        setShowCreateForm(true); 
        setIsOpen(false); 
        toast.success(isRTL ? `מתכננים טיול ל${destino}!` : `Planning a trip to ${destino}!`);
      } else {
        toast.error(isRTL ? "לא הצלחתי לזהות את היעד מתוך השיחה." : "Could not identify the destination from the chat.");
      }
    }
  };

  return (
    <div className="fixed bottom-8 end-8 z-50 flex flex-col items-end" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {isOpen && (
        <div className="w-[340px] md:w-[380px] h-[500px] mb-4 bg-[#0770E8] rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          
          <div className="flex items-center justify-between p-4 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-blue-100" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-none tracking-wide">AIDEA.</h3>
                <span className="text-white/70 text-xs font-medium">
                  {isRTL ? 'העוזר האישי שלך' : 'Voyago Assistant'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3.5 text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? `bg-white text-[#0770E8] rounded-2xl ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-sm` 
                      : `bg-white/10 border border-white/10 text-white rounded-2xl ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`bg-white/10 border border-white/10 rounded-2xl p-3 flex gap-1 ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 shrink-0">
            <div className="flex gap-2 mb-3">
              <button onClick={handlePlanNow} className="flex-1 bg-white hover:bg-blue-50 text-[#0770E8] rounded-xl py-2.5 font-black text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-colors">
                <Wand2 className="w-4 h-4"/> {isRTL ? 'תכנן עכשיו' : 'Plan Now'}
              </button>
              <button onClick={clearChat} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-black text-xs border border-white/20 uppercase tracking-wider transition-colors">
                {isRTL ? 'נקה שיחה' : 'Clear'}
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isRTL ? 'שלח הודעה ל-AIdea...' : 'Chat with AIdea...'}
                className={`w-full bg-white/10 border border-white/20 rounded-xl py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'}`}
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-white/50 hover:text-white disabled:opacity-50 transition-colors p-1`}
              >
                <Send className={`w-4 h-4 ${isRTL ? 'transform rotate-180' : ''}`} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-6 rounded-full bg-[#0770E8] text-white flex items-center gap-2.5 shadow-[0_8px_30px_rgba(7,112,232,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 transform-gpu border border-white/10 group"
      >
        <Sparkles className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold tracking-wider">
          {isRTL ? 'רעיון AI' : 'AIdea'}
        </span>
      </button>

    </div>
  );
}

export default AIdeaBotBubble;