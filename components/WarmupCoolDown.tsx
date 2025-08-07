
import React from 'react';
import type { Routine } from '../types';
import { ChevronDownIcon } from './Icons';

interface WarmupCoolDownProps {
  warmUp: Routine;
  coolDown: Routine;
}

const RoutineSection: React.FC<{ routine: Routine }> = ({ routine }) => (
  <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-colors duration-300 open:ring-1 open:ring-accent/50 open:shadow-lg">
    <summary className="flex justify-between items-center font-semibold cursor-pointer text-gray-800 dark:text-gray-100">
      <div className="flex items-center gap-3">
          <span className="font-orbitron text-lg">{routine.title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">({routine.duration})</span>
      </div>
      <ChevronDownIcon className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
    </summary>
    <ul className="mt-4 pl-2 space-y-2 text-gray-600 dark:text-gray-300">
      {routine.exercises.map((exercise, index) => (
        <li key={index} className="flex items-center">
            <span className="text-accent mr-3">&#9679;</span>
            <span>{exercise}</span>
        </li>
      ))}
    </ul>
  </details>
);

const WarmupCoolDown: React.FC<WarmupCoolDownProps> = ({ warmUp, coolDown }) => {
  return (
    <div className="space-y-4">
      <RoutineSection routine={warmUp} />
      <RoutineSection routine={coolDown} />
    </div>
  );
};

export default WarmupCoolDown;
