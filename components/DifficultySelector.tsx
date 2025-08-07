import React from 'react';
import type { Difficulty } from '../types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onDifficultyChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 font-orbitron">Select Difficulty</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
        {difficulties.map(level => (
          <button
            key={level}
            onClick={() => onDifficultyChange(level)}
            className={`w-full py-2 px-1 text-center text-sm sm:text-base font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/80
              ${selectedDifficulty === level
                ? 'bg-white dark:bg-gray-900 text-accent-dark dark:text-white shadow'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
              }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
