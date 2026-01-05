
import React, { useState } from 'react';
import { User, Settings, Bell, Shield, LogOut, ChevronRight, ArrowLeft, Save, Globe, Lock, Trash2, Smartphone } from 'lucide-react';
import { Screen } from '../App';

interface MyProfileScreenProps {
  setScreen: (screen: Screen) => void;
}

type SubView = 'main' | 'account' | 'notifications' | 'privacy';

const ProfileButton: React.FC<{ icon: React.ElementType, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm group">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-[#f3e8ff] transition-colors">
            <Icon size={20} className="text-gray-400 group-hover:text-[#8b5cf6]"/>
        </div>
        <span className="font-semibold flex-1 text-left text-gray-800">{label}</span>
        <ChevronRight size={20} className="text-gray-400" />
    </button>
);

const Toggle: React.FC<{ active: boolean, onToggle: () => void }> = ({ active, onToggle }) => (
    <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-[#ccf381]' : 'bg-gray-200'}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'left-7' : 'left-1'}`} />
    </button>
);

const MyProfileScreen: React.FC<MyProfileScreenProps> = ({ setScreen }) => {
  const [view, setView] = useState<SubView>('main');
  const [notifications, setNotifications] = useState({ push: true, heritage: true, marketing: false });
  const [biometrics, setBiometrics] = useState(true);

  const renderContent = () => {
    switch (view) {
      case 'account':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">使用者姓名</label>
                <input type="text" defaultValue="使用者姓名" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#8b5cf6]" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">電子郵件</label>
                <input type="email" defaultValue="user.email@example.com" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#8b5cf6]" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">手機號碼</label>
                <input type="tel" defaultValue="+886 912 345 678" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#8b5cf6]" />
              </div>
            </div>
            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                <Save size={18} /> 儲存變更
            </button>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Bell size={20} /></div>
                    <span className="font-semibold text-gray-800">推播通知</span>
                </div>
                <Toggle active={notifications.push} onToggle={() => setNotifications(prev => ({...prev, push: !prev.push}))} />
             </div>
             <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Shield size={20} /></div>
                    <span className="font-semibold text-gray-800">資產安全警告</span>
                </div>
                <Toggle active={notifications.heritage} onToggle={() => setNotifications(prev => ({...prev, heritage: !prev.heritage}))} />
             </div>
             <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Globe size={20} /></div>
                    <span className="font-semibold text-gray-800">法律新聞與更新</span>
                </div>
                <Toggle active={notifications.marketing} onToggle={() => setNotifications(prev => ({...prev, marketing: !prev.marketing}))} />
             </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center"><Smartphone size={20} /></div>
                    <span className="font-semibold text-gray-800">生物辨識解鎖</span>
                </div>
                <Toggle active={biometrics} onToggle={() => setBiometrics(!biometrics)} />
             </div>
             <button className="w-full flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-50 group-hover:text-[#8b5cf6] transition-colors"><Lock size={20} /></div>
                <span className="font-semibold flex-1 text-left text-gray-800">修改密碼</span>
                <ChevronRight size={20} className="text-gray-400" />
             </button>
             <button className="w-full flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-50 group-hover:text-[#8b5cf6] transition-colors"><Shield size={20} /></div>
                <span className="font-semibold flex-1 text-left text-gray-800">隱私權政策</span>
                <ChevronRight size={20} className="text-gray-400" />
             </button>
             <button className="w-full flex items-center p-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm group mt-4">
                <div className="w-10 h-10 bg-white text-red-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-500 group-hover:text-white transition-all"><Trash2 size={20} /></div>
                <span className="font-semibold flex-1 text-left text-red-600">刪除帳號</span>
                <ChevronRight size={20} className="text-red-400" />
             </button>
          </div>
        );
      default:
        return (
          <div className="space-y-3 animate-fade-in">
            <ProfileButton icon={Settings} label="帳號設定" onClick={() => setView('account')} />
            <ProfileButton icon={Bell} label="通知設定" onClick={() => setView('notifications')} />
            <ProfileButton icon={Shield} label="隱私與安全" onClick={() => setView('privacy')} />
            
            <button 
                onClick={() => setScreen('login')}
                className="w-full flex items-center justify-center p-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-100 transition mt-12 shadow-sm"
            >
                <LogOut size={20} className="mr-3"/>
                <span className="font-semibold">登出</span>
            </button>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'account': return '帳號設定';
      case 'notifications': return '通知設定';
      case 'privacy': return '隱私與安全';
      default: return '我的檔案';
    }
  };

  const handleBack = () => {
    if (view === 'main') {
      setScreen('home');
    } else {
      setView('main');
    }
  };

  return (
    <div className="p-6 h-full text-gray-900 bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none -z-0"></div>
      
      <header className="relative flex items-center justify-center mb-10 z-10 flex-shrink-0">
        <button onClick={handleBack} className="absolute left-0 p-2 -ml-2 text-gray-400 hover:text-gray-900 w-10 h-10 flex items-center justify-center">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-center text-gray-900">{getTitle()}</h1>
      </header>

      {view === 'main' && (
        <div className="flex flex-col items-center justify-center mb-12 z-10 animate-fade-in">
            <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#ccf381]/30 shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                        alt="User Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#ccf381] rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                </div>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">使用者姓名</h1>
            <p className="text-gray-400 text-sm font-medium">user.email@example.com</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 z-10">
        {renderContent()}
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MyProfileScreen;
