import React from 'react';
import { LayoutDashboard, PlusCircle, History, FileText } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItemClass = (tab: Tab) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentTab === tab 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transition-colors">
      <div className="flex h-full max-w-md mx-auto">
        <button
          onClick={() => onTabChange(Tab.ENTRY)}
          className={navItemClass(Tab.ENTRY)}
        >
          <PlusCircle size={24} />
          <span className="text-[10px] font-medium">Lançar</span>
        </button>
        <button
          onClick={() => onTabChange(Tab.ORDERS)}
          className={navItemClass(Tab.ORDERS)}
        >
          <FileText size={24} />
          <span className="text-[10px] font-medium">Pedidos</span>
        </button>
        <button
          onClick={() => onTabChange(Tab.DASHBOARD)}
          className={navItemClass(Tab.DASHBOARD)}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Faturamento</span>
        </button>
        <button
          onClick={() => onTabChange(Tab.HISTORY)}
          className={navItemClass(Tab.HISTORY)}
        >
          <History size={24} />
          <span className="text-[10px] font-medium">Histórico</span>
        </button>
      </div>
    </nav>
  );
};