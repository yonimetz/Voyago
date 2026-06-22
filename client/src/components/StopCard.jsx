import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Sparkles, Wand2, Edit3, Plus, Save, X, Paperclip, FileText, Loader2 } from 'lucide-react';

// קומפוננטת התמונה של התחנה
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

// קומפוננטת התחנה המרכזית
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
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentStop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-3 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 -ms-2 rounded-lg transition-colors group/map cursor-pointer print:text-slate-600 print:hover:bg-transparent print:p-0 print:ms-0"
                  title="Open in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform print:text-slate-400" /> 
                  {currentStop.address}
                </a>
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

export default StopCard;