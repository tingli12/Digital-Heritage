
import React, { useState } from 'react';
import { FileText, Download, Landmark, Send, Check, ArrowLeft } from 'lucide-react';
import { Screen } from '../App';

interface ExecutorScreenProps {
  setScreen: (screen: Screen) => void;
}

type Task = {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  actionText: string;
  screen?: Screen;
};

const tasks: Task[] = [
  {
    id: 1,
    icon: FileText,
    title: '閱讀並確認遺囑',
    description: '請仔細閱讀逝者留下的遺囑，並確認您了解所有內容。',
    actionText: '查看遺囑',
    screen: 'will',
  },
  {
    id: 2,
    icon: Download,
    title: '接收數位資產',
    description: '下載包含所有數位帳戶、文件和媒體的詳細清單及處理指示。',
    actionText: '接收資產',
    screen: 'assets',
  },
  {
    id: 3,
    icon: Landmark,
    title: '管理數位紀念館',
    description: '以管理員身份進入紀念館，您可以在此管理緬懷內容。',
    actionText: '進入紀念館',
    screen: 'memorial',
  },
  {
    id: 4,
    icon: Send,
    title: '通知相關親友',
    description: '系統將協助您發送通知給遺囑中指定的親友。',
    actionText: '發送通知',
  },
];

const TaskCard: React.FC<{
  task: Task;
  isCompleted: boolean;
  onComplete: (id: number) => void;
  setScreen: (screen: Screen) => void;
}> = ({ task, isCompleted, onComplete, setScreen }) => {
  const handleAction = () => {
    onComplete(task.id);
    if (task.screen) {
      setScreen(task.screen);
    }
  };

  return (
    <div className={`p-5 bg-white rounded-2xl border ${isCompleted ? 'border-[#ccf381]' : 'border-gray-100'} transition-all duration-300 flex items-start space-x-4 shadow-sm hover:shadow-md`}>
      <div className={`p-3 rounded-xl flex-shrink-0 ${isCompleted ? 'bg-[#f7fee7] text-[#65a30d]' : 'bg-gray-100 text-gray-500'}`}>
        <task.icon size={24} />
      </div>
      <div className="flex-1">
        <h2 className={`font-bold text-lg ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      </div>
      <button
        onClick={handleAction}
        disabled={isCompleted}
        className={`mt-2 py-2 px-4 rounded-full text-xs font-bold transition-colors ${isCompleted ? 'bg-transparent text-[#65a30d] flex items-center gap-1.5' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
      >
        {isCompleted ? (
          <>
            <Check size={14} /> 已完成
          </>
        ) : (
          task.actionText
        )}
      </button>
    </div>
  );
};


const ExecutorScreen: React.FC<ExecutorScreenProps> = ({ setScreen }) => {
    const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

    const handleCompleteTask = (taskId: number) => {
        setCompletedTasks(prev => new Set(prev).add(taskId));
    };

    const allTasksCompleted = completedTasks.size === tasks.length;

    return (
        <div className="min-h-full flex flex-col text-gray-900 bg-gray-50">
            <div className="p-6 flex-grow">
                 <header className="flex items-center -ml-2 mb-8">
                    <button onClick={() => setScreen('home')} className="p-2 text-gray-400 hover:text-gray-900"><ArrowLeft size={24} /></button>
                </header>
                <div className="text-left mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">執行人專區</h1>
                    <p className="text-gray-500">您好，請依照以下步驟完成數位遺產的傳承。</p>
                </div>

                <div className="space-y-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            isCompleted={completedTasks.has(task.id)}
                            onComplete={handleCompleteTask}
                            setScreen={setScreen}
                        />
                    ))}
                </div>
            </div>

            <div className="p-6 sticky bottom-0 bg-transparent">
                <button
                    disabled={!allTasksCompleted}
                    className="w-full bg-[#ccf381] text-black font-bold py-4 px-4 rounded-full text-lg shadow-xl shadow-[#ccf381]/20 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-[#bcea65]"
                >
                    {allTasksCompleted ? '傳承完畢' : `完成進度 (${completedTasks.size}/${tasks.length})`}
                </button>
            </div>
        </div>
    );
};

export default ExecutorScreen;
