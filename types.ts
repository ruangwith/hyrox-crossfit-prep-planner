export interface Workout {
  name: string;
  details: string;
  completed: boolean;
}

export interface DayPlan {
  day: string;
  title: string;
  notes: string;
  workouts: Workout[];
}

export interface WeekPlan {
  week: number;
  days: DayPlan[];
}

export interface Routine {
    title: string;
    duration: string;
    exercises: string[];
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface FullPlan {
    id: string;
    difficulty: Difficulty;
    warmUp: Routine;
    coolDown: Routine;
    weeklyPlan: WeekPlan[];
}

export interface User {
  id: string;
  email: string;
}