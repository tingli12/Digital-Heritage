
import React, { useState, useCallback } from 'react';
import { Home, FileText, User, Scan, BookOpen } from 'lucide-react';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AssetsScreen from './screens/AssetsScreen';
import WillScreen from './screens/WillScreen';
import MemorialScreen from './screens/MemorialScreen';
import LawyerScreen from './screens/LawyerScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import ExecutorScreen from './screens/ExecutorScreen';


export type Screen = 'onboarding' | 'login' | 'home' | 'assets' | 'will' | 'memorial' | 'lawyer' | 'profile' | 'executor';

export type BookingInfo = {
  lawyerName: string;
  date: string;
  time: string;
} | null;

// Define shared types
export type FileItem = {
    name: string;
    date: string;
    size: string;
    isNew?: boolean;
}

const BottomNavItem: React.FC<{
  icon: React.ElementType;
  screen: Screen;
  isActive: boolean;
  onPress: (screen: Screen) => void;
}> = ({ icon: Icon, screen, isActive, onPress }) => (
  <button 
    onClick={() => onPress(screen)} 
    className={`flex flex-col items-center justify-center w-14 transition-all duration-300 tap-highlight ${isActive ? 'text-[#8b5cf6]' : 'text-gray-300 hover:text-gray-500'}`}
  >
    <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
  </button>
);

const initialCategoryFiles: Record<string, FileItem[]> = {
    "遺囑文件": [
        { name: "2023_最終遺囑_已簽署.pdf", date: "2023/10/15", size: "2.4 MB" },
        { name: "律師諮詢筆記.pdf", date: "2023/09/20", size: "1.1 MB" },
        { name: "資產清單草稿.xlsx", date: "2023/09/10", size: "45 KB" },
    ],
    "家庭影片": [
        { name: "媽媽60歲生日.mov", date: "2023/05/20", size: "1.2 GB" },
        { name: "日本旅行精華.mp4", date: "2023/04/01", size: "850 MB" },
        { name: "寶寶第一次走路.mp4", date: "2018/11/12", size: "120 MB" },
    ],
    "所有資產": [
        { name: "房產契約備份.zip", date: "2023/01/10", size: "150 MB" },
        { name: "2023股票投資組合.pdf", date: "2023/02/15", size: "5 MB" },
    ],
    "個人音檔": [
        { name: "給女兒的話.wav", date: "2023/11/01", size: "25 MB" },
        { name: "最愛歌單.csv", date: "2022/12/25", size: "12 KB" },
        { name: "語音日記_第55則.mp3", date: "2023/08/30", size: "8 MB" },
    ],
    "雲端文件": [
        { name: "Google硬碟存取金鑰.txt", date: "2023/10/25", size: "1 KB" },
        { name: "2023每月預算.xls", date: "2023/10/01", size: "2.5 MB" },
    ],
    "其他文件": [
        { name: "人壽保險單.pdf", date: "2023/06/15", size: "8 MB" },
        { name: "病史報告.pdf", date: "2023/08/10", size: "12 MB" },
    ]
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [booking, setBooking] = useState<BookingInfo>(null);
  
  // Lifted state for file management
  const [categoryFiles, setCategoryFiles] = useState<Record<string, FileItem[]>>(initialCategoryFiles);

  const addFileToCategory = useCallback((category: string, file: FileItem) => {
      setCategoryFiles(prev => ({
          ...prev,
          [category]: [file, ...(prev[category] || [])]
      }));
  }, []);

  const setScreen = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);
  
  const screensWithNav: Screen[] = ['home', 'assets', 'will', 'profile', 'memorial'];

  const renderScreen = () => {
    return (
      <div key={currentScreen} className="animate-screen h-full w-full">
        {(() => {
          switch (currentScreen) {
            case 'onboarding':
              return <OnboardingScreen onComplete={() => setScreen('login')} />;
            case 'login':
              return <LoginScreen onLogin={() => setScreen('home')} onBack={() => setScreen('onboarding')} />;
            case 'home':
              return <HomeScreen setScreen={setScreen} booking={booking} />;
            case 'assets':
              return <AssetsScreen setScreen={setScreen} categoryFiles={categoryFiles} />;
            case 'will':
              return <WillScreen setScreen={setScreen} addFileToCategory={addFileToCategory} categoryFiles={categoryFiles} />;
            case 'memorial':
              return <MemorialScreen setScreen={setScreen}/>;
            case 'lawyer':
              return <LawyerScreen setScreen={setScreen} onBookingComplete={setBooking} />;
            case 'profile':
              return <MyProfileScreen setScreen={setScreen}/>;
            case 'executor':
              return <ExecutorScreen setScreen={setScreen} />;
            default:
              return <OnboardingScreen onComplete={() => setScreen('login')} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-white flex flex-col font-sans overflow-hidden shadow-2xl md:rounded-[40px] border-none md:border md:border-gray-200">
      <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar relative">
        {renderScreen()}
      </div>
       {screensWithNav.includes(currentScreen) && (
        <div className="relative h-20 bg-white border-t border-gray-50 z-50 px-8 flex justify-between items-center">
            <BottomNavItem icon={Home} screen="home" isActive={currentScreen === 'home'} onPress={setScreen} />
            <BottomNavItem icon={FileText} screen="will" isActive={currentScreen === 'will'} onPress={setScreen} />
            
            {/* Center Scan Button */}
            <div className="relative -top-3">
              <button 
                  onClick={() => setScreen('assets')} 
                  className="w-14 h-14 bg-[#ccf381] text-black rounded-full flex items-center justify-center shadow-lg shadow-[#ccf381]/30 hover:scale-110 active:scale-95 transition-all border-[3px] border-white z-50 group"
              >
                  <Scan size={26} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <BottomNavItem icon={BookOpen} screen="memorial" isActive={currentScreen === 'memorial'} onPress={setScreen} />
            <BottomNavItem icon={User} screen="profile" isActive={currentScreen === 'profile'} onPress={setScreen} />
        </div>
       )}
    </div>
  );
}
