
import React from 'react';
import type { WeekPlan } from '../types';
import WorkoutCard from './WorkoutCard';

interface WeekViewProps {
  weekData: WeekPlan;
  onToggleWorkout: (dayIndex: number, workoutIndex: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ weekData, onToggleWorkout }) => {
  const dayOrder = ["Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"];
  
  const sortedDays = [...weekData.days].sort((a, b) => {
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedDays.map((dayPlan) => {
        const originalDayIndex = weekData.days.findIndex(d => d.day === dayPlan.day);
        return (
          <WorkoutCard 
            key={`${weekData.week}-${dayPlan.day}`} 
            dayPlan={dayPlan} 
            onToggleWorkout={(workoutIndex) => onToggleWorkout(originalDayIndex, workoutIndex)}
          />
        )
      })}
    </div>
  );
};

export default WeekView;