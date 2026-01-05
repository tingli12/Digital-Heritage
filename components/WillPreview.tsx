
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WillPreviewProps {
  signature?: string | null;
  content: string;
  onContentChange: (text: string) => void;
}

const WillPreview: React.FC<WillPreviewProps> = ({ signature, content, onContentChange }) => {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col text-gray-800 font-serif border border-gray-200 shadow-inner rounded-lg overflow-hidden">
      {/* Header - Fixed */}
      <div className="text-center mb-4 pb-2 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 tracking-wide">數位遺產遺囑</h1>
        <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">最後遺囑</p>
      </div>

      {/* Editable Body - Scrollable */}
      <textarea
        className="flex-grow w-full resize-none border-none focus:ring-0 p-2 font-serif text-gray-700 leading-loose text-justify bg-transparent overflow-y-auto outline-none whitespace-pre-wrap"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="在此輸入您的遺囑內容..."
        spellCheck={false}
      />

      {/* Footer / Signature - Fixed at bottom */}
      <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-end">
            <div className="w-2/3">
                <div className="h-16 border-b border-gray-800 relative flex items-end">
                    {signature ? (
                        <img src={signature} alt="Signature" className="absolute bottom-0 left-0 max-h-24 max-w-full object-contain mix-blend-multiply origin-bottom-left" />
                    ) : (
                        <span className="text-gray-300 text-sm italic mb-2 ml-2">尚未簽署</span>
                    )}
                </div>
                <p className="font-bold mt-2 text-sm text-gray-900">立遺囑人簽名 (在此處簽名)</p>
            </div>
            <div className="w-1/3 flex flex-col items-end justify-end pb-1">
                 {/* Stamp or Seal placeholder could go here */}
            </div>
        </div>

        <div className="flex items-center justify-end mt-4 text-emerald-600 text-[10px] bg-emerald-50 py-1 px-2 rounded-full w-fit ml-auto">
            <ShieldCheck size={12} className="mr-1" />
            <p>文件已於區塊鏈上記錄時間戳</p>
        </div>
      </div>

    </div>
  );
};

export default WillPreview;
