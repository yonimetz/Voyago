import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { User, Shield, Sparkles, Mail, AlertTriangle, Trash2, Edit2, ArrowLeft, ArrowRight, Plus, Globe, Key, X, Lock } from 'lucide-react';

function Profile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  
  const [preferencesList, setPreferencesList] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const suggestedPreferences = [
    t('pref_kids', 'Traveling with young children (relaxed pace)'),
    t('pref_budget', 'Budget-friendly options preferred'),
    t('pref_kosher', 'Kosher food and Shabbat observant'),
    t('pref_vegan', 'Vegetarian/Vegan food options'),
    t('pref_culture', 'Focus on history and culture')
  ];

  useEffect(() => {
    const prefsFromServer = currentUser?.aiPreferences || currentUser?.ai_preferences || currentUser?.aipreferences;

    if (prefsFromServer) {
      try {
        if (Array.isArray(prefsFromServer)) {
          setPreferencesList(prefsFromServer);
          return;
        }

        if (typeof prefsFromServer === 'string' && prefsFromServer.trim().startsWith('[')) {
          const parsedPrefs = JSON.parse(prefsFromServer);
          if (Array.isArray(parsedPrefs)) {
            setPreferencesList(parsedPrefs);
            return;
          }
        }

        if (typeof prefsFromServer === 'string') {
          const cleanText = prefsFromServer.replace(/^"|"$/g, ''); 
          if (cleanText.includes(',')) {
            setPreferencesList(cleanText.split(',').map(p => p.trim()).filter(Boolean));
          } else {
            setPreferencesList([cleanText]);
          }
        }
      } catch (e) {
        console.error("Error parsing preferences:", e);
        setPreferencesList([prefsFromServer]); 
      }
    }
  }, [currentUser]);

  const handleAddPreference = (textToAdd) => {
    const text = textToAdd || currentInput;
    if (!text.trim()) return; 
    
    if (!preferencesList.includes(text.trim())) {
      setPreferencesList(prev => [...prev, text.trim()]);
    }
    setCurrentInput(''); 
  };

  const handleDelete = (indexToRemove) => {
    setPreferencesList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEdit = (indexToEdit, text) => {
    setCurrentInput(text);
    handleDelete(indexToEdit);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const stringifiedPrefs = JSON.stringify(preferencesList);

      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}`, 
        { 
          username: editUsername,
          email: editEmail,
          aiPreferences: stringifiedPrefs 
        },
        { withCredentials: true }
      );
      
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      localStorage.setItem('voyago_user', JSON.stringify(updatedUser));
      
      toast.success(isRTL ? "הפרופיל עודכן בהצלחה! 🚀" : "Profile updated successfully! 🚀");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(isRTL ? "שגיאה בשמירת הנתונים" : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast.error(t('password_mismatch', 'New passwords do not match!'));
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // הנחה: יש נתיב בשרת לשינוי סיסמה
      await axios.put(`http://localhost:8080/api/users/${currentUser.id}/password`, {
        oldPassword: passwordData.current,
        newPassword: passwordData.new
      }, { withCredentials: true });

      toast.success(t('password_updated', 'Password updated successfully! 🔒'));
      setIsPasswordModalOpen(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(t('password_update_failed', 'Failed to update password. Please check your current password.'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('delete_confirm', 'Are you sure you want to delete your account? All trips will be lost!'))) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${currentUser.id}`, { withCredentials: true });
        localStorage.removeItem('voyago_user');
        setCurrentUser(null);
        toast.success(isRTL ? "החשבון נמחק." : "Account deleted.");
        navigate('/login');
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error(isRTL ? "שגיאה במחיקת החשבון." : "Failed to delete account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <Toaster position="bottom-center" />
      
      {/* תפריט עליון */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            {t('profile_back', 'Back')}
          </button>

          <h1 className="text-xl font-black text-slate-800 tracking-tight absolute left-1/2 -translate-x-1/2">
            Voyago<span className="text-blue-600">.</span>
          </h1>
          
          <div className="w-20"></div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
          {t('profile_title', 'Profile & Settings')}
        </h1>

        <div className="space-y-8">
          
          {/* כרטיסיית פרטי חשבון ואבטחה */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-500" /> {t('account_details', 'Account & Security')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('username_label', 'Username')}</label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input 
                    type="text" 
                    value={editUsername} 
                    onChange={(e) => setEditUsername(e.target.value)}
                    className={`w-full p-4 bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl outline-none transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('email_label', 'Email')}</label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={`w-full p-4 bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl outline-none transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <Globe className="w-5 h-5 text-slate-400" />
                 <select 
                   value={i18n.language} 
                   onChange={handleLanguageChange}
                   className="bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer transition-all"
                 >
                   <option value="en">English (US)</option>
                   <option value="he">עברית (Hebrew)</option>
                 </select>
              </div>
              
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Key className="w-4 h-4" /> {t('change_password_btn', 'Change Password')}
              </button>
            </div>
          </div>

          {/* כרטיסיית העדפות */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-[2rem] shadow-sm border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> {t('smart_profile', 'Smart Travel Profile')}
            </h2>
            <p className="text-blue-700/80 text-sm mb-6 font-medium">
              {t('smart_profile_desc', 'Build your travel rules. Click suggestions or type your own. Our AI will automatically apply these to every trip!')}
            </p>
            
            <div className="mb-6">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">{t('suggested_prefs', 'Suggested Preferences:')}</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPreferences.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreference(suggestion)}
                    className="bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input 
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPreference()}
                placeholder={t('add_custom_rule', "Add a custom rule (e.g., 'We hate early mornings')")}
                className="flex-1 p-4 bg-white border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="button"
                onClick={() => handleAddPreference()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-sm active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2"
                disabled={!currentInput.trim()}
              >
                <Plus className="w-4 h-4" /> {t('btn_add', 'Add')}
              </button>
            </div>

            {preferencesList.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-inner">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mx-2">{t('saved_rules', 'Your Saved Rules:')}</p>
                <ul className="space-y-2">
                  {preferencesList.map((pref, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors group">
                      <span className="text-sm font-medium text-slate-700">{pref}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={() => handleEdit(index, pref)} className="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-50 rounded-lg" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 pb-8 border-b border-slate-200">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 transform active:scale-95 disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
              {isSaving ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
              {isSaving ? t('saving', 'Saving...') : t('btn_save_profile', 'Save Profile Changes')}
            </button>
          </div>

          {/* אזור מסוכן */}
          <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-200 mt-12">
            <h2 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {t('danger_zone', 'Danger Zone')}
            </h2>
            <p className="text-red-600/80 text-sm mb-6 font-medium">
              {t('delete_account_desc', 'Once you delete your account, there is no going back. Please be certain.')}
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> {t('delete_account', 'Delete Account Permanently')}
            </button>
          </div>

        </div>
      </main>

      {/*מודל שינוי סיסמה */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-fade-in">
            <button 
              onClick={() => setIsPasswordModalOpen(false)} 
              className={`absolute top-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors ${isRTL ? 'left-6' : 'right-6'}`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
               <Lock className="w-8 h-8"/>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-6">
               {t('change_password_btn', 'Change Password')}
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('current_password', 'Current Password')}</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('new_password', 'New Password')}</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('confirm_password', 'Confirm New Password')}</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button 
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:bg-slate-400"
                >
                  {isUpdatingPassword ? '...' : t('save_password', 'Update Password')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;