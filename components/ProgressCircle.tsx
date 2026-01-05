import React from 'react';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const strokeColor = '#ccf381'; // Neon Lime
    const trackStrokeColor = '#27272a'; // Zinc-800

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
            >
                <circle
                    stroke={trackStrokeColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={strokeColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-sm font-bold">{`${Math.round(progress)}%`}</span>
            </div>
        </div>
    );
};

export default ProgressCircle;