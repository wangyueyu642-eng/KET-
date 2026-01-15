
import React, { useState } from 'react';
import { TaskType } from '../types';

interface UploadStepProps {
  taskType: TaskType;
  setTaskType: (type: TaskType) => void;
  onStart: (images: { prompt: string; answer: string }[]) => void;
}

const UploadCard: React.FC<{
  title: string;
  onFileSelect: (base64: string) => void;
  preview: string | null;
}> = ({ title, onFileSelect, preview }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{title}</label>
      <div className={`relative border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center overflow-hidden transition-all ${preview ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            <span className="text-xs">点击拍照或上传图片</span>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
      </div>
    </div>
  );
};

const UploadStep: React.FC<UploadStepProps> = ({ taskType, setTaskType, onStart }) => {
  const [task1, setTask1] = useState<{ prompt: string | null; answer: string | null }>({ prompt: null, answer: null });
  const [task2, setTask2] = useState<{ prompt: string | null; answer: string | null }>({ prompt: null, answer: null });

  const isReady = taskType === TaskType.BOTH 
    ? (task1.prompt && task1.answer && task2.prompt && task2.answer)
    : (task1.prompt && task1.answer);

  const handleSubmit = () => {
    if (taskType === TaskType.BOTH) {
      onStart([
        { prompt: task1.prompt!, answer: task1.answer! },
        { prompt: task2.prompt!, answer: task2.answer! }
      ]);
    } else {
      onStart([{ prompt: task1.prompt!, answer: task1.answer! }]);
    }
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
          选择考试题型
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[TaskType.PART6, TaskType.PART7, TaskType.BOTH].map((type) => (
            <button
              key={type}
              onClick={() => setTaskType(type)}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${taskType === type ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
            >
              <div className="font-bold">{type}</div>
              <div className="text-xs mt-1 opacity-70">
                {type === TaskType.PART6 && 'Short Message'}
                {type === TaskType.PART7 && 'Short Story'}
                {type === TaskType.BOTH && 'Combined Correction'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
          上传图片 (题目 & 作文)
        </h2>

        <div className="space-y-12">
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-md font-bold text-gray-600 mb-4 bg-gray-50 p-2 px-4 rounded-lg inline-block">
              {taskType === TaskType.BOTH ? 'Task 1 (Part 6)' : taskType}
            </h3>
            <div className="flex gap-4">
              <UploadCard 
                title="题目图片" 
                preview={task1.prompt} 
                onFileSelect={(b64) => setTask1({ ...task1, prompt: b64 })} 
              />
              <UploadCard 
                title="作文图片" 
                preview={task1.answer} 
                onFileSelect={(b64) => setTask1({ ...task1, answer: b64 })} 
              />
            </div>
          </div>

          {taskType === TaskType.BOTH && (
            <div className="animate-in fade-in slide-in-from-bottom-2 delay-100">
              <h3 className="text-md font-bold text-gray-600 mb-4 bg-gray-50 p-2 px-4 rounded-lg inline-block">Task 2 (Part 7)</h3>
              <div className="flex gap-4">
                <UploadCard 
                  title="题目图片" 
                  preview={task2.prompt} 
                  onFileSelect={(b64) => setTask2({ ...task2, prompt: b64 })} 
                />
                <UploadCard 
                  title="作文图片" 
                  preview={task2.answer} 
                  onFileSelect={(b64) => setTask2({ ...task2, answer: b64 })} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <button
          disabled={!isReady}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${isReady ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          开始 AI 智能批改
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
