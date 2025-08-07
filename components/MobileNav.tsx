import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GeneratorIcon, PlansIcon, SaveIcon } from './Icons';

interface MobileNavProps {
    view: 'generate' | 'myPlans';
    setView: (view: 'generate' | 'myPlans') => void;
    canSavePlan: boolean;
    onSavePlan: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ view, setView, canSavePlan, onSavePlan }) => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const NavButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
        disabled?: boolean;
    }> = ({ label, icon, isActive, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 min-h-12 px-2 ${
                isActive ? 'text-accent' : 'text-gray-500 dark:text-gray-400'
            } ${
                disabled
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'hover:text-accent-dark dark:hover:text-accent-light'
            }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-50 safe-bottom">
            <div className="flex justify-around items-center h-16">
                <NavButton
                    label="Generate"
                    icon={<GeneratorIcon className="w-6 h-6 mb-1" />}
                    isActive={view === 'generate'}
                    onClick={() => setView('generate')}
                />
                <NavButton
                    label="My Plans"
                    icon={<PlansIcon className="w-6 h-6 mb-1" />}
                    isActive={view === 'myPlans'}
                    onClick={() => setView('myPlans')}
                />
                 <NavButton
                    label="Save"
                    icon={<SaveIcon className="w-6 h-6 mb-1" />}
                    isActive={false} // Save button is never 'active' in a navigation sense
                    onClick={onSavePlan}
                    disabled={!canSavePlan}
                />
            </div>
        </nav>
    );
};

export default MobileNav;
