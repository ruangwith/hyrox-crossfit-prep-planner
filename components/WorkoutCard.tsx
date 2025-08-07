import React from 'react';
import type { DayPlan } from '../types';

interface WorkoutCardProps {
  dayPlan: DayPlan;
  onToggleWorkout: (workoutIndex: number) => void;
}

const getDayColor = (dayTitle: string) => {
    if (dayTitle.includes('Push')) return 'bg-blue-500/10 border-blue-500 text-blue-300';
    if (dayTitle.includes('Pull')) return 'bg-purple-500/10 border-purple-500 text-purple-300';
    if (dayTitle.includes('Leg')) return 'bg-green-500/10 border-green-500 text-green-300';
    if (dayTitle.includes('HIIT')) return 'bg-red-500/10 border-red-500 text-red-300';
    if (dayTitle.includes('Endurance')) return 'bg-orange-500/10 border-orange-500 text-orange-300';
    return 'bg-gray-500/10 border-gray-500 text-gray-300';
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ dayPlan, onToggleWorkout }) => {
  const { day, title, notes, workouts } = dayPlan;
  const colorClasses = getDayColor(title);

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className={`p-4 border-l-4 ${colorClasses.replace('bg-', 'border-')}`}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{day}</h3>
        <h2 className="text-2xl font-orbitron font-bold text-gray-800 dark:text-white mt-1">{title}</h2>
        {notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">Note: {notes}</p>}
      </div>

      <div className="p-5 flex-grow">
        <ul className="space-y-3">
          {workouts.map((workout, index) => (
            <li key={index}>
              <label className="flex items-start cursor-pointer group">
                <div className="flex items-center h-6">
                   <input
                    type="checkbox"
                    checked={workout.completed}
                    onChange={() => onToggleWorkout(index)}
                    className="form-checkbox h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-accent focus:ring-accent/50 dark:ring-offset-gray-800 transition duration-150 ease-in-out"
                  />
                </div>
                <div className={`ml-3 text-sm transition-colors duration-200 ${workout.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                    <p className="font-semibold">{workout.name}</p>
                    <p className={`text-sm ${workout.completed ? '' : 'text-gray-600 dark:text-gray-400'}`}>{workout.details}</p>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutCard;