
import React from 'react';

const Sphere: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
             {/* Pulsing Core Glow */}
             <div className="absolute w-[60%] h-[60%] bg-[#ccf381]/20 rounded-full blur-2xl animate-pulse"></div>
             
             {/* Main Glass Sphere Body */}
            <div className="w-full h-full rounded-full relative overflow-hidden bg-white/5 backdrop-blur-[1px] border border-white/30 shadow-[0_0_40px_rgba(204,243,129,0.2),inset_0_0_20px_rgba(255,255,255,0.3)]">
                
                {/* Rotating Iridescent Swirls - Faster & Brighter */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_8s_linear_infinite]"
                     style={{
                        background: 'conic-gradient(from 0deg, transparent 0%, rgba(6,182,212,0.4) 20%, rgba(139,92,246,0.4) 40%, rgba(204,243,129,0.2) 50%, rgba(139,92,246,0.4) 60%, rgba(6,182,212,0.4) 80%, transparent 100%)',
                        filter: 'blur(20px)',
                     }}
                ></div>
                
                 {/* Secondary Reverse Rotating Layer */}
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_12s_linear_infinite_reverse]"
                     style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(204,243,129,0.3), transparent 70%)',
                     }}
                ></div>

                {/* Scanning Laser Effect */}
                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ccf381] to-transparent opacity-50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] translate-y-[-100px]"></div>

                {/* Inner Shadow to give spherical volume without opacity */}
                <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_30px_rgba(255,255,255,0.4),inset_-5px_-5px_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>
            </div>

             {/* Dynamic Holographic Rings */}
             <div className="absolute inset-[-10%] rounded-full border border-dashed border-[#ccf381]/30 animate-[spin_20s_linear_infinite]"></div>
             <div className="absolute inset-[-18%] rounded-full border border-purple-400/20 animate-[spin_15s_linear_infinite_reverse] scale-y-75"></div>

             {/* Crisp Surface Reflections (Static) to mimic Glass surface */}
             <div className="absolute inset-0 rounded-full pointer-events-none">
                 {/* Top Left Specular Highlight */}
                 <div className="absolute top-[12%] left-[18%] w-[25%] h-[12%] bg-white/90 rounded-[100%] blur-[1px] transform -rotate-12"></div>
                 {/* Bottom Right Rim Light */}
                 <div className="absolute bottom-[10%] right-[15%] w-[35%] h-[5%] bg-white/40 rounded-[100%] blur-[3px] transform -rotate-12"></div>
             </div>
        </div>
    );
};

export default Sphere;
