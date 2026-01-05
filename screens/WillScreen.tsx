
import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Check, Download, Shield, Bot, ArrowLeft, Plus, FileText, ChevronRight, Lock, AlertTriangle, Database, X } from 'lucide-react';
import { Screen, FileItem } from '../App';
import WillPreview from '../components/WillPreview';

interface WillScreenProps {
  setScreen: (screen: Screen) => void;
  addFileToCategory: (category: string, file: FileItem) => void;
  categoryFiles: Record<string, FileItem[]>;
}

const defaultWillTemplate = `本人，[請輸入您的姓名] (以下稱「立遺囑人」)，茲在此鄭重聲明，此為本人之最終遺囑，並以此撤銷先前所有遺囑及遺囑附錄。

第一條：遺囑執行人
本人指定 [請輸入遺囑執行人姓名] 為本遺囑之執行人。

第二條：數位資產處理
關於本人名下所有數位資產，本人指示如下：
1. 社群帳號 (Facebook, Instagram, LINE)： [請輸入處理方式]
2. 雲端檔案 (Google Drive, iCloud)： [請輸入處理方式]

第三條：法律效力
本遺囑依據中華民國法律作成。`;

type WillDocument = {
  id: string;
  name: string;
  date: string;
  content: string;
};

const SignaturePad: React.FC<{
    placeholder: string;
    onSignatureChange: (exists: boolean) => void;
    ref: React.Ref<HTMLCanvasElement>;
}> = React.forwardRef(({ placeholder, onSignatureChange }, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const canvasRef = ref as React.RefObject<HTMLCanvasElement>;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasDimensions = () => {
            const rect = canvas.parentElement!.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };
        
        setCanvasDimensions();
    }, [canvasRef]);

    const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e.nativeEvent) {
             return { x: e.nativeEvent.touches[0].clientX - rect.left, y: e.nativeEvent.touches[0].clientY - rect.top };
        }
        return { x: e.nativeEvent.clientX - rect.left, y: e.nativeEvent.clientY - rect.top };
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getEventPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
        if (!hasSignature) {
            setHasSignature(true);
            onSignatureChange(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getEventPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        canvasRef.current?.getContext('2d')?.closePath();
        setIsDrawing(false);
    };

    return (
        <div className="relative border border-gray-200 bg-white rounded-2xl h-32 overflow-hidden shadow-sm">
            <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none"
            />
             {!hasSignature && <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs font-bold uppercase tracking-widest">Sign here</p>}
        </div>
    );
});

const WillListModal: React.FC<{ isOpen: boolean, onClose: () => void, onSelect: (will: WillDocument) => void, currentId: string, wills: WillDocument[] }> = ({ isOpen, onClose, onSelect, currentId, wills }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24}/></button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-[#8b5cf6]">
                        <Database size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">儲存庫文件選擇</h2>
                        <p className="text-xs text-gray-400">從 App 內存檔案選擇遺囑</p>
                    </div>
                </div>
                
                <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar mb-6">
                    {wills.length > 0 ? wills.map((will) => (
                        <button
                            key={will.id}
                            onClick={() => {
                                onSelect(will);
                                onClose();
                            }}
                            className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${currentId === will.id ? 'border-[#8b5cf6] bg-purple-50' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'}`}
                        >
                            <div className="text-left">
                                <p className={`font-bold text-sm ${currentId === will.id ? 'text-[#8b5cf6]' : 'text-gray-800'}`}>{will.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{will.date}</p>
                            </div>
                            {currentId === will.id && <Check size={16} className="text-[#8b5cf6]" />}
                        </button>
                    )) : (
                        <div className="py-10 text-center text-gray-400">
                            <FileText className="mx-auto mb-2 opacity-20" size={40} />
                            <p className="text-sm">目前無任何遺囑存檔</p>
                        </div>
                    )}
                </div>
                
                <button onClick={onClose} className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl text-sm">取消</button>
            </div>
        </div>
    );
};

const LegalReminderModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm text-center shadow-2xl">
            <div className="flex justify-center mb-4">
                <AlertTriangle className="text-[#ccf381]" size={40} fill="#f7fee7" stroke="#65a30d" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-900">法規提醒</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                此數位簽署流程旨在符合《民法》自書遺囑之要件，請確認為本人親簽。
            </p>
            <button
                onClick={onClose}
                className="w-full bg-[#ccf381] text-black font-bold py-3 px-4 rounded-xl text-lg hover:bg-[#bcea65] transition shadow-md shadow-[#ccf381]/20"
            >
                我了解
            </button>
        </div>
    </div>
);

const SuccessModal: React.FC<{ onClose: () => void, title: string, message: string }> = ({ onClose, title, message }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white border border-gray-200 rounded-[32px] p-8 max-w-xs w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-[#ccf381] rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Check size={32} strokeWidth={3} className="text-black" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                {message}
            </p>
            <button
                onClick={onClose}
                className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-800 transition"
            >
                關閉
            </button>
        </div>
    </div>
);

const PasswordModal: React.FC<{ onClose: () => void, onSuccess: () => void }> = ({ onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length >= 4) {
            onSuccess();
        } else {
            setError('密碼長度不足');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex justify-center mb-4">
                    <Lock size={32} className="text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-center mb-4">安全驗證</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest outline-none focus:border-[#8b5cf6]"
                        placeholder="••••"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">確認</button>
                    <button type="button" onClick={onClose} className="w-full text-gray-400 text-sm">取消</button>
                </form>
            </div>
        </div>
    );
};

const WillScreen: React.FC<WillScreenProps> = ({ setScreen, addFileToCategory, categoryFiles }) => {
    const heirCanvasRef = useRef<HTMLCanvasElement>(null);
    const [heirSignatureExists, setHeirSignatureExists] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isWillListOpen, setIsWillListOpen] = useState(false);
    const [successModalConfig, setSuccessModalConfig] = useState<{title: string, message: string} | null>(null);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [signatureKey, setSignatureKey] = useState(0);
    const [selectedWillId, setSelectedWillId] = useState<string>('default');
    const [willContent, setWillContent] = useState(defaultWillTemplate);

    // Transform App's "遺囑文件" into selectable documents
    const repositoryWills: WillDocument[] = (categoryFiles['遺囑文件'] || []).map((file, idx) => ({
        id: `repo-${idx}`,
        name: file.name,
        date: file.date,
        content: idx === 0 ? defaultWillTemplate : `[${file.name}] 的文件內容預覽...`
    }));

    const handleSelectWill = (will: WillDocument) => {
      setSelectedWillId(will.id);
      setWillContent(will.content);
      clearCanvas();
    };

    const handleAddNewWill = () => {
      clearCanvas();
      setWillContent(defaultWillTemplate);
      setSelectedWillId('new');
    };

    const clearCanvas = () => {
        setHeirSignatureExists(false);
        setSignatureImage(null);
        setSignatureKey(prev => prev + 1);
    };

    const handleConfirm = () => {
        const canvas = heirCanvasRef.current;
        if (canvas && heirSignatureExists) {
            const dataUrl = canvas.toDataURL();
            setSignatureImage(dataUrl);
        }
    };

    const handleBlockchainSaveClick = () => {
        setShowPasswordModal(true);
    };

    const handlePasswordSuccess = () => {
        setShowPasswordModal(false);
        const newFile: FileItem = {
            name: `Signed_Will_${new Date().toISOString().slice(0,10)}.pdf`,
            date: new Date().toLocaleDateString(),
            size: "1.8 MB",
            isNew: true
        };
        addFileToCategory("遺囑文件", newFile);
        setSuccessModalConfig({
            title: "完成存證",
            message: "您的遺囑已成功加密，並上傳至區塊鏈確保不可篡改。"
        });
    };

    const handleDownloadPDF = () => {
        const newFile: FileItem = {
            name: `Will_Draft_${new Date().toISOString().slice(0,10)}.pdf`,
            date: new Date().toLocaleDateString(),
            size: "1.8 MB",
            isNew: true
        };
        addFileToCategory("遺囑文件", newFile);
        setSuccessModalConfig({
            title: "下載成功",
            message: "遺囑 PDF 已成功下載至您的裝置，並自動歸檔。"
        });
    };

    const selectedWill = repositoryWills.find(w => w.id === selectedWillId);

  return (
    <div className="flex flex-col h-full text-gray-900 bg-gray-50 overflow-hidden relative">
      {showModal && <LegalReminderModal onClose={() => setShowModal(false)} />}
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} onSuccess={handlePasswordSuccess} />}
      {successModalConfig && <SuccessModal onClose={() => setSuccessModalConfig(null)} title={successModalConfig.title} message={successModalConfig.message} />}
      <WillListModal 
        isOpen={isWillListOpen} 
        onClose={() => setIsWillListOpen(false)} 
        onSelect={handleSelectWill} 
        currentId={selectedWillId}
        wills={repositoryWills}
      />
      
      <header className="p-6 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-100">
        <button onClick={() => setScreen('home')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold text-gray-900">您的遺囑</h1>
        <button onClick={() => setScreen('lawyer')} className="p-2 -mr-2 text-[#8b5cf6]"><Bot size={24} /></button>
      </header>

      <div className="bg-white p-4 border-b border-gray-100 flex-shrink-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">撰寫文件選擇</p>
        <div className="grid grid-cols-2 gap-4 px-2">
          <button 
            onClick={handleAddNewWill}
            className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${selectedWillId === 'new' ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]/20' : 'border-[#ccf381] bg-[#f7fee7]/30 hover:bg-[#ccf381]/10'}`}
          >
            <div className="w-10 h-10 bg-[#ccf381] rounded-full flex items-center justify-center text-black shadow-sm mb-1.5">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black text-gray-700">新增上傳文件</span>
          </button>

          <button 
            onClick={() => setIsWillListOpen(true)}
            className={`h-24 p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${selectedWillId !== 'new' && selectedWillId !== 'default' ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-2">
              <Database size={16} className={selectedWillId !== 'new' && selectedWillId !== 'default' ? 'text-[#8b5cf6]' : 'text-gray-400'} />
              <span className={`text-[11px] font-black truncate ${selectedWillId !== 'new' && selectedWillId !== 'default' ? 'text-[#8b5cf6]' : 'text-gray-700'}`}>儲存庫文件選擇</span>
            </div>
            <div className="bg-gray-100/50 p-1.5 rounded-lg border border-gray-100 flex items-center justify-between">
                <div className="overflow-hidden">
                    <p className="text-[9px] font-bold text-gray-500 truncate">{selectedWill ? selectedWill.name : '選擇現存文件'}</p>
                    <p className="text-[8px] text-gray-400 font-medium">{selectedWill ? 'Last: ' + selectedWill.date : 'App 內存檔案'}</p>
                </div>
                <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-10">
        <div className="bg-white rounded-xl aspect-[3/4.2] mb-6 shadow-lg flex-shrink-0 overflow-hidden border border-gray-100">
          <WillPreview 
              signature={signatureImage} 
              content={willContent}
              onContentChange={setWillContent}
          />
        </div>
        
        <div className="mb-6 px-1">
          <label className="font-black text-gray-400 text-[10px] mb-3 block uppercase tracking-[0.2em]">電子簽署 (Signature)</label>
          <SignaturePad 
              key={signatureKey}
              ref={heirCanvasRef} 
              placeholder="Sign here" 
              onSignatureChange={setHeirSignatureExists} 
          />
        </div>
        
        <div className="flex gap-4 mb-8">
          <button onClick={clearCanvas} className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold text-sm">
            清除
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-4 bg-[#ccf381] text-black font-bold rounded-2xl hover:bg-[#bcea65] transition-all disabled:opacity-50"
            disabled={!heirSignatureExists}
          >
            確認簽署
          </button>
        </div>

        <div className="space-y-3 mb-10">
          <button 
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-gray-300 transition-all shadow-sm group"
          >
              <span className="flex items-center"><Download size={20} className="mr-3 text-gray-400 group-hover:text-[#8b5cf6]" /> 下載遺囑 PDF</span>
              <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button 
              onClick={handleBlockchainSaveClick}
              className="w-full flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
          >
               <span className="flex items-center"><Shield size={20} className="mr-3 text-[#ccf381]" /> 區塊鏈加密存證</span>
               <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                  <ChevronRight size={14} className="text-white" />
               </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WillScreen;
