
import React, { useState, useCallback } from 'react';
import { TaskType, GradingResult } from './types';
import { gradeWriting } from './geminiService';
import UploadStep from './components/UploadStep';
import ResultView from './components/ResultView';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'loading' | 'result'>('upload');
  const [taskType, setTaskType] = useState<TaskType>(TaskType.PART6);
  const [loadingMessage, setLoadingMessage] = useState('AI 考官正在审阅你的作文...');
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGrading = async (images: { prompt: string; answer: string }[]) => {
    setCurrentStep('loading');
    setError(null);
    
    // Encouraging rotating messages
    const messages = [
      '正在识别手写内容...',
      '正在分析语法结构...',
      '根据剑桥官方标准进行打分...',
      '正在生成针对性的修改建议...',
      '即将揭晓评分结果...'
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 3000);

    try {
      const gradingResult = await gradeWriting(taskType, images);
      setResult(gradingResult);
      setCurrentStep('result');
    } catch (err: any) {
      console.error(err);
      setError('评分过程中出现错误，请检查网络或图片质量后重试。');
      setCurrentStep('upload');
    } finally {
      clearInterval(interval);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep('upload');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <header className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KET Writing AI Examiner</h1>
            <p className="text-gray-500 text-sm">剑桥官方标准 AI 批改系统</p>
          </div>
        </div>
        {currentStep === 'result' && (
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            新批改
          </button>
        )}
      </header>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-center font-medium border-b border-red-100">
            {error}
          </div>
        )}

        {currentStep === 'upload' && (
          <UploadStep 
            taskType={taskType} 
            setTaskType={setTaskType} 
            onStart={handleStartGrading} 
          />
        )}

        {currentStep === 'loading' && (
          <LoadingState message={loadingMessage} />
        )}

        {currentStep === 'result' && result && (
          <ResultView result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2024 KET AI 考官批改系统 - 基于剑桥 A2 Key 官方评分准则</p>
      </footer>
    </div>
  );
};

export default App;
