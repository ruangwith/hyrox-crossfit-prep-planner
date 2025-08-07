
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { generateWorkoutPlan } from './services/geminiService';
import type { FullPlan, Difficulty, Workout } from './types';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import WeekView from './components/WeekView';
import WarmupCoolDown from './components/WarmupCoolDown';
import ErrorDisplay from './components/ErrorDisplay';
import AuthModal from './components/AuthModal';
import DifficultySelector from './components/DifficultySelector';
import SavedPlans from './components/SavedPlans';
import MobileNav from './components/MobileNav';

type Theme = 'light' | 'dark';
type View = 'generate' | 'myPlans';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [workoutPlan, setWorkoutPlan] = useState<FullPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [view, setView] = useState<View>('generate');
  
  const { isAuthModalOpen, setAuthModalOpen, user, savedPlans, savePlan, deletePlan } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const addCompletedFlagToPlan = (plan: Omit<FullPlan, 'id' | 'difficulty'> | FullPlan): FullPlan => {
    const planWithCompleted = JSON.parse(JSON.stringify(plan));
    planWithCompleted.weeklyPlan.forEach((week: any) => {
        week.days.forEach((day: any) => {
            day.workouts.forEach((workout: Workout) => {
                // Add completed flag if it doesn't exist (for loading old plans)
                if (workout.completed === undefined) {
                    workout.completed = false;
                }
            });
        });
    });
    return planWithCompleted;
  };

  const handleGeneratePlan = async (selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    setWorkoutPlan(null);
    try {
      const plan = await generateWorkoutPlan(selectedDifficulty);
      const planWithMeta: FullPlan = { ...plan, id: `plan_${Date.now()}`, difficulty: selectedDifficulty };
      const fullPlan = addCompletedFlagToPlan(planWithMeta);
      setWorkoutPlan(fullPlan);
      setActiveWeek(1);
      setView('generate');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate a new workout plan. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWorkout = (dayIndex: number, workoutIndex: number) => {
    if (!workoutPlan) return;

    const newPlan = JSON.parse(JSON.stringify(workoutPlan));
    const weekData = newPlan.weeklyPlan.find((w: any) => w.week === activeWeek);

    if (weekData && weekData.days[dayIndex] && weekData.days[dayIndex].workouts[workoutIndex]) {
        weekData.days[dayIndex].workouts[workoutIndex].completed = !weekData.days[dayIndex].workouts[workoutIndex].completed;
        setWorkoutPlan(newPlan);
    }
  };

  const handleSavePlan = () => {
    if (workoutPlan && user) {
      if (savedPlans.some(p => p.id === workoutPlan.id)) {
        toast.error('This plan is already saved.');
        return;
      }
      savePlan(workoutPlan);
      toast.success('Workout plan saved!');
    }
  };

  const handleLoadPlan = (plan: FullPlan) => {
    const fullPlan = addCompletedFlagToPlan(plan);
    setWorkoutPlan(fullPlan);
    setActiveWeek(1);
    setView('generate');
    toast.success(`Loaded plan: ${plan.difficulty} regimen`);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
    toast.error('Workout plan deleted.');
  };

  const currentWeekData = workoutPlan?.weeklyPlan.find(w => w.week === activeWeek);
  const canSavePlan = !!workoutPlan && !!user && !savedPlans.some(p => p.id === workoutPlan.id)

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
          className: 'dark:bg-gray-700 dark:text-white',
          duration: 3000,
      }}/>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <Header
          theme={theme}
          setTheme={setTheme}
          view={view}
          setView={setView}
          canSavePlan={canSavePlan}
          onSavePlan={handleSavePlan}
        />
        <main className="container mx-auto p-4 md:p-8 pb-20 sm:pb-8 safe-bottom">
          {view === 'generate' && (
            <>
              <div className="mb-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <DifficultySelector selectedDifficulty={difficulty} onDifficultyChange={d => setDifficulty(d)} />
                <button
                  onClick={() => handleGeneratePlan(difficulty)}
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-gray-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 mobile-button"
                >
                  <span>{isLoading ? 'Generating...' : 'Generate New Plan'}</span>
                </button>
              </div>

              {isLoading && <LoadingSpinner />}
              {error && !isLoading && <ErrorDisplay message={error} />}
              {!isLoading && !error && workoutPlan && currentWeekData && (
                <>
                  <WarmupCoolDown warmUp={workoutPlan.warmUp} coolDown={workoutPlan.coolDown} />
                  <div className="my-8">
                    <div className="flex justify-center items-center space-x-2 sm:space-x-4 border-b border-gray-300 dark:border-gray-700 mb-6">
                      {workoutPlan.weeklyPlan.map(w => (
                        <button
                          key={w.week}
                          onClick={() => setActiveWeek(w.week)}
                          className={`font-orbitron font-medium text-lg md:text-xl py-3 px-4 md:px-6 transition-colors duration-200 focus:outline-none ${activeWeek === w.week ? 'border-b-2 border-accent text-accent' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                          WEEK {w.week}
                        </button>
                      ))}
                    </div>
                    <WeekView 
                      weekData={currentWeekData} 
                      onToggleWorkout={handleToggleWorkout} 
                    />
                  </div>
                </>
              )}
            </>
          )}

          {view === 'myPlans' && (
             <SavedPlans 
                plans={savedPlans}
                onLoadPlan={handleLoadPlan}
                onDeletePlan={handleDeletePlan}
             />
          )}

        </main>
        <MobileNav 
            view={view}
            setView={setView}
            canSavePlan={canSavePlan}
            onSavePlan={handleSavePlan}
        />
      </div>
    </>
  );
};

export default App;