
import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, MessageCircle, ArrowLeft, Fingerprint, ShieldCheck, Lock, ChevronRight, Apple } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

const GoogleIcon: React.FC<{className?: string, size?: number, strokeWidth?: number}> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15.54 5.54C14.3946 4.65424 13.0031 4.13788 11.58 4.06C6.84 4.06 3 7.89 3 12.62C3 17.35 6.84 21.18 11.58 21.18C15.82 21.18 19.33 18.04 20 13.88H11.58"/>
    </svg>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loginOptions = [
    { text: 'Google 帳號', icon: GoogleIcon, color: 'text-gray-400' },
    { text: 'Apple 帳號', icon: Apple, color: 'text-gray-400' },
    { text: 'LINE 帳號', icon: MessageCircle, color: 'text-gray-400' },
  ];

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden font-sans p-6 text-gray-900 relative">
      {/* Background Security Grid Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <header className="relative z-10 flex justify-between items-center h-10 flex-shrink-0">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 -ml-2 transition-transform hover:-translate-x-1">
              <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">加密隧道已建立</span>
          </div>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center text-center -mt-8 relative z-10">
        {/* User Profile Image with Security Ring */}
        <div className="relative mb-8">
            <div className={`absolute -inset-4 border-2 border-dashed rounded-full transition-all duration-1000 ${isScanning ? 'border-[#8b5cf6] animate-spin-slow opacity-100' : 'border-[#ccf381]/30 opacity-40'}`}></div>
            <div className={`absolute -inset-1 border-2 rounded-full transition-all duration-700 ${isScanning ? 'border-[#8b5cf6] scale-110 opacity-60' : 'border-[#ccf381] scale-100 opacity-100'}`}></div>
            
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                alt="User Profile" 
                className={`w-full h-full object-cover transition-all duration-1000 ${isScanning ? 'grayscale blur-[2px]' : 'grayscale-0 blur-0'}`}
              />
              {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/20 to-transparent animate-scan-line"></div>
              )}
            </div>

            {/* Security Indicator Badge - Force high z-index to be in front of image */}
            <div className={`absolute -bottom-2 right-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-all duration-500 z-30 ${isScanning ? 'bg-gray-200' : 'bg-[#ccf381] animate-bounce-subtle'}`}>
                {isScanning ? <Lock size={16} className="text-gray-400" /> : <ShieldCheck size={20} className="text-black" />}
            </div>
        </div>

        <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">歡迎回來</h1>
            <p className="text-gray-400 text-sm font-medium">系統偵測到受信任裝置，請完成驗證</p>
        </div>
        
        <div className="w-full max-w-xs space-y-4">
          {/* Primary Action: Passkey / Biometrics - The Most Secure Method */}
          <button 
            onClick={onLogin} 
            className="w-full group relative flex items-center justify-between p-5 bg-gray-900 text-white rounded-[24px] hover:bg-black transition-all shadow-xl shadow-gray-200 overflow-hidden transform active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccf381]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#ccf381]/20 transition-all"></div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#ccf381] group-hover:scale-110 transition-transform">
                    <Fingerprint size={28} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                    <p className="font-black text-base leading-tight">使用生物辨識</p>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Passkey 安全登入</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-white/30 group-hover:text-[#ccf381] transition-colors" />
          </button>

          {/* Separator */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">其他驗證</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          {/* Social Logins - Styled as secondary but clean */}
          <div className="grid grid-cols-3 gap-3">
            {loginOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button 
                  key={index} 
                  onClick={onLogin} 
                  title={option.text}
                  className="aspect-square flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl hover:border-[#8b5cf6] hover:bg-[#f3e8ff]/30 transition-all group shadow-sm active:scale-90"
                >
                  <Icon className="text-gray-400 group-hover:text-[#8b5cf6] transition-colors" size={24} />
                  <span className="text-[8px] font-bold text-gray-400 mt-1.5 uppercase tracking-tighter group-hover:text-[#8b5cf6]">{option.text.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>

          <button 
            onClick={onLogin}
            className="w-full py-4 text-xs font-black text-gray-400 hover:text-[#8b5cf6] transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone size={14} /> 簡訊驗證或 Email 登入
          </button>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
            <Lock size={12} className="text-emerald-500" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">端對端加密會話</p>
        </div>
        <p className="text-[10px] text-gray-400">
            登入即代表您同意本服務的 <span className="underline cursor-pointer hover:text-gray-900 transition-colors">隱私權與安全條款</span>
        </p>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
