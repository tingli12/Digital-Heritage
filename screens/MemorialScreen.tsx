
import React, { useState, useRef } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, PlayCircle, Mic, ArrowLeft, X, ImageIcon, Video, FileAudio, Sparkles, Upload, Save, Calendar, Type, Check, Loader2 } from 'lucide-react';
import { Screen } from '../App';
import { GoogleGenAI } from "@google/genai";

interface MemorialScreenProps {
  setScreen: (screen: Screen) => void;
}

type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  content: string;
  type: 'image' | 'video' | 'audio';
  imageUrl: string;
}

type ViewMode = 'view' | 'edit' | 'delete';

const initialTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    year: '2023',
    title: '大學畢業典禮',
    content: '這是人生中最重要的時刻之一。謝謝家人一直以來的支持，也謝謝自己在大學四年的努力。雖然未來充滿未知，但我準備好了。',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    year: '2019',
    title: '第一次家庭旅行',
    content: '我們全家第一次一起去日本旅遊。在那次旅行中，我們留下了無數歡笑和美好的合照。當時的天氣雖然有點冷，但我們的心是熱的。',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
  },
];

const AddMemoryModal: React.FC<{ isOpen: boolean, onClose: () => void, onAdd: (event: TimelineEvent) => void }> = ({ isOpen, onClose, onAdd }) => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<'image' | 'video' | 'audio'>('image');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    if (!isOpen) return null;

    const generateMemoryImage = async (promptText: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const finalPrompt = `An evocative, cinematic, and high-quality artistic photograph representing this memory: "${promptText}". The style should be warm, slightly nostalgic, with beautiful lighting and professional composition.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: finalPrompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                    }
                }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error) {
            console.error("AI Image generation failed:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        const placeholderImages = {
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
            video: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
            audio: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80'
        };

        let finalImageUrl = placeholderImages[type];

        if (!fileName && type === 'image' && (title || content)) {
            const generatedUrl = await generateMemoryImage(`${title} - ${content}`);
            if (generatedUrl) {
                finalImageUrl = generatedUrl;
            }
        }
        
        onAdd({ 
            id: Date.now().toString(),
            year: date.split('-')[0], 
            title: title || "未命名回憶", 
            content: content || "這是一段珍貴的數位遺產回憶。",
            type, 
            imageUrl: finalImageUrl 
        });
        
        setIsGenerating(false);
        setTitle('');
        setContent('');
        setFileName(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white w-full max-w-sm mx-auto shadow-2xl animate-slide-up">
            {isGenerating && (
                <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-8 border-[#ccf381]/20 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-[#ccf381] rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-[#8b5cf6] animate-pulse" size={40} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI 正在創作回憶圖</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                            我們正在分析您的故事，並為您繪製專屬的紀念畫作...
                        </p>
                    </div>
                    <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-10 overflow-hidden">
                        <div className="h-full bg-[#ccf381] animate-loading-bar"></div>
                    </div>
                </div>
            )}

            <header className="px-6 py-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white sticky top-0">
                <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-gray-900" disabled={isGenerating}>
                    <X size={24} />
                </button>
                <h2 className="text-lg font-bold text-gray-900">紀錄珍貴瞬間</h2>
                <button 
                    onClick={handleSubmit} 
                    disabled={!title || !content || isGenerating}
                    className="bg-[#ccf381] text-black px-5 py-2 rounded-full font-bold text-sm shadow-md shadow-[#ccf381]/20 disabled:opacity-50 disabled:bg-gray-100 flex items-center gap-2 active:scale-95 transition-all"
                >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    儲存
                </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-12">
                <div 
                    onClick={() => !isGenerating && fileInputRef.current?.click()}
                    className={`aspect-video border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all ${fileName ? 'border-[#ccf381] bg-[#f7fee7]/30' : 'border-gray-200 bg-gray-50 hover:border-[#ccf381]'}`}
                >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${fileName ? 'bg-[#ccf381] text-black' : 'bg-white text-gray-400 shadow-sm'}`}>
                        {type === 'image' ? <ImageIcon size={28} /> : type === 'video' ? <Video size={28} /> : <FileAudio size={28} />}
                    </div>
                    <p className="font-bold text-gray-900 px-4 text-center truncate w-full">
                        {fileName || (type === 'image' ? "點擊上傳或由 AI 自動生成回憶圖" : "點擊上傳影音檔案")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG, MP4 等格式</p>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mx-auto">
                    {(['image', 'video', 'audio'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${type === t ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-400'}`}
                        >
                            {t === 'image' ? '照片' : t === 'video' ? '影片' : '錄音'}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                        <Calendar size={18} className="text-gray-400" />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            className="flex-1 text-sm font-bold text-gray-800 outline-none bg-transparent"
                            required 
                        />
                    </div>

                    <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                        <Type size={18} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="回憶標題（例如：全家福、某次旅行）" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            className="flex-1 text-base font-bold text-gray-900 outline-none bg-transparent placeholder-gray-300" 
                            required 
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">你要記錄的話</label>
                        <textarea 
                            placeholder="在此寫下您想要紀錄的故事或回憶..." 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            className="w-full h-48 p-5 bg-gray-50 border border-gray-100 rounded-[24px] text-gray-800 placeholder-gray-300 outline-none focus:bg-white focus:border-[#ccf381] transition-all resize-none leading-relaxed"
                            required 
                        />
                    </div>
                </div>
            </form>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-loading-bar { animation: loading-bar 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

const MemorialScreen: React.FC<MemorialScreenProps> = ({ setScreen }) => {
  const [events, setEvents] = useState<TimelineEvent[]>(initialTimelineEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddMemory = (event: TimelineEvent) => {
      setEvents(prev => [event, ...prev].sort((a,b) => b.year.localeCompare(a.year)));
  };

  const handleDeleteEvent = (id: string) => {
      setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="p-0 h-full flex flex-col text-gray-900 bg-gray-50 relative overflow-hidden">
      <AddMemoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddMemory} />

      <header className="px-6 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0 border-b border-gray-100">
        <button onClick={() => setScreen('home')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">數位紀念館</h1>
        
        <div className="relative">
            {viewMode === 'view' ? (
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 -mr-2 rounded-full transition-colors ${isMenuOpen ? 'bg-purple-100 text-[#8b5cf6]' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    <MoreVertical size={24} />
                </button>
            ) : (
                <button 
                    onClick={() => setViewMode('view')}
                    className="bg-gray-900 text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                >
                    <Check size={14} /> 完成
                </button>
            )}

            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-50 py-2 animate-pop">
                        <button 
                            onClick={() => { setViewMode('edit'); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#f7fee7] hover:text-[#8b5cf6] transition-colors"
                        >
                            <Edit2 size={18} /> 編輯回憶
                        </button>
                        <button 
                            onClick={() => { setViewMode('delete'); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} /> 刪除回憶
                        </button>
                    </div>
                </>
            )}
        </div>
      </header>
      
      <div className="relative overflow-y-auto pr-2 px-6 pt-6 flex-grow no-scrollbar z-10 pb-24">
        
        {viewMode === 'view' && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mb-10 py-4 bg-white border-2 border-dashed border-[#ccf381] rounded-[24px] flex items-center justify-center space-x-3 shadow-sm hover:bg-[#f7fee7] transition-all group active:scale-[0.98] animate-fade-in"
            >
                <div className="w-10 h-10 rounded-full bg-[#ccf381] text-black flex items-center justify-center shadow-lg shadow-[#ccf381]/20 group-hover:scale-110 transition-transform">
                    <Plus size={24} strokeWidth={3} />
                </div>
                <span className="font-black text-gray-900 tracking-tight">新增回憶</span>
            </button>
        )}

        {viewMode !== 'view' && (
            <div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white flex items-center justify-between shadow-lg animate-slide-down">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${viewMode === 'edit' ? 'bg-blue-500' : 'bg-red-500'}`}>
                        {viewMode === 'edit' ? <Edit2 size={18}/> : <Trash2 size={18}/>}
                    </div>
                    <div>
                        <p className="text-sm font-bold">{viewMode === 'edit' ? '編輯回憶' : '刪除回憶'}</p>
                        <p className="text-[10px] opacity-60">請點擊卡片下方的按鈕進行操作</p>
                    </div>
                </div>
            </div>
        )}

        <div className="relative">
            <div className="absolute left-4 top-2 bottom-0 w-[2px] bg-gradient-to-b from-[#ccf381] via-gray-200 to-transparent"></div>
            
            {events.map((event, index) => (
            <div key={event.id} className="relative pl-12 mb-12 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute left-[12px] top-1.5 w-3 h-3 bg-white border-4 border-[#ccf381] rounded-full shadow-[0_0_12px_rgba(204,243,129,0.5)] z-10"></div>
                
                <p className="font-black text-[#8b5cf6] mb-3 text-sm tracking-[0.2em] uppercase">{event.year}</p>

                <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500">
                    <div className="relative h-48 sm:h-56">
                        <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-100" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
                            }}
                        />
                        
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                            {event.type === 'video' ? <Video size={14} className="text-[#8b5cf6]" /> : event.type === 'audio' ? <Mic size={14} className="text-[#8b5cf6]" /> : <ImageIcon size={14} className="text-[#8b5cf6]" />}
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{event.type}</span>
                        </div>

                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            {event.type === 'video' && <PlayCircle size={56} className="text-white/90 drop-shadow-2xl" />}
                            {event.type === 'audio' && <Mic size={56} className="text-white/90 drop-shadow-2xl" />}
                            
                             {viewMode === 'view' && (
                                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-[#8b5cf6] px-4 py-2 rounded-full font-black text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 uppercase tracking-widest border border-purple-50">
                                    <Sparkles size={14} /> AI Enhance
                                </button>
                             )}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <h3 className="font-black text-xl text-gray-900 mb-2 leading-tight">{event.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-medium">
                            {event.content}
                        </p>
                        
                        {(viewMode === 'edit' || viewMode === 'delete') && (
                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-center animate-pop">
                                {viewMode === 'edit' && (
                                    <button 
                                        className="w-full py-2.5 bg-blue-50 text-blue-600 font-black text-[11px] rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all hover:bg-blue-100"
                                    >
                                        <Edit2 size={16} /> 編輯此回憶
                                    </button>
                                )}
                                {viewMode === 'delete' && (
                                    <button 
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="w-full py-2.5 bg-red-50 text-red-600 font-black text-[11px] rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all hover:bg-red-100"
                                    >
                                        <Trash2 size={16} /> 刪除此回憶
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-pop { animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default MemorialScreen;
