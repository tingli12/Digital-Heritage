import React from 'react';

interface GaugeSegment {
  value: number; // 0 to 100
  color: string;
  width: number;
  radius: number;
}

interface GaugeProps {
  value?: number; // legacy single value support
  label: string;
  subLabel?: string; // Made optional, effectively removed from render if not used
  color?: string; // legacy single color support
  detailedSegments?: GaugeSegment[];
  legend?: { label: string; color: string }[];
}

const Gauge: React.FC<GaugeProps> = ({ value = 0, label, detailedSegments, legend }) => {
  // Center of the SVG
  const cx = 60;
  const cy = 60; // Center point
  
  // Default to single segment if detailedSegments is not provided
  let segments = detailedSegments || [
    { value: value, color: '#ccf381', width: 12, radius: 45 }
  ];

  // Sort segments by value descending so larger arcs are drawn behind smaller ones (for stacking)
  segments = [...segments].sort((a, b) => b.value - a.value);

  const renderSegment = (seg: GaugeSegment, index: number) => {
    const radius = seg.radius;
    const circumference = Math.PI * radius; // Semi-circle circumference
    const progress = Math.min(Math.max(seg.value, 0), 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Define the semi-circle path (starting from left, going to right)
    const d = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

    return (
      <React.Fragment key={index}>
         {/* Background Track - Draw for each to ensure proper width backing if widths differ */}
         <path
            d={d}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={seg.width}
            strokeLinecap="round"
         />
         {/* Progress Arc */}
         <path
            d={d}
            fill="none"
            stroke={seg.color}
            strokeWidth={seg.width}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{ transitionDelay: `${index * 100}ms` }}
         />
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col items-center justify-between bg-white rounded-[24px] p-4 h-full relative overflow-hidden text-black shadow-sm border border-white/50">
      <div className="relative w-full flex-1 flex flex-col justify-between items-center">
         {/* SVG Area */}
         <div className="relative w-full aspect-[2/1.3] flex items-end justify-center mt-2">
             <svg viewBox="0 10 120 60" className="overflow-visible w-full h-full">
                 {segments.map(renderSegment)}
             </svg>
             
             {/* Gradient Blob Decoration */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-4 w-12 h-12 bg-purple-300 rounded-full blur-xl opacity-30"></div>
             </div>
         </div>
         
         {/* Main Number Label - Moved to bottom position where legend dots usually are */}
         <div className="text-center mt-2 mb-1 z-10 relative">
              <span className="text-5xl font-black block leading-none text-gray-900 tracking-tighter">{label}</span>
         </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-4 w-12 h-12 bg-purple-100 rounded-full blur-xl -z-0 opacity-40 pointer-events-none"></div>
    </div>
  );
};

export default Gauge;