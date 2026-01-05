
import React, { useState, useRef } from 'react';
import { ArrowLeft, MoreVertical, FileText, Video, Folder, Music, FileArchive, FileQuestion, Plus, X, Bitcoin, Wallet, CircleDollarSign, Coins, Download, ChevronRight, Info, ShieldCheck, Upload, SortAsc, LayoutGrid, Settings2 } from 'lucide-react';
import { Screen, FileItem } from '../App';

type FileAsset = {
    name: string;
    type: string;
    size: string;
    icon: React.ElementType;
    color: string;
}

type CryptoAsset = {
    name: string;
    symbol: string;
    amount: string;
    value: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

const initialFiles: FileAsset[] = [
    { name: "遺囑文件", type: "文件", size: "10MB", icon: FileText, color: "text-[#f87171]" },
    { name: "家庭影片", type: "影片", size: "1.2GB", icon: Video, color: "text-[#60a5fa]" },
    { name: "所有資產", type: "壓縮檔", size: "500MB", icon: FileArchive, color: "text-[#eab308]" },
    { name: "個人音檔", type: "音樂", size: "50MB", icon: Music, color: "text-[#c084fc]" },
    { name: "雲端文件", type: "資料夾", size: "5MB", icon: Folder, color: "text-[#4ade80]" },
    { name: "其他文件", type: "其他", size: "2MB", icon: FileQuestion, color: "text-gray-400" },
];

const cryptoDetails: Record<string, FileItem[]> = {
    "比特幣": [
        { name: "錢包備份_2023.dat", date: "2023/11/10", size: "256 KB" },
        { name: "BTC交易紀錄.csv", date: "2023/11/09", size: "1.2 MB" },
    ],
    "以太幣": [
        { name: "金鑰庫文件.json", date: "2023/05/20", size: "4 KB" },
        { name: "手續費報告.pdf", date: "2023/10/01", size: "450 KB" },
    ]
};

const cryptoAssets: CryptoAsset[] = [
    { name: "比特幣", symbol: "BTC", amount: "0.45", value: "$28,500", icon: Bitcoin, color: "text-[#f7931a]", bgColor: "bg-[#fff7ed]" },
    { name: "以太幣", symbol: "ETH", amount: "4.20", value: "$7,800", icon: Coins, color: "text-[#627eea]", bgColor: "bg-[#eff6ff]" },
    { name: "泰達幣", symbol: "USDT", amount: "5,000", value: "$5,000", icon: CircleDollarSign, color: "text-[#26a17b]", bgColor: "bg-[#ecfdf5]" },
    { name: "冷錢包", symbol: "硬體", amount: "1", value: "不適用", icon: Wallet, color: "text-[#374151]", bgColor: "bg-[#f3f4f6]" },
];

const fileTypeOptions = {
    文件: { icon: FileText, color: "text-[#f87171]" },
    影片: { icon: Video, color: "text-[#60a5fa]" },
    壓縮檔: { icon: FileArchive, color: "text-[#eab308]" },
    音樂: { icon: Music, color: "text-[#c084fc]" },
    資料夾: { icon: Folder, color: "text-[#4ade80]" },
    其他: { icon: FileQuestion, color: "text-gray-400" },
};

interface AssetsScreenProps {
  setScreen: (screen: Screen) => void;
  categoryFiles: Record<string, FileItem[]>;
}

const FileTypeIcon: React.FC<FileAsset & { onClick: () => void, index: number }> = ({ name, type, size, icon: Icon, color, onClick, index }) => (
    <button 
        onClick={onClick} 
        style={{ animationDelay: `${index * 0.05}s` }}
        className="animate-screen bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-[#ccf381] hover:shadow-xl hover:-translate-y-1.5 transition-all group w-full aspect-[1/1.1] tap-highlight"
    >
        <div className={`w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-[#f7fee7] group-hover:rotate-6 transition-all`}>
            <Icon size={32} className={color} />
        </div>
        <p className="font-black text-gray-900 truncate w-full tracking-tight">{name}</p>
        <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest">{type} · {size}</p>
    </button>
);

const CryptoCard: React.FC<CryptoAsset & { onClick: () => void, index: number }> = ({ name, symbol, amount, value, icon: Icon, color, bgColor, onClick, index }) => (
    <button 
        onClick={onClick} 
        style={{ animationDelay: `${index * 0.05}s` }}
        className="animate-screen bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-[#ccf381] hover:shadow-xl hover:-translate-y-1.5 transition-all group w-full aspect-[1/1.1] tap-highlight"
    >
        <div className={`w-16 h-16 rounded-3xl ${bgColor} flex items-center justify-center mb-4 border border-gray-100 group-hover:scale-110 transition-transform`}>
            <Icon size={32} className={color} />
        </div>
        <p className="font-black text-gray-900 truncate w-full tracking-tight">{name}</p>
        <div className="mt-1">
             <p className="text-sm font-black text-gray-800">{amount} <span className="text-[10px] text-gray-400 font-bold">{symbol}</span></p>
             <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest">約 {value}</p>
        </div>
    </button>
);

const AssetsScreen: React.FC<AssetsScreenProps> = ({ setScreen, categoryFiles }) => {
    const [files, setFiles] = useState<FileAsset[]>(initialFiles);
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'files' | 'crypto'>('files');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    if (selectedCategory) {
        const currentFiles = categoryFiles[selectedCategory] || cryptoDetails[selectedCategory] || [];
        return (
            <div className="h-full flex flex-col bg-gray-50 text-gray-900 animate-screen">
                <header className="bg-white p-6 pb-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
                    <button onClick={() => setSelectedCategory(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-all tap-highlight">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">{selectedCategory}</h1>
                        <p className="text-xs font-bold text-gray-400">{currentFiles.length} 個檔案儲存中</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 no-scrollbar">
                    {currentFiles.length > 0 ? (
                        currentFiles.map((file, i) => (
                            <div 
                                key={i} 
                                style={{ animationDelay: `${i * 0.05}s` }}
                                className={`animate-staggered bg-white p-5 rounded-3xl border flex items-center justify-between shadow-sm hover:shadow-md transition-all ${file.isNew ? 'border-[#ccf381] ring-1 ring-[#ccf381]' : 'border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-12 h-12 bg-[#f7fee7] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#65a30d] border border-[#ccf381]/30">
                                        <FileText size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-800 text-sm truncate">{file.name}</p>
                                            {file.isNew && (
                                                <span className="bg-[#ccf381] text-[#0f0f11] text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">新</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest">{file.date} · {file.size}</p>
                                    </div>
                                </div>
                                <button className="p-3 text-gray-400 hover:text-[#8b5cf6] hover:bg-purple-50 rounded-2xl transition-all tap-highlight">
                                    <Download size={22}/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-24 text-gray-400 opacity-30">
                            <FileQuestion size={64} className="mb-4" />
                            <p className="font-black tracking-widest uppercase text-sm">尚無文件存檔</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

  return (
    <div className="h-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
        {/* 頁首：恢復彩色漸層與裝飾光暈 */}
        <header className="relative pt-12 pb-10 px-6 z-40 bg-gradient-to-br from-[#ccf381] to-[#8b5cf6] text-black border-b border-black/5">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
            
            {/* 裝飾球 */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl animate-[float_8s_infinite_alternate]"></div>
            <div className="absolute top-10 left-[-20px] w-32 h-32 bg-[#ccf381]/20 rounded-full blur-2xl animate-[float_10s_infinite_alternate_reverse]"></div>

            <div className="relative z-50 flex justify-between items-center">
                <button onClick={() => setScreen('home')} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all tap-highlight">
                    <ArrowLeft size={26} strokeWidth={2.5} />
                </button>
                <h1 className="text-xl font-black text-gray-900 tracking-tighter">資產保險庫</h1>
                <div className="relative">
                    <button 
                        onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                        className={`p-2 -mr-2 rounded-full transition-all tap-highlight ${isHeaderMenuOpen ? 'bg-white/40 shadow-inner' : 'hover:bg-white/20'}`}
                    >
                        <MoreVertical size={26} strokeWidth={2.5} />
                    </button>
                    {isHeaderMenuOpen && (
                        <>
                            {/* 全域點擊關閉遮罩：確保 z-index 高於下方內容但低於選單 */}
                            <div className="fixed inset-0 z-[100]" onClick={() => setIsHeaderMenuOpen(false)}></div>
                            
                            {/* 選單本體：z-index 設為最高並確保不被裁切 */}
                            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[110] py-2 animate-screen overflow-hidden text-gray-700">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-[#f7fee7] hover:text-[#8b5cf6] transition-all text-left">
                                    <SortAsc size={18} /> 檔案排序
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-[#f7fee7] hover:text-[#8b5cf6] transition-all text-left">
                                    <LayoutGrid size={18} /> 檢視模式
                                </button>
                                <div className="h-[1px] bg-gray-100 my-1"></div>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-[#f7fee7] hover:text-[#8b5cf6] transition-all text-left">
                                    <Settings2 size={18} /> 保險庫設定
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
        
        <div className="flex-grow px-6 pt-8 pb-24 overflow-y-auto no-scrollbar relative z-10">
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1 block">您的收藏</span>
                        <h2 className="font-black text-3xl text-gray-900 tracking-tight">數位資產</h2>
                    </div>
                    
                    <button 
                        className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-gray-200 hover:scale-110 active:scale-95 transition-all"
                    >
                        <Plus size={24} strokeWidth={3} className="text-[#ccf381]" />
                    </button>
                </div>

                <div className="flex p-1.5 bg-gray-100 rounded-[24px] border border-gray-200">
                    <button 
                        onClick={() => setActiveTab('files')}
                        className={`flex-1 py-3 px-4 text-xs rounded-[18px] font-black transition-all ${activeTab === 'files' ? 'bg-[#ccf381] text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        文件目錄
                    </button>
                    <button 
                        onClick={() => setActiveTab('crypto')}
                        className={`flex-1 py-3 px-4 text-xs rounded-[18px] font-black transition-all ${activeTab === 'crypto' ? 'bg-[#ccf381] text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        虛擬資產
                    </button>
                </div>
            </div>

            <div key={activeTab} className="grid grid-cols-2 gap-5 pb-10">
                {activeTab === 'files' ? (
                    files.map((file, index) => (
                        <FileTypeIcon 
                            key={`${file.name}-${index}`} 
                            {...file} 
                            index={index}
                            onClick={() => setSelectedCategory(file.name)}
                        />
                    ))
                ) : (
                    cryptoAssets.map((asset, index) => (
                        <CryptoCard 
                            key={`${asset.name}-${index}`} 
                            {...asset} 
                            index={index}
                            onClick={() => setSelectedCategory(asset.name)}
                        />
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default AssetsScreen;
