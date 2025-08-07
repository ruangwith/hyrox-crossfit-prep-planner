
import React from 'react';
import type { WeekPlan } from '../types';
import WorkoutCard from './WorkoutCard';

interface WeekViewProps {
  weekData: WeekPlan;
  onToggleWorkout: (dayIndex: number, workoutIndex: number) => void;
}

// Rest Day Card Component
const RestDayCard: React.FC<{ day: string; weekNumber: number }> = ({ day, weekNumber }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
          {day}
        </span>
      </div>
      
      <div className="flex flex-col items-center justify-center py-8">
        {/* Moon Icon */}
        <div className="mb-4">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h3 className="text-xl font-orbitron font-bold text-gray-700 dark:text-gray-300 mb-2">
          Week {weekNumber}: Rest Day
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Recovery & regeneration time
        </p>
        
        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <div>• Focus on sleep & hydration</div>
          <div>• Light stretching or mobility</div>
          <div>• Prepare for tomorrow's session</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
          Active recovery recommended
        </span>
      </div>
    </div>
  );
};

const WeekView: React.FC<WeekViewProps> = ({ weekData, onToggleWorkout }) => {
  // Full week order with rest days included
  const completeWeekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const restDays = ["Monday", "Friday"];
  
  // Create a map of existing workout days
  const workoutDayMap = new Map(weekData.days.map(day => [day.day, day]));
  
  // Build complete week structure
  const completeWeek = completeWeekOrder.map(dayName => {
    if (restDays.includes(dayName)) {
      return { type: 'rest', day: dayName };
    } else {
      const workoutDay = workoutDayMap.get(dayName);
      return workoutDay ? { type: 'workout', day: workoutDay, originalIndex: weekData.days.findIndex(d => d.day === dayName) } : null;
    }
  }).filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {completeWeek.map((dayData, index) => {
        if (dayData!.type === 'rest') {
          return (
            <RestDayCard 
              key={`${weekData.week}-${dayData!.day}-rest`}
              day={dayData!.day} 
              weekNumber={weekData.week}
            />
          );
        } else {
          const workoutData = dayData as { type: 'workout', day: any, originalIndex: number };
          return (
            <WorkoutCard 
              key={`${weekData.week}-${workoutData.day.day}`} 
              dayPlan={workoutData.day} 
              onToggleWorkout={(workoutIndex) => onToggleWorkout(workoutData.originalIndex, workoutIndex)}
            />
          );
        }
      })}
    </div>
  );
};

export default WeekView;