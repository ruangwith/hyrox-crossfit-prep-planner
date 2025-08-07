import React from 'react';
import type { FullPlan } from '../types';
import { TrashIcon, DumbbellIcon } from './Icons';

interface SavedPlansProps {
  plans: FullPlan[];
  onLoadPlan: (plan: FullPlan) => void;
  onDeletePlan: (planId: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Beginner') return 'text-green-400';
    if (difficulty === 'Intermediate') return 'text-blue-400';
    if (difficulty === 'Advanced') return 'text-red-400';
    return 'text-gray-400';
}

const SavedPlans: React.FC<SavedPlansProps> = ({ plans, onLoadPlan, onDeletePlan }) => {
  if (plans.length === 0) {
    return (
      <div className="text-center py-20">
        <DumbbellIcon className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white font-orbitron">No Saved Plans</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Generate a plan and click the "Save" button to keep it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-orbitron border-b border-gray-300 dark:border-gray-700 pb-4">My Saved Plans</h1>
      {plans.map(plan => (
        <div 
          key={plan.id}
          className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <div>
            <p className={`font-bold text-xl font-orbitron ${getDifficultyColor(plan.difficulty)}`}>
              {plan.difficulty} Plan
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Saved on: {new Date(parseInt(plan.id.split('_')[1])).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onLoadPlan(plan)}
              className="flex-1 sm:flex-none justify-center bg-accent hover:bg-accent-dark text-gray-900 font-bold py-2 px-4 rounded-md transition-colors w-full"
            >
              Load
            </button>
            <button
              onClick={() => onDeletePlan(plan.id)}
              className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100 dark:hover:bg-red-900/50"
              aria-label="Delete plan"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedPlans;