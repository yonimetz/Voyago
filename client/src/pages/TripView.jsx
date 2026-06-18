import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, Calendar, ArrowLeft, ArrowRight, Clock, Plus, Edit3, Navigation, Save, X, Wand2, Sparkles, Printer, Paperclip, FileText, Loader2 } from 'lucide-react';

function StopImage({ keyword, stopName, onImageLoad }) {
  const [imageUrl, setImageUrl] = useState(null);
  
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
  
  useEffect(() => {
    const fetchImage = async () => {
      if (!keyword) {
          if(onImageLoad) onImageLoad(false);
          return;
      }

      try {
        const query = encodeURIComponent(keyword); 
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
          { withCredentials: false }
        );
        
        if (response.data.results.length > 0) {
          setImageUrl(response.data.results[0].urls.regular);
          if(onImageLoad) onImageLoad(true);
        } else {
          if(onImageLoad) onImageLoad(false);
        }
      } catch (error) {
        console.error("Error fetching stop image", error);
        if(onImageLoad) onImageLoad(false);
      }
    };
    
    fetchImage();
  }, [keyword, onImageLoad]);

  if (!imageUrl) return null;

  return <img src={imageUrl} alt={stopName || keyword} className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />;
}

function StopCard({ stop, stopIndex, trip }) {
    const [currentStop, setCurrentStop] = useState(stop);
    const [originalStop, setOriginalStop] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isReverting, setIsReverting] = useState(false);
    const [hasImage, setHasImage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(currentStop.personalNote || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const CLOUDINARY_CLOUD_NAME = "dz6lohc2f";
    const CLOUDINARY_UPLOAD_PRESET = "voyago_docs";

    const handleSaveNote = async () => {
      try {
          setIsSaving(true);
            await axios.put(
                `http://localhost:8080/api/stops/${currentStop.id}/note`,
                { note: note },
                { withCredentials: true }
            );
            setIsEditing(false);
            setCurrentStop(prev => ({ ...prev, personalNote: note }));
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        setShowAIPrompt(false);
        setOriginalStop(currentStop); 
        
        try {
            const response = await axios.post(
                `http://localhost:8080/api/stops/${currentStop.id}/regenerate`,
                { 
                    tripId: trip.id,
                    userPrompt: aiPrompt 
                },
                { withCredentials: true }
            );
            
            setCurrentStop(response.data);
            setAiPrompt('');
            setIsPreview(true);
            
        } catch (error) {
    console.error("Error regenerating stop:", error);
    
    const errorMessage = error.response?.data?.error || "";
    
    if (errorMessage.includes("503") || errorMessage.toLowerCase().includes("demand") || errorMessage.toLowerCase().includes("unavailable")) {
        toast('The AI service is experiencing extremely high demand right now. Please wait a minute and try clicking Generate again!', {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
        });
    } else {
        toast.error("Failed to generate your trip. Please try again.");
    }
} finally {
            setIsRegenerating(false); 
        }
    };

    const handleKeep = () => {
        setIsPreview(false);
        setOriginalStop(null);
    };

    const handleRevert = async () => {
        setIsReverting(true);
        try {
            await axios.put(`http://localhost:8080/api/stops/${currentStop.id}/restore`, {
                locationName: originalStop.locationName,
                visitTime: originalStop.visitTime,
                address: originalStop.address || "",
                imageKeyword: originalStop.imageKeyword || ""
            }, { withCredentials: true });
            
            setCurrentStop(originalStop);
            setIsPreview(false);
            setOriginalStop(null);
        } catch (error) {
            console.error("Error restoring:", error);
            toast.error("Failed to revert. Please refresh the page.");
        } finally {
            setIsReverting(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
                formData,
                { 
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: false 
                }
            );
            
            const fileUrl = cloudinaryRes.data.secure_url;
            const fileName = file.name;

            await axios.put(
                `http://localhost:8080/api/stops/${currentStop.id}/document`,
                { documentUrl: fileUrl, documentName: fileName },
                { withCredentials: true }
            );

            setCurrentStop(prev => ({ ...prev, attachedDocumentUrl: fileUrl, attachedDocumentName: fileName }));
            
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveDocument = async () => {
        if (!window.confirm("Are you sure you want to remove this document?")) return;
        
        try {
            await axios.put(
                `http://localhost:8080/api/stops/${currentStop.id}/document`,
                { documentUrl: "", documentName: "" },
                { withCredentials: true }
            );
            
            setCurrentStop(prev => ({ ...prev, attachedDocumentUrl: "", attachedDocumentName: "" }));
        } catch (error) {
            console.error("Failed to remove document", error);
            toast.error("Failed to remove document.");
        }
    };

    if (isRegenerating) {
        return (
            <div className="relative ps-6 md:ps-10">
                <span className="absolute -start-[11px] top-12 w-5 h-5 rounded-full border-4 border-white bg-slate-200"></span>
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 animate-pulse">
                    <div className="w-full md:w-2/5 h-48 rounded-3xl bg-slate-100 shrink-0"></div>
                    <div className="w-full md:w-3/5 py-2 pe-4 flex flex-col gap-4">
                        <div className="h-8 bg-slate-100 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
                        <div className="space-y-2 mt-4">
                            <div className="h-3 bg-slate-50 rounded-md w-full"></div>
                            <div className="h-3 bg-slate-50 rounded-md w-5/6"></div>
                            <div className="h-3 bg-slate-50 rounded-md w-4/6"></div>
                        </div>
                        <div className="mt-auto flex items-center justify-center gap-2 text-indigo-400 font-bold text-sm bg-indigo-50/50 p-3 rounded-2xl">
                            <Sparkles className="w-4 h-4 animate-spin" /> AI is crafting an alternative...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="relative ps-6 md:ps-10 group print:break-inside-avoid">
        <span className={`absolute -start-[11px] top-12 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${isPreview ? 'bg-green-500' : 'bg-blue-500'} print:border-slate-300 print:shadow-none`}></span>
        
        <div className={`bg-white rounded-[2rem] p-4 shadow-sm border transition-shadow flex flex-col md:flex-row gap-6 print:border-slate-300 print:shadow-none ${isPreview ? 'border-green-200 ring-2 ring-green-50' : 'border-slate-100 hover:shadow-xl'}`}>
          
          {hasImage && (
              <div className="w-full md:w-2/5 h-48 md:h-auto rounded-3xl overflow-hidden relative shrink-0 bg-slate-50">
                  <StopImage 
                      keyword={currentStop.imageKeyword} 
                      stopName={currentStop.locationName || currentStop.stopName}
                      onImageLoad={(success) => setHasImage(success)} 
                  />
                  <div className={`absolute top-3 start-3 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center font-black shadow-sm ${isPreview ? 'bg-green-600/90 text-white' : 'bg-white/90 text-blue-700'}`}>
                      {stopIndex + 1}
                  </div>
              </div>
          )}

          <div className={`py-2 pe-4 flex flex-col justify-between ${hasImage ? 'w-full md:w-3/5' : 'w-full'}`}>
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                 <div className="flex items-center gap-3">
                     {!hasImage && (
                         <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${isPreview ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} print:bg-slate-100 print:text-slate-800`}>
                             {stopIndex + 1}
                         </span>
                     )}
                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors print:text-black">
                        {currentStop.locationName || currentStop.stopName}
                     </h3>
                 </div>
                 
                 {!isPreview && (
                     <button 
                        onClick={() => setShowAIPrompt(!showAIPrompt)}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0 print:hidden"
                        title="Change this stop with AI"
                     >
                        <Wand2 className="w-5 h-5" />
                     </button>
                 )}
              </div>
              
              {currentStop.address && (
                <p className="text-slate-500 text-sm font-medium mb-3 flex items-center gap-1.5 print:text-slate-600">
                  <MapPin className="w-4 h-4 text-blue-500 print:text-slate-400" /> {currentStop.address}
                </p>
              )}
              
              <p className="text-slate-600 leading-relaxed text-sm mb-4 print:text-black">
                {currentStop.visitTime || currentStop.description}
              </p>
            </div>

            {isPreview ? (
                <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-inner print:hidden">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-sm">
                        <Sparkles className="w-5 h-5 text-green-600" /> 
                        How does this alternative look?
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={handleRevert} disabled={isReverting} className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50">
                            {isReverting ? 'Undoing...' : 'Undo'}
                        </button>
                        <button onClick={handleKeep} className="flex-1 md:flex-none px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm transition-colors">
                            Keep it
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {showAIPrompt && (
                        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 animate-fade-in shadow-inner print:hidden">
                            <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold text-sm">
                                <Sparkles className="w-4 h-4" /> Want to change this stop?
                            </div>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="e.g., 'Too expensive', 'Prefer nature over museums', or leave blank for a random alternative..."
                                className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none mb-3 placeholder-slate-400"
                                rows="2"
                            />
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => setShowAIPrompt(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleRegenerate}
                                    disabled={isRegenerating}
                                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm shadow-indigo-200 disabled:bg-indigo-400"
                                >
                                    <Wand2 className="w-3.5 h-3.5" /> Regenerate Stop
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-2 mb-4 print:hidden">
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          className="hidden" 
                          accept="image/*,.pdf" 
                      />
                      
                      {isUploading ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold animate-pulse">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading securely...
                          </div>
                      ) : currentStop.attachedDocumentUrl ? (
                          <div className="inline-flex items-center gap-2">
                            <a 
                                href={currentStop.attachedDocumentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                                <FileText className="w-3.5 h-3.5" /> 
                                <span className="truncate max-w-[150px]">{currentStop.attachedDocumentName || "View Document"}</span>
                            </a>
                            <button 
                                onClick={handleRemoveDocument}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove document"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                      ) : (
                          <button 
                              onClick={() => fileInputRef.current.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors"
                          >
                              <Paperclip className="w-3.5 h-3.5" /> Attach Ticket / PDF
                          </button>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100/50 print:pt-2 print:border-none">
                      {isEditing ? (
                        <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 animate-fade-in print:hidden">
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write your thoughts, reservation details, or reminders here..."
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none text-sm min-h-[80px] p-1"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setNote(currentStop.personalNote || '');
                              }}
                              disabled={isSaving}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                            <button
                              onClick={handleSaveNote}
                              disabled={isSaving}
                              className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              {isSaving ? 'Saving...' : 'Save Note'}
                            </button>
                          </div>
                        </div>
                      ) : note ? (
                        <div 
                          onClick={() => setIsEditing(true)}
                          className="bg-amber-50 p-3 rounded-2xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors group/note relative print:bg-transparent print:border-none print:p-0"
                        >
                          <div className="flex items-start gap-2">
                            <Edit3 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 print:hidden" />
                            <p className="text-slate-700 text-sm whitespace-pre-wrap print:text-black">
                              <span className="hidden print:inline font-bold">Note: </span>
                              {note}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => setIsEditing(true)}
                          className="bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-colors print:hidden"
                        >
                          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm hover:text-blue-600">
                            <Plus className="w-4 h-4 bg-slate-200 text-slate-600 rounded-full p-0.5 hover:bg-blue-200 hover:text-blue-700 transition-colors" />
                            Add a personal note for this stop...
                          </div>
                        </div>
                      )}
                    </div>
                </>
            )}
            
          </div>
        </div>
      </div>
    );
}

function TripView() { 
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/trips/${tripId}`, { withCredentials: true });
        setTrip(response.data);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const scrollToDay = (dayNumber) => {
    setActiveDay(dayNumber);
    const element = document.getElementById(`day-${dayNumber}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!trip) return <div className="text-center py-20 text-slate-500">Trip not found.</div>;

 return (
  
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 scroll-smooth">
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* סרגל עליון */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            {isRTL ? <ArrowRight className="w-5 h-5 me-2" /> : <ArrowLeft className="w-5 h-5 me-2" />}
            Back
          </button>
          
          <h1 className="text-xl font-black text-slate-800 tracking-tight absolute left-1/2 -translate-x-1/2">
            Voyago<span className="text-blue-600">.</span>
          </h1>

          <div className="w-20"></div> 
        </div>
      </div>

      <div className="print:bg-white print:pb-0">
        
        <div className="relative h-[35vh] min-h-[300px] w-full print:h-[250px] print:min-h-[250px]">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" 
            alt="Trip Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent print:from-slate-900/70"></div>

          <div className="absolute bottom-0 start-0 p-8 w-full max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
              {trip.destination}
            </h1>
            <div className="flex items-center gap-2 text-blue-200 font-medium text-lg drop-shadow-md">
              <Calendar className="w-5 h-5" />
              <span>{trip.startDate} — {trip.endDate}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 print:py-8 print:gap-0">
          
          {/* תפריט צד */}
          <aside className="lg:w-1/4 print:hidden">
            <div className="sticky top-24 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-indigo-500" />
                  Trip Itinerary
                </h3>
                
                {/* קריאה ישירה לדפדפן להדפיס! */}
                <button 
                  onClick={() => window.print()} 
                  className="flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:scale-105 rounded-xl transition-all"
                  title="Export to PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                  <button
                    key={day.id}
                    onClick={() => scrollToDay(day.dayNumber)}
                    className={`text-start px-5 py-4 rounded-2xl font-bold transition-all ${
                      activeDay === day.dayNumber 
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    Day {day.dayNumber}
                    <span className="block text-xs font-normal text-slate-400 mt-1 truncate">
                      {day.date || day.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* המסלול ברוחב מלא בהדפסה */}
          <main className="lg:w-3/4 print:w-full">
            <div className="space-y-16 relative print:space-y-10">
              
              {trip.days?.sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                <div key={day.id} id={`day-${day.dayNumber}`} className="scroll-mt-24 print:break-inside-avoid">
                  
                  <div className="mb-8 pb-4 border-b-2 border-slate-100 print:mb-6">
                    <h2 className="text-3xl font-black text-blue-600 flex items-center gap-2">
                      {day.date ? (
                        <>Day {day.dayNumber} <span className="text-blue-400 font-bold text-2xl">- {day.date}</span></>
                      ) : (
                        <>{day.description}</>
                      )}
                    </h2>
                  </div>
                  <div className="relative border-s-2 border-blue-100 ms-4 md:ms-6 space-y-8 pb-4 print:space-y-6 print:border-s-0 print:ms-0">
                    {day.stops?.map((stop, stopIndex) => (
                      <StopCard key={stop.id} stop={stop} stopIndex={stopIndex} trip={trip} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TripView;