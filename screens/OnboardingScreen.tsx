
import React, { useState } from 'react';
import { ScanLine, FileSignature, BookUser, ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps = [
    {
      icon: ScanLine,
      title: '全域掃描',
      description: '自動化盤點您的所有數位足跡，從社群帳號到雲端文件，一覽無遺。',
    },
    {
      icon: FileSignature,
      title: 'AI 智慧遺囑',
      description: '在 AI 助理的引導下，生成具備法律效力的數位遺囑，確保意願被執行。',
    },
    {
      icon: BookUser,
      title: '數位紀念館',
      description: '為摯愛親友創建一個永恆的線上空間，保存珍貴回憶。',
    },
];


const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = onboardingSteps[step];
  const Icon = currentStep.icon;

  return (
    <div className="h-full w-full bg-white flex flex-col justify-between overflow-hidden relative p-6">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[20%] w-64 h-64 bg-[#ccf381] rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#8b5cf6] rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="relative z-10 pt-12 flex justify-end">
         <button onClick={onComplete} className="text-gray-400 hover:text-gray-600 text-sm font-medium px-2 py-1">跳過</button>
      </div>

      {/* Main Illustration Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div key={step} className="w-64 h-64 relative flex items-center justify-center animate-fade-in-scale">
             <div className="absolute inset-0 border border-gray-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute inset-4 border border-gray-100 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-gray-100">
                 <Icon size={48} className="text-[#8b5cf6]" />
            </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mb-8">
          {/* Text content */}
          <div key={`text-${step}`} className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentStep.title}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                  {currentStep.description}
              </p>
          </div>

          <div className="flex items-center justify-between">
               {/* Pagination */}
              <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                      <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                              step === index ? 'bg-[#8b5cf6] w-8' : 'bg-gray-200 w-1.5'
                          }`}
                      />
                  ))}
              </div>

              {/* Action Button */}
              <button
                  onClick={handleNext}
                  className="flex items-center justify-center w-16 h-16 bg-[#ccf381] rounded-full text-black shadow-xl shadow-[#ccf381]/30 hover:bg-[#bcea65] transition-colors"
              >
                  <ArrowRight size={28} />
              </button>
          </div>
      </div>
       <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
             @keyframes fade-in-scale {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            .animate-fade-in-scale { animation: fade-in-scale 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default OnboardingScreen;
