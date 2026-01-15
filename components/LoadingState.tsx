
import React from 'react';

const LoadingState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-blue-50/30">
      <div className="relative mb-10">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
            </div>
        </div>
      </div>
      <p className="text-xl font-bold text-gray-800 animate-bounce">{message}</p>
      <div className="mt-8 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping delay-75"></div>
        <div className="w-2 h-2 rounded-full bg-blue-200 animate-ping delay-150"></div>
      </div>
      <p className="mt-12 text-gray-400 text-sm italic">"Practice makes perfect. AI helps you grow."</p>
    </div>
  );
};

export default LoadingState;
