
import React from 'react';
import { GradingResult } from '../types';

interface ResultViewProps {
  result: GradingResult;
  onReset: () => void;
}

const ScoreBadge: React.FC<{ score: number; max: number }> = ({ score, max }) => (
  <div className="text-lg font-bold text-gray-800">
    {score}<span className="text-sm text-gray-400 font-normal">/{max}</span>
  </div>
);

const FeedbackTable: React.FC<{ feedback: any[]; scores: any }> = ({ feedback, scores }) => {
  // Map dimensions to their codes for the table
  const dimensionMap: Record<string, string> = {
    'Content': 'Content (C)',
    'Organisation': 'Organisation (O)',
    'Language': 'Language (L)',
    'Content (C)': 'Content (C)',
    'Organisation (O)': 'Organisation (O)',
    'Language (L)': 'Language (L)'
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">维度</th>
            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-24">得分</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">考官点评</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {feedback.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5 align-top">
                <span className="font-bold text-gray-900">{dimensionMap[item.dimension] || item.dimension}</span>
              </td>
              <td className="px-4 py-5 align-top text-center">
                <span className="font-bold text-blue-600">{item.score}/5</span>
              </td>
              <td className="px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {item.comments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Footer / Summary Row */}
      <div className="bg-green-50/80 p-5 flex items-center justify-between border-t border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <span className="font-bold text-green-900 text-lg">
            原始分：{scores.content} + {scores.organisation} + {scores.language} = {scores.totalRaw} / 15 
            <span className="mx-3 text-green-400">→</span> 
            {scores.scaleScore}分 ({scores.cefrLevel})
          </span>
        </div>
        <div className="text-green-600 animate-bounce">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
           </svg>
        </div>
      </div>
    </div>
  );
};

const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const tasks = result.tasks || [];

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700 overflow-y-auto max-h-[85vh]">
      {/* Global Result Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">KET Writing Final Score</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black">{result.totalScaleScore}</span>
                <span className="text-2xl font-bold opacity-80">Points</span>
              </div>
              <div className="mt-2 inline-flex items-center px-4 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md">
                CEFR Level: {result.overallCefrLevel}
              </div>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed italic opacity-90 border-l-2 border-white/30 pl-4">
                "{result.overallSummary}"
              </p>
            </div>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Tasks Breakdown */}
      {tasks.map((task, idx) => (
        <div key={idx} className="space-y-8 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black">
               {idx + 1}
             </div>
             <h3 className="text-2xl font-black text-gray-900">{task.taskName} 详细报告</h3>
          </div>

          <FeedbackTable feedback={task.feedback || []} scores={task.scores || {}} />

          {/* Detailed Corrections */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
             <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                精细化批改解析
             </h4>
             <div className="space-y-6">
                {(task.corrections || []).map((c, ci) => (
                  <div key={ci} className="group border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Original / 原文</div>
                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm italic font-medium group-hover:bg-red-100 transition-colors">"{c.original}"</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Corrected / 修改后</div>
                        <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm font-bold group-hover:bg-green-100 transition-colors">"{c.corrected}"</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg flex gap-2">
                       <span className="font-bold text-blue-600 shrink-0">考官解析:</span>
                       <span>{c.explanation}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="bg-gray-900 text-white rounded-3xl p-8 relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-yellow-400 rounded-lg text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  学习提升路径
               </h4>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(task.improvementSuggestions || []).map((s, si) => (
                   <li key={si} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                     <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">{si + 1}</span>
                     <p className="text-sm leading-relaxed opacity-90">{s}</p>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      ))}

      <div className="pt-8 flex justify-center pb-8">
        <button 
          onClick={onReset}
          className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-1 transition-all"
        >
          批改下一篇作文
        </button>
      </div>
    </div>
  );
};

export default ResultView;
