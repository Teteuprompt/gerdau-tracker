import React from 'react';
import { OrderEntry } from '../types';
import { PRICE_PER_POSITION } from '../constants';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface DashboardProps {
  entries: OrderEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
  
  // Filter for current month
  const currentMonthEntries = entries.filter(e => e.date.startsWith(currentMonthStr));
  
  const totalPositions = currentMonthEntries.reduce((sum, e) => sum + e.totalPositions, 0);
  const totalRevenue = totalPositions * PRICE_PER_POSITION;

  // Prepare Chart Data (Group by Day)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dayStr = `${currentMonthStr}-${String(dayNum).padStart(2, '0')}`;
    const dayEntries = currentMonthEntries.filter(e => e.date === dayStr);
    const dayPos = dayEntries.reduce((sum, e) => sum + e.totalPositions, 0);
    return {
      day: dayNum,
      revenue: dayPos * PRICE_PER_POSITION
    };
  });

  // Only show days up to today or if they have data
  const visibleChartData = chartData.filter(d => d.day <= today.getDate() || d.revenue > 0);

  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-24">
       <header className="bg-blue-600 dark:bg-blue-800 text-white p-6 rounded-b-3xl shadow-lg transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Faturamento Estimado</p>
            <h1 className="text-3xl font-bold mt-1 capitalize">{monthName}</h1>
          </div>
          <div className="bg-blue-500/30 p-2 rounded-lg backdrop-blur-sm">
             <Calendar className="text-blue-50" size={24} />
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight">R$ {totalRevenue.toFixed(2).replace('.', ',')}</span>
        </div>
        <p className="text-blue-200 text-sm mt-2 flex items-center gap-2">
           <TrendingUp size={16} />
           Baseado em {totalPositions} posições
        </p>
      </header>

      <div className="px-4 -mt-4">
         <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" />
              Evolução Diária
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visibleChartData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{fontSize: 10}} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', color: '#1e293b'}}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {visibleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.day === today.getDate() ? '#2563eb' : '#93c5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="px-4">
        <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-3 px-1">Detalhes do Mês</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Posições</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalPositions}</p>
          </div>
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Valor Unitário</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">R$ {PRICE_PER_POSITION.toFixed(2)}</p>
          </div>
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm col-span-2 transition-colors">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Dias Trabalhados</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {new Set(currentMonthEntries.map(e => e.date)).size} dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};