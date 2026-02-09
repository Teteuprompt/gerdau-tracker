import React from 'react';
import { OrderEntry, MonthlyStatus } from '../types';
import { PRICE_PER_POSITION } from '../constants';
import { CheckCircle2, Circle, Clock, ChevronRight, Download, Cloud, Smartphone } from 'lucide-react';

interface HistoryProps {
  entries: OrderEntry[];
  statuses: MonthlyStatus[];
  onUpdateStatus: (monthKey: string, status: MonthlyStatus['status']) => void;
  onExport: () => void;
  installPrompt: any;
  onInstall: () => void;
}

export const History: React.FC<HistoryProps> = ({ entries, statuses, onUpdateStatus, onExport, installPrompt, onInstall }) => {
  
  // Group entries by month
  const grouped = entries.reduce((acc, entry) => {
    const monthKey = entry.date.slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey,
        totalPositions: 0,
        entries: []
      };
    }
    acc[monthKey].totalPositions += entry.totalPositions;
    acc[monthKey].entries.push(entry);
    return acc;
  }, {} as Record<string, { monthKey: string, totalPositions: number, entries: OrderEntry[] }>);

  const sortedMonths = Object.keys(grouped).sort().reverse();

  const getStatus = (key: string): MonthlyStatus['status'] => {
    return statuses.find(s => s.monthKey === key)?.status || 'pending';
  };

  const formatMonth = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'invoiced': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'paid': return 'Pago';
      case 'invoiced': return 'Faturado';
      default: return 'Aberto';
    }
  };

  const cycleStatus = (key: string, current: string) => {
    if (current === 'pending') onUpdateStatus(key, 'invoiced');
    else if (current === 'invoiced') onUpdateStatus(key, 'paid');
    else onUpdateStatus(key, 'pending');
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="bg-white dark:bg-slate-900 p-4 shadow-sm rounded-b-2xl border-b dark:border-slate-800 transition-colors">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Histórico de Pagamentos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie seus recebimentos mensais</p>
      </header>

      <div className="px-4 space-y-3">
        {installPrompt && (
          <button
            onClick={onInstall}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-4 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <div className="bg-white/20 p-2 rounded-lg">
                <Smartphone size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Instalar Aplicativo</p>
              <p className="text-xs text-emerald-100">Adicionar à tela inicial</p>
            </div>
            <Download size={20} className="ml-auto opacity-70" />
          </button>
        )}

        <button
          onClick={onExport}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white p-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <div className="bg-white/20 p-2 rounded-lg">
             <Cloud size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Fazer Backup dos Dados</p>
            <p className="text-xs text-indigo-100">Salvar arquivo para o Google Drive</p>
          </div>
          <Download size={20} className="ml-auto opacity-70" />
        </button>
      </div>

      <div className="px-4 space-y-4">
        {sortedMonths.length === 0 ? (
           <div className="text-center p-12 text-slate-400 dark:text-slate-600">
             <p>Nenhum histórico disponível ainda.</p>
           </div>
        ) : (
          sortedMonths.map(key => {
            const data = grouped[key];
            const revenue = data.totalPositions * PRICE_PER_POSITION;
            const status = getStatus(key);

            return (
              <div key={key} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{formatMonth(key)}</h3>
                    <button 
                      onClick={() => cycleStatus(key, status)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 transition-colors ${getStatusColor(status)}`}
                    >
                      {status === 'paid' && <CheckCircle2 size={12} />}
                      {status === 'invoiced' && <Clock size={12} />}
                      {status === 'pending' && <Circle size={12} />}
                      {getStatusLabel(status)}
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">Faturamento</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">R$ {revenue.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">Posições</p>
                       <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{data.totalPositions}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 transition-colors">
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>{data.entries.length} pedidos no mês</span>
                    <button 
                      className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300"
                       onClick={() => alert(`Resumo de ${formatMonth(key)}:\n${data.entries.map(e => `- Pedido ${e.orderNumber}: ${e.totalPositions} pos`).join('\n')}`)}
                    >
                      Ver detalhes <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};