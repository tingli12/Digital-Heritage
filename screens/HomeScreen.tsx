
import React, { useState } from 'react';
import { 
  Activity, 
  Footprints, 
  Moon, 
  MoreVertical, 
  Calendar, 
  Bot, 
  ScanLine, 
  BookUser, 
  FileSignature,
  ChevronRight
} from 'lucide-react';
import { Screen, BookingInfo } from '../App';
import Sphere from '../components/Sphere';
import Gauge from '../components/Gauge';

interface HomeScreenProps {
  setScreen: (screen: Screen) => void;
  booking: BookingInfo;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, booking }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const protectionScore = 83;
  const assetCount = 125;
  const steps = "4,580";
  const completeness = 66;

  // 確保順序為一到日
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const menuItems = [
    { id: 'assets', label: '資產掃描', icon: ScanLine },
    { id: 'lawyer', label: 'AI 詢問', icon: Bot },
    { id: 'memorial', label: '紀念館', icon: BookUser },
    { id: 'will', label: '遺囑撰寫', icon: FileSignature },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-purple-100/30 to-transparent blur-3xl pointer-events-none"></div>

      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10 animate-staggered" style={{ animationDelay: '0s' }}>
        <div className="flex flex-col">
           <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
             早安 · 使用者
           </h1>
           <p className="text-sm font-medium text-gray-400 mt-0.5">您的數位遺產防護正常</p>
        </div>
        <button 
          onClick={() => setScreen('lawyer')}
          className="w-11 h-11 bg-[#ececf1] rounded-2xl flex items-center justify-center text-gray-600 shadow-sm hover:shadow-md transition-all tap-highlight"
        >
          <Bot size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar z-10">
          
          <div className="relative flex flex-col items-center justify-center py-6 mb-4 animate-staggered" style={{ animationDelay: '0.1s' }}>
              <div className="relative w-64 h-64 flex items-center justify-center group cursor-pointer">
                  <Sphere className="w-full h-full z-10 transition-transform group-hover:scale-105" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                      <span className="text-7xl font-bold text-gray-900 tracking-tighter drop-shadow-[0_4px_12px_rgba(255,255,255,0.8)]">{protectionScore}</span>
                      <span className="text-[10px] font-bold text-gray-500 tracking-[0.25em] mt-1 uppercase">安全防護等級</span>
                  </div>
                  
                  <div className="absolute w-[120%] h-[120%] border border-white/40 rounded-full animate-[pulse_4s_ease-in-out_infinite] pointer-events-none"></div>
              </div>
          </div>

          <div className="space-y-4">
            {booking && (
              <div 
                className="p-5 bg-white rounded-[28px] border border-purple-50 shadow-sm flex items-center gap-4 animate-staggered hover:border-purple-200 transition-all tap-highlight group"
                style={{ animationDelay: '0.2s' }}
              >
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b5cf6] flex-shrink-0 group-hover:rotate-6 transition-transform">
                      <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                      <p className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-widest bg-purple-100/50 w-fit px-2 py-0.5 rounded-md mb-1">諮詢預約</p>
                      <p className="text-sm font-bold text-gray-800 leading-tight">
                        {booking.lawyerName} · {booking.date} {booking.time}
                      </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
            )}

            <div className="animate-staggered" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                   <h2 className="text-lg font-bold text-gray-900">健康監測</h2>
                   <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-full transition-all tap-highlight ${isMenuOpen ? 'bg-purple-50 text-[#8b5cf6]' : 'text-gray-400 hover:bg-gray-100'}`}
                   >
                        <MoreVertical size={20}/>
                   </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#8b5cf6] group-hover:scale-110 transition-transform">
                              <Activity size={20} />
                          </div>
                          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">總資產數</p>
                      <p className="text-2xl font-bold text-gray-900 tracking-tight">{assetCount} <span className="text-xs font-medium text-gray-300">項目</span></p>
                  </div>

                  <div className="row-span-2 group">
                      <div className="h-full bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden relative flex flex-col p-5 transition-all hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/20 to-[#ccf381]/5 pointer-events-none"></div>
                        
                        <div className="flex-1 flex flex-col items-center justify-start pt-2">
                            <div className="w-full aspect-square relative">
                                <Gauge 
                                    label="" 
                                    detailedSegments={[
                                        { value: completeness, color: '#8b5cf6', width: 6, radius: 45 },
                                        { value: 95, color: '#f3f4f6', width: 6, radius: 45 }
                                    ]}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pt-8">
                                    <Bot size={24} className="text-[#8b5cf6] animate-[float_3s_ease-in-out_infinite]" />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">資料完備性</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-5xl font-bold text-gray-900 tracking-tighter">{completeness}<span className="text-lg text-gray-300 ml-1">%</span></p>
                            <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-[#ccf381] rounded-full transition-all duration-1000" style={{ width: `${completeness}%` }}></div>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
                      <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600 mb-4 group-hover:scale-110 transition-transform">
                           <Footprints size={20} />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">數位足跡</p>
                      <p className="text-xl font-bold text-gray-900 tracking-tight">{steps}</p>
                  </div>

                   <div className="bg-gray-900 text-white p-5 rounded-[28px] shadow-lg border border-gray-800 relative overflow-hidden transition-all hover:scale-[1.02] tap-highlight">
                        <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-[#ccf381] mb-2">
                             <Moon size={16} />
                        </div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">上次掃描</p>
                        <p className="text-lg font-bold text-white tracking-tight">22:56</p>
                        <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 border-[6px] border-[#ccf381]/20 rounded-full"></div>
                        <div className="absolute right-[-30px] bottom-[-30px] w-36 h-36 border border-white/10 rounded-full"></div>
                        <div className="absolute right-[10px] top-[10px] w-12 h-12 bg-[#ccf381]/5 rounded-full blur-xl"></div>
                   </div>

                   <div className="bg-white p-5 rounded-[28px] border border-gray-100 flex flex-col justify-center transition-all hover:shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <Activity size={12} /> 活動分佈
                        </div>
                        <div className="flex items-end justify-between h-10 gap-1.5 px-1">
                            {[20, 45, 85, 55, 40, 65, 30].map((h, i) => (
                                 <div 
                                    key={i} 
                                    className="flex flex-col items-center gap-1.5 h-full justify-end"
                                 >
                                     <div 
                                        className={`w-1.5 rounded-full transition-all duration-700 ${i === 2 ? 'bg-[#8b5cf6]' : 'bg-gray-100'}`} 
                                        style={{ height: `${h}%` }}
                                     ></div>
                                     <span className="text-[8px] font-bold text-gray-400">{weekDays[i]}</span>
                                 </div>
                            ))}
                        </div>
                   </div>
              </div>
            </div>
          </div>
      </div>
      
      {isMenuOpen && (
        <>
            <div className="fixed inset-0 z-[60] bg-black/5" onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute right-6 top-24 w-52 bg-white border border-gray-100 rounded-[28px] shadow-2xl z-[70] py-2 animate-screen overflow-hidden">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setScreen(item.id as Screen);
                            setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-[#f7fee7] hover:text-[#8b5cf6] transition-all text-left group"
                    >
                        <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                        {item.label}
                    </button>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
