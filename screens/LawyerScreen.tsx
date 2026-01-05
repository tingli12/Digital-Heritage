
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Calendar, PlayCircle, ArrowLeft, Search, X, Check, Clock, ChevronRight } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Screen, BookingInfo } from '../App';
import Sphere from '../components/Sphere';

interface LawyerScreenProps {
  setScreen: (screen: Screen) => void;
  onBookingComplete: (booking: BookingInfo) => void;
}

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

type Lawyer = {
    id: number;
    name: string;
    specialty: string;
    avatar: string;
}

const mockLawyers: Lawyer[] = [
    { id: 1, name: '陳國華 律師', specialty: '數位遺產', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
    { id: 2, name: '林雅婷 律師', specialty: '繼承法規', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
    { id: 3, name: '王大明 律師', specialty: '虛擬資產', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop' },
];

const timeSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: false }, // Booked
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false }, // Booked
    { time: '16:00', available: true },
    { time: '17:00', available: true },
];

const legalVideos = [
    { title: '數位遺產是什麼？律師帶你3分鐘搞懂', views: '5.2萬次觀看', age: '2週前' },
    { title: '如何立一份有效的數位遺囑？', views: '1.8萬次觀看', age: '1個月前' },
    { title: '社交帳號繼承權大解析', views: '8.9千次觀看', age: '3個月前' }
];

const VideoCard: React.FC<{ title: string, views: string, age: string }> = ({ title, views, age }) => (
    <a href="https://www.youtube.com/watch?v=TCDDh7tGYp0" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors shadow-sm cursor-pointer group">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#f3e8ff] transition-colors">
            <PlayCircle size={32} className="text-gray-400 group-hover:text-[#8b5cf6] transition-colors" />
        </div>
        <div>
            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-[#8b5cf6] transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">{views}・{age}</p>
        </div>
    </a>
);

const BookingModal: React.FC<{ isOpen: boolean, onClose: () => void, onComplete: (booking: BookingInfo) => void }> = ({ isOpen, onClose, onComplete }) => {
    const [selectedLawyer, setSelectedLawyer] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState<'select' | 'success'>('select');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedTime) {
            const lawyer = mockLawyers.find(l => l.id === selectedLawyer);
            onComplete({
                lawyerName: lawyer?.name || '未知律師',
                date: selectedDate,
                time: selectedTime
            });
            setStep('success');
        }
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center">
                    <div className="w-20 h-20 bg-[#ccf381] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#ccf381]/30">
                        <Check size={40} className="text-black" strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">預約成功！</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        您已成功預約 {mockLawyers.find(l => l.id === selectedLawyer)?.name}。<br/>
                        時間：{selectedDate} {selectedTime}
                    </p>
                    <button
                        onClick={() => {
                            onClose();
                            setStep('select');
                            setSelectedTime(null);
                        }}
                        className="w-full bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl text-lg hover:bg-gray-800 transition"
                    >
                        完成
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 animate-fade-in">
            <div className="bg-white rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md h-[85vh] sm:h-auto overflow-y-auto shadow-2xl relative flex flex-col">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 z-10">
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold mb-6 text-gray-900">預約法律諮詢</h2>

                {/* Lawyer Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">選擇律師</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {mockLawyers.map(lawyer => (
                            <button 
                                key={lawyer.id}
                                onClick={() => setSelectedLawyer(lawyer.id)}
                                className={`flex-shrink-0 w-28 p-3 rounded-2xl border transition-all flex flex-col items-center text-center space-y-2 ${selectedLawyer === lawyer.id ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                                <img src={lawyer.avatar} alt={lawyer.name} className="w-14 h-14 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{lawyer.name}</p>
                                    <p className="text-[10px] text-gray-500">{lawyer.specialty}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">選擇日期</h3>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium outline-none focus:border-[#8b5cf6] focus:bg-white transition-colors"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                </div>

                {/* Time Slots */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">選擇時段</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((slot, index) => (
                            <button
                                key={index}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                                    !slot.available 
                                        ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed decoration-gray-400' 
                                        : selectedTime === slot.time
                                            ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md shadow-purple-200'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#8b5cf6] hover:text-[#8b5cf6]'
                                }`}
                            >
                                <span className={!slot.available ? 'line-through' : ''}>{slot.time}</span>
                                {!slot.available && <span className="block text-[9px] font-normal mt-0.5">已預約</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!selectedTime}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition disabled:bg-gray-200 disabled:text-gray-400 mt-auto shadow-lg"
                >
                    確認預約
                </button>
            </div>
        </div>
    );
}

const LawyerLanding: React.FC<{ onStartChat: () => void, onOpenBooking: () => void }> = ({ onStartChat, onOpenBooking }) => (
    <div className="p-6 space-y-6">
        <div className="bg-[#8b5cf6] p-6 rounded-[32px] text-center shadow-xl shadow-purple-200 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="flex justify-center mb-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Bot size={32} className="text-white" />
                </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">AI 律師助理</h2>
            <p className="text-purple-100 mb-6 max-w-xs mx-auto text-sm relative z-10">24小時在線，解答數位遺產相關法律問題。</p>
            <button
                onClick={onStartChat}
                className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full text-base hover:bg-gray-50 transition w-full relative z-10 shadow-sm"
            >
                開始對話
            </button>
        </div>

        <div className="bg-white p-6 rounded-[32px] text-center border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50"></div>
             <div className="flex justify-center mb-4 relative">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={28} className="text-gray-400" />
                </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">預約真人律師</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">需要更深入的專業諮詢？預約我們的合作律師。</p>
            <button 
                onClick={onOpenBooking}
                className="bg-transparent border border-gray-300 text-gray-900 font-bold py-3 px-6 rounded-full text-sm hover:border-gray-900 transition w-full flex items-center justify-center group"
            >
                <Calendar size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                選擇時段
            </button>
        </div>

        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-3 text-gray-900">法律知識影片</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="搜尋影片..." 
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ccf381] focus:ring-1 focus:ring-[#ccf381]"
                    />
                </div>
            </div>
            <div className="space-y-3">
                {legalVideos.map((video, index) => <VideoCard key={index} {...video} />)}
            </div>
        </div>
    </div>
);

const LawyerChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: '您好，我是AI法律助理，有什麼數位遺產相關問題可以協助您嗎？' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getGeminiResponse(currentInput);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching Gemini response:", error);
            const errorMessage: Message = { sender: 'ai', text: '抱歉，我現在無法回覆。請稍後再試。' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                                <Bot size={18} />
                            </div>
                        )}
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'ai' ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm' : 'bg-[#ccf381] text-black rounded-br-none shadow-sm'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-3">
                        <div className="w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                            <Bot size={18}/>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-bl-none shadow-sm">
                           <div className="flex space-x-1.5 py-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             <div className="p-4 bg-gray-50 sticky bottom-0 border-t border-gray-200">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="輸入問題..."
                        className="w-full bg-white border border-gray-300 rounded-full py-3 pl-5 pr-14 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ccf381] focus:ring-1 focus:ring-[#ccf381]"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#ccf381] text-black rounded-full flex items-center justify-center hover:bg-[#bcea65] transition-colors disabled:bg-gray-200 disabled:text-gray-400">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const LawyerScreen: React.FC<LawyerScreenProps> = ({ setScreen, onBookingComplete }) => {
    const [view, setView] = useState<'landing' | 'chat'>('landing');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="h-full text-gray-900 flex flex-col bg-gray-50 relative overflow-hidden">
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onComplete={onBookingComplete} />
            
            <header className="p-4 text-center sticky top-0 bg-gray-50/80 backdrop-blur-xl z-20 flex items-center justify-center border-b border-gray-200">
                <button 
                    onClick={() => view === 'chat' ? setView('landing') : setScreen('home')} 
                    className="absolute left-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 z-20"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">諮詢室</h1>
            </header>

            <div className="flex-grow overflow-y-auto z-10">
               {view === 'landing' ? (
                   <LawyerLanding 
                        onStartChat={() => setView('chat')} 
                        onOpenBooking={() => setIsBookingOpen(true)}
                   />
               ) : (
                   <LawyerChat />
               )}
            </div>
        </div>
    );
};

export default LawyerScreen;
